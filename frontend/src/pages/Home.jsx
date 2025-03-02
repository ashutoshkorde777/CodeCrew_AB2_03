import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'


const Home = () => {
  return (
    <div>
      <Header/> {/* we have mounted this from components section*/}
      <SpecialityMenu/>
      <TopDoctors/>
      <Banner/> {/* home page pe components show karne ke liye hum components ko home.jsx me mount karte hain */}
    </div>
  )
}

export default Home