import React from 'react'
import { assets } from '../assets/assets/assets'

const About = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
          <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
        </div>

        <div className='my-10 flex flex-col md:flex-row gap-12'>
          <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
            <p>Welcome to <b>MedSync</b>, your AI-powered Clinical Decision Support System (CDSS) designed to revolutionize healthcare decision-making. At MedSync, we empower doctors and healthcare providers with real-time, AI-driven insights to deliver accurate, evidence-based patient care.</p>
            <p>MedSync integrates cutting-edge AI technologies, including Retrieval-Augmented Generation (RAG) models, to process patient data, analyze medical research, and provide personalized treatment recommendations. Our platform ensures that doctors have access to the latest medical knowledge and tools to make informed decisions quickly and efficiently.</p>
            <b className='text-gray-800'>Our Vision</b>
            <p>Our vision at MedSync is to bridge the gap between medical expertise and advanced technology. We aim to create a seamless, intelligent healthcare ecosystem where doctors can focus on patient care while leveraging AI to enhance accuracy, efficiency, and outcomes.</p>
          </div>
        </div>

        <div className='text-xl my-4'>
          <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
        </div>

        <div className='flex flex-col md:flex-row mb-20'>

          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-slate-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>AI-POWERED INSIGHTS</b>
            <p>Leverage advanced AI to analyze patient data and provide evidence-based recommendations.</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-slate-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>SEAMLESS INTEGRATION</b>
            <p>Easily integrate with Electronic Health Records (EHR) and retrieve patient data in real-time.</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-slate-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>CONTINUOUS LEARNING</b>
            <p>Our AI continuously learns from new cases and research to improve recommendations over time.</p>
          </div>

        </div>
    </div>
  )
}

export default About