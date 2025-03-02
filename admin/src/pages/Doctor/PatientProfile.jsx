import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Add useNavigate
import { toast } from 'react-toastify';
import axios from 'axios';

const PatientProfile = () => {
    const { userId } = useParams(); // Get userId from the URL
    const [patientData, setPatientData] = useState(null);
    const [medicalHistory, setMedicalHistory] = useState({
        bloodGroup: '',
        allergies: '',
        chronicDiseases: '',
        surgeries: '',
        medications: '',
        emergencyContacts: [],
    });
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state
    const navigate = useNavigate(); // Initialize useNavigate

    // Hardcoded backend URL
    const backendUrl = 'http://localhost:4000';

    // Fetch patient data based on userId
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true); // Set loading to true
                setError(null); // Clear any previous errors

                console.log('Fetching patient data for userId:', userId); // Debugging

                // Validate userId
                if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
                    throw new Error('Invalid userId');
                }

                // Fetch data from the backend
                const { data } = await axios.get(`${backendUrl}/api/user/patient-profile/${userId}`, {
                    headers: { token: localStorage.getItem('token') }, // Use token from localStorage
                });

                console.log('API Response:', data); // Debugging

                // Validate API response
                if (!data || !data.success || !data.user) {
                    throw new Error(data?.message || 'Invalid response from the server');
                }

                // Set patient data and medical history
                setPatientData(data.user);
                setMedicalHistory({
                    bloodGroup: data.user.bloodGroup || '',
                    allergies: data.user.allergies || '',
                    chronicDiseases: data.user.chronicDiseases || '',
                    surgeries: data.user.surgeries || '',
                    medications: data.user.medications || '',
                    emergencyContacts: data.user.emergencyContacts || [],
                });
            } catch (error) {
                console.error('Error fetching patient data:', error); // Debugging

                // Set error state
                setError(error.message || 'Failed to fetch patient data');

                // Show error toast
                toast.error(error.message || 'Failed to fetch patient data');
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchPatientData();
    }, [userId]);

    // Show loading message while fetching data
    if (loading) {
        return <p>Loading...</p>;
    }

    // Show error message if there's an error
    if (error) {
        return (
            <div className="max-w-lg flex flex-col gap-2 text-sm">
                <p className="text-red-500 font-medium">Error: {error}</p>
                <p>Please try again later or contact support.</p>
            </div>
        );
    }

    // Show patient data
    return (
        <div className="flex flex-col md:flex-row gap-8 p-6 max-w-6xl mx-auto">
            {/* Left Column: Profile Information */}
            <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
                {/* Image section */}
                <img className="w-36 h-36 rounded-full object-cover border-2 border-primary" src={patientData.image} alt="Patient Profile" />

                {/* Name section */}
                <p className="font-medium text-3xl text-neutral-800 mt-4">{patientData.name}</p>

                <hr className="border-t border-gray-300 my-6" />

                {/* Contact Information */}
                <div>
                    <p className="text-neutral-700 text-lg font-semibold">CONTACT INFORMATION</p>
                    <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-4 text-neutral-700">
                        <p className="font-medium">Email id:</p>
                        <p className="text-gray-600">{patientData.email}</p>

                        <p className="font-medium">Phone:</p>
                        <p className="text-gray-600">{patientData.phone}</p>

                        <p className="font-medium">Address:</p>
                        <p className="text-gray-600">
                            {patientData.address.line1}
                            <br />
                            {patientData.address.line2}
                        </p>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="mt-6">
                    <p className="text-neutral-700 text-lg font-semibold">BASIC INFORMATION</p>
                    <div className="grid grid-cols-[1fr_3fr] gap-y-4 mt-4 text-neutral-700">
                        <p className="font-medium">Gender:</p>
                        <p className="text-gray-600">{patientData.gender}</p>

                        <p className="font-medium">Birthday:</p>
                        <p className="text-gray-600">{patientData.dob}</p>
                    </div>
                </div>

                {/* Let us analyze the patient deeply */}
                <div className="mt-8">
                    <p className="text-neutral-700 text-lg font-semibold mb-4">Let us analyze the patient deeply</p>
                    <p className="text-gray-600 mb-4">
                        This section is for further analysis of the patient's condition. Use the medical history below to gain insights.
                    </p>
                    {/* Add RAG Model Button */}
                    <button
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-all"
                        onClick={() => {
                            // Navigate to the RAG.jsx component
                            navigate('/rag');
                        }}
                    >
                        RAG Model
                    </button>
                </div>
            </div>

            {/* Right Column: Medical History */}
            <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Medical History</h2>
                <div className="space-y-6">
                    {/* Blood Group */}
                    <div>
                        <p className="font-medium">Blood Group:</p>
                        <p className="text-gray-600">{medicalHistory.bloodGroup || 'Not specified'}</p>
                    </div>

                    {/* Allergies */}
                    <div>
                        <p className="font-medium">Allergies:</p>
                        <p className="text-gray-600">
                            {medicalHistory.allergies || 'No allergies'}
                        </p>
                    </div>

                    {/* Chronic Diseases */}
                    <div>
                        <p className="font-medium">Chronic Diseases:</p>
                        <p className="text-gray-600">
                            {medicalHistory.chronicDiseases || 'No chronic diseases'}
                        </p>
                    </div>

                    {/* Surgeries */}
                    <div>
                        <p className="font-medium">Surgeries:</p>
                        <p className="text-gray-600">
                            {medicalHistory.surgeries || 'No surgeries'}
                        </p>
                    </div>

                    {/* Medications */}
                    <div>
                        <p className="font-medium">Medications:</p>
                        <p className="text-gray-600">
                            {medicalHistory.medications || 'No medications'}
                        </p>
                    </div>

                    {/* Emergency Contacts */}
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
            </div>
        </div>
    );
};

export default PatientProfile;