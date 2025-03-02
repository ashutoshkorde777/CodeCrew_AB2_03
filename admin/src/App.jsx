// App.js

import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import PatientProfile from './pages/Doctor/PatientProfile';
import RAG from './pages/Doctor/RAG';
// import Prescription from './pages/Doctor/Prescription';

const App = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);

    return aToken || dToken ? (
        <div className='bg-[#F8F9FD]'>
            <ToastContainer />
            <Navbar />
            <div className='flex items-start'>
                <Sidebar />
                <Routes>
                    {/* Admin routes */}
                    <Route path='/' element={<></>} />
                    <Route path='/admin-dashboard' element={<Dashboard />} />
                    <Route path='/all-appointments' element={<AllAppointments />} />
                    <Route path='/add-doctor' element={<AddDoctor />} />
                    <Route path='/doctor-list' element={<DoctorsList />} />
                    {/* Doctor routes */}
                    <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                    <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                    <Route path='/doctor-profile' element={<DoctorProfile />} />
                    <Route path='/patient-profile/:userId' element={<PatientProfile />} />
                    <Route path="/rag" element={<RAG />} /> {/* Add this route */}
                    {/* <Route path='/prescription' element={<Prescription />} /> */}
                </Routes>
            </div>
        </div>
    ) : (
        <>
            <Login />
            <ToastContainer />
        </>
    );
};

export default App;