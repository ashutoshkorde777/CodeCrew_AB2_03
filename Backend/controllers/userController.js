import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { json } from 'express';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay';

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    // Validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' });
    }

    // Validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a strong password' });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log('Generated Token:', token); // Log the generated token

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select('-password');

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching user data for userId:', userId); // Debugging
    const userData = await userModel.findById(userId).select('-password');

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('User data fetched:', userData); // Debugging
    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Error fetching user data:', error); // Debugging
    res.status(500).json({ success: false, message: error.message });
  }
};
// Add this function to your userController.js

// API to update user profile (including medical history)
const updateProfile = async (req, res) => {
  try {
    const {
      userId,
      name,
      phone,
      address,
      dob,
      gender,
      bloodGroup,
      allergies,
      chronicDiseases,
      surgeries,
      medications,
    } = req.body;

    // Extract emergencyContacts from the request body
    const emergencyContacts = req.body.emergencyContacts || [];

    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data Missing' });
    }

    // Prepare update data
    const updateData = {
      name,
      phone,
      address: JSON.parse(address), // Parse address from JSON string
      dob,
      gender,
      bloodGroup,
      allergies,
      chronicDiseases,
      surgeries,
      medications,
      emergencyContacts, // Directly use the array of objects
    };

    // Update user profile
    await userModel.findByIdAndUpdate(userId, updateData);

    // Handle image upload
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: 'Profile Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime, symptoms } = req.body;

    const docData = await doctorModel.findById(docId).select('-password');

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' });
    }

    // We are getting slots booking data from docData
    let slots_booked = docData.slots_booked;

    // Checking for slots availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime); // In first if statement, if date is available, then this else will execute
    }

    const userData = await userModel.findById(userId).select('-password');
    // Here we get the user data

    delete docData.slots_booked;
    // We have to save data in the appointmentData also, so it will be unnecessary if we keep it, so we have deleted the slots_booked from docData

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      symptoms,
      date: Date.now(), // It will give current date and time
    };

    // To save the data in the database
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment booked' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointment for frontend my-appointment page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel the appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    // Verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment Cancelled' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment of appointment using Razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment cancelled or not found' });
    }

    // Creating options for Razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // Creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify the payment of Razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      res.json({ success: true, message: 'Payment Successful' });
    } else {
      res.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const getMedicalHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user data excluding the password
    const userData = await userModel.findById(userId).select('-password');

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Extract medical history fields
    const medicalHistory = {
      bloodGroup: userData.bloodGroup || '',
      allergies: userData.allergies || '',
      chronicDiseases: userData.chronicDiseases || '',
      surgeries: userData.surgeries || '',
      medications: userData.medications || '',
      emergencyContacts: userData.emergencyContacts || [],
    };

    res.json({ success: true, data: medicalHistory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Add this function to userController.js
const getPatientProfile = async (req, res) => {
  try {
      const { userId } = req.params;

      // Validate userId
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ success: false, message: 'Invalid userId' });
      }

      // Fetch user data excluding the password
      const userData = await userModel.findById(userId).select('-password');

      if (!userData) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Extract medical history fields
      const medicalHistory = {
          bloodGroup: userData.bloodGroup || '',
          allergies: userData.allergies || '',
          chronicDiseases: userData.chronicDiseases || '',
          surgeries: userData.surgeries || '',
          medications: userData.medications || '',
          emergencyContacts: userData.emergencyContacts || [],
      };

      // Return user profile and medical history
      res.json({
          success: true,
          user: userData,
          medicalHistory,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
  }
};
export {
  registerUser,
  loginUser,
  getProfile,
  getUserById,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  getMedicalHistory,
  getPatientProfile,
};