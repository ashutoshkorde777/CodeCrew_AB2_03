import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState({
    bloodGroup: '',
    allergies: '',
    chronicDiseases: '',
    surgeries: '',
    medications: '',
    emergencyContacts: [],
  });

  // Fetch medical history when the component mounts
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/medical-history/${userData._id}`, {
          headers: { token },
        });
        if (data.success) {
          setMedicalHistory({
            bloodGroup: data.data.bloodGroup || '',
            allergies: data.data.allergies || '',
            chronicDiseases: data.data.chronicDiseases || '',
            surgeries: data.data.surgeries || '',
            medications: data.data.medications || '',
            emergencyContacts: data.data.emergencyContacts || [],
          });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch medical history');
      }
    };

    if (userData && userData._id) {
      fetchMedicalHistory();
    }
  }, [userData, token, backendUrl]);

  // Function to update user profile data
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', userData._id);
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address)); // Convert to JSON string
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      formData.append('bloodGroup', medicalHistory.bloodGroup);
      formData.append('allergies', medicalHistory.allergies); // Already a string
      formData.append('chronicDiseases', medicalHistory.chronicDiseases); // Already a string
      formData.append('surgeries', medicalHistory.surgeries); // Already a string
      formData.append('medications', medicalHistory.medications); // Already a string
  
      // Send emergencyContacts as an array of objects
      medicalHistory.emergencyContacts.forEach((contact, index) => {
        formData.append(`emergencyContacts[${index}][name]`, contact.name);
        formData.append(`emergencyContacts[${index}][phone]`, contact.phone);
        formData.append(`emergencyContacts[${index}][relationship]`, contact.relationship);
      });
  
      if (image) {
        formData.append('image', image);
      }
  
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });
  
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData(); // Reload user data after update
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update profile');
    }
  };

  // Function to handle changes in medical history fields
  const handleMedicalHistoryChange = (field, value) => {
    setMedicalHistory((prev) => ({ ...prev, [field]: value }));
  };

  // Function to handle changes in emergency contacts
  const handleEmergencyContactChange = (index, field, value) => {
    const updatedContacts = [...medicalHistory.emergencyContacts];
    updatedContacts[index][field] = value;
    setMedicalHistory((prev) => ({ ...prev, emergencyContacts: updatedContacts }));
  };

  return (
    userData && (
      <div className="flex flex-col md:flex-row gap-8 p-6 max-w-6xl mx-auto">
        {/* Left Column: Profile Information */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
          {/* Image section */}
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer">
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-primary">
                <img
                  className="w-full h-full object-cover"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <img className="w-8 h-8" src={assets.upload_icon} alt="Upload" />
                </div>
              </div>
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
            </label>
          ) : (
            <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-primary">
              <img className="w-full h-full object-cover" src={userData.image} alt="Profile" />
            </div>
          )}

          {/* Name section */}
          {isEdit ? (
            <input
              className="bg-gray-100 text-3xl font-semibold mt-6 p-2 rounded w-full"
              type="text"
              value={userData.name}
              onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <p className="font-semibold text-3xl text-neutral-800 mt-6">{userData.name}</p>
          )}

          <hr className="border-t border-gray-300 my-6" />

          {/* Contact Information */}
          <div>
            <p className="text-neutral-700 text-lg font-semibold">CONTACT INFORMATION</p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-4 text-neutral-700">
              <p className="font-medium">Email id:</p>
              <p className="text-gray-600">{userData.email}</p>

              <p className="font-medium">Phone:</p>
              {isEdit ? (
                <input
                  className="bg-gray-100 p-2 rounded w-full"
                  type="text"
                  value={userData.phone}
                  onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <p className="text-gray-600">{userData.phone}</p>
              )}

              <p className="font-medium">Address:</p>
              {isEdit ? (
                <div className="space-y-2">
                  <input
                    className="bg-gray-100 p-2 rounded w-full"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={userData.address.line1}
                    type="text"
                  />
                  <input
                    className="bg-gray-100 p-2 rounded w-full"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={userData.address.line2}
                    type="text"
                  />
                </div>
              ) : (
                <p className="text-gray-600">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="mt-6">
            <p className="text-neutral-700 text-lg font-semibold">BASIC INFORMATION</p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-4 text-neutral-700">
              <p className="font-medium">Gender:</p>
              {isEdit ? (
                <select
                  className="bg-gray-100 p-2 rounded w-full"
                  value={userData.gender}
                  onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="text-gray-600">{userData.gender}</p>
              )}

              <p className="font-medium">Birthday:</p>
              {isEdit ? (
                <input
                  className="bg-gray-100 p-2 rounded w-full"
                  type="date"
                  value={userData.dob}
                  onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                />
              ) : (
                <p className="text-gray-600">{userData.dob}</p>
              )}
            </div>
          </div>

          {/* Edit / Save button */}
          <div className="mt-8">
            {isEdit ? (
              <button
                className="bg-primary text-white px-8 py-2 rounded-full hover:bg-primary-dark transition-all"
                onClick={updateUserProfileData}
              >
                Save Information
              </button>
            ) : (
              <button
                className="border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                onClick={() => setIsEdit(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Medical History */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Medical History</h2>
          {isEdit ? (
            <div className="space-y-6">
              {/* Blood Group */}
              <div>
                <p className="font-medium">Blood Group:</p>
                <input
                  className="bg-gray-100 p-2 rounded w-full"
                  type="text"
                  value={medicalHistory.bloodGroup}
                  onChange={(e) => handleMedicalHistoryChange('bloodGroup', e.target.value)}
                />
              </div>

              {/* Allergies */}
              <div>
                <p className="font-medium">Allergies:</p>
                <input
                  className="bg-gray-100 p-2 rounded w-full"
                  type="text"
                  value={medicalHistory.allergies}
                  onChange={(e) => handleMedicalHistoryChange('allergies', e.target.value)}
                />
              </div>

              {/* Chronic Diseases */}
              <div>
                <p className="font-medium">Chronic Diseases:</p>
                <input
                  className="bg-gray-100 p-2 rounded w-full"
                  type="text"
                  value={medicalHistory.chronicDiseases}
                  onChange={(e) => handleMedicalHistoryChange('chronicDiseases', e.target.value)}
                />
              </div>

              {/* Surgeries */}
              <div>
                <p className="font-medium">Surgeries:</p>
                <input
                  className="bg-gray-100 p-2 rounded w-full"
                  type="text"
                  value={medicalHistory.surgeries}
                  onChange={(e) => handleMedicalHistoryChange('surgeries', e.target.value)}
                />
              </div>

              {/* Medications */}
              <div>
                <p className="font-medium">Medications:</p>
                <input
                  className="bg-gray-100 p-2 rounded w-full"
                  type="text"
                  value={medicalHistory.medications}
                  onChange={(e) => handleMedicalHistoryChange('medications', e.target.value)}
                />
              </div>

              {/* Emergency Contacts */}
              <div>
                <p className="font-medium">Emergency Contacts:</p>
                {medicalHistory.emergencyContacts.map((contact, index) => (
                  <div key={index} className="space-y-2">
                    <input
                      className="bg-gray-100 p-2 rounded w-full"
                      type="text"
                      placeholder="Name"
                      value={contact.name}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, 'name', e.target.value)
                      }
                    />
                    <input
                      className="bg-gray-100 p-2 rounded w-full"
                      type="text"
                      placeholder="Phone"
                      value={contact.phone}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, 'phone', e.target.value)
                      }
                    />
                    <input
                      className="bg-gray-100 p-2 rounded w-full"
                      type="text"
                      placeholder="Relationship"
                      value={contact.relationship}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, 'relationship', e.target.value)
                      }
                    />
                  </div>
                ))}
                <button
                  className="mt-2 text-primary hover:text-primary-dark"
                  onClick={() =>
                    setMedicalHistory((prev) => ({
                      ...prev,
                      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relationship: '' }],
                    }))
                  }
                >
                  + Add Emergency Contact
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="font-medium">Blood Group:</p>
                <p className="text-gray-600">{medicalHistory.bloodGroup || 'Not specified'}</p>
              </div>
              <div>
                <p className="font-medium">Allergies:</p>
                <p className="text-gray-600">
                  {medicalHistory.allergies || 'No allergies'}
                </p>
              </div>
              <div>
                <p className="font-medium">Chronic Diseases:</p>
                <p className="text-gray-600">
                  {medicalHistory.chronicDiseases || 'No chronic diseases'}
                </p>
              </div>
              <div>
                <p className="font-medium">Surgeries:</p>
                <p className="text-gray-600">
                  {medicalHistory.surgeries || 'No surgeries'}
                </p>
              </div>
              <div>
                <p className="font-medium">Medications:</p>
                <p className="text-gray-600">
                  {medicalHistory.medications || 'No medications'}
                </p>
              </div>
              <div>
                <p className="font-medium">Emergency Contacts:</p>
                {medicalHistory.emergencyContacts.length > 0 ? (
                  medicalHistory.emergencyContacts.map((contact, index) => (
                    <div key={index} className="text-gray-600">
                      <p>{contact.name}</p>
                      <p>{contact.phone}</p>
                      <p>{contact.relationship}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No emergency contacts</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;