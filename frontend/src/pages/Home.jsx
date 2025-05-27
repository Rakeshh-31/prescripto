import React from 'react'
import Header from '../components/Header'
import Specialitymenu from '../components/Specialitymenu'
import Topdoctors from '../components/Topdoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <Specialitymenu/>
      <Topdoctors/>
      <Banner/>
    </div>
  )
}

export default Home
