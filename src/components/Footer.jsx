import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* -----------------LEFT------------*/}
            
            <div>
                <img src={assets.logo} alt="" className='mb-5 w-40' />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Prescripto is your all-in-one healthcare platform, 
                    helping you identify illnesses, find medicine dosages, consult
                    doctors,locate nearby hospitals, and provide feedback.</p>
            </div>


            {/* -----------------CENTER------------*/}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>


            {/* -----------------RIGHT------------*/}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91-9062655126</li>
                    <li>priyanshu.biswas9041@gmail.com</li>
                </ul>
            </div>



        </div>
        <div>
            {/* Copyright text */}
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025 @ priyanshu.dev - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
