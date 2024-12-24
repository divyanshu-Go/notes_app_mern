import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import {Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'

const Signin = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr]=useState(null)

  const navigate= useNavigate();

  const handleSignin= async(e)=>{
    e.preventDefault();

    if(!name){
      setErr('Please entre name.')
      return;
    }
    if(!validateEmail(email)){
      setErr('Please enter a valid email address.')
      return;
    }
    if(!password){
      setErr('Please enter password.')
      return;
    }
    setErr("")
    setName('')
    setEmail('')
    setPassword('')

    // SignIn API call

    try {
      const response= await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      //Handle successful registrationn response
      if(response.data && response.data.error){
        setErr(response.data.msg)
        return;
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken)
        navigate("/dashboard")
      }

    } catch (error) {
      //Handle login response

      if(error.response && error.response.data && error.response.data.msg){
        setErr(error.response.data.msg)
      }
      else{
        setErr("An unexpected error occured. Please Try Again");
      }
    }

  }



  return (
    <div>
      <Navbar />

      <div className='flex items-center justify-center mt-16'>
        <div className='w-96 border rounded bg-white px-8 py-11'>
          <form onSubmit={handleSignin} >
            <h4 className="text-xl font-medium mb-7 pl-0.5">SignIn</h4>

            <input type='text' className='input-box' placeholder='Name'
              value={name}
              onChange={(e) => { setName(e.target.value) }} />

            <input type='text' className='input-box' placeholder='Email'
              value={email}
              onChange={(e) => { setEmail(e.target.value) }} />

            <PasswordInput value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder={"Password"} />

            {err && <p className='text-[10px] pl-1 text-red-600 pb-0.5 font-medium'>{err}</p>}

            <button type='submit' className='mt-2 btn-primary'>Creat Account</button>

            <p className='text-xs text-center mt-3'>
              Already have an account ? {" "}
              <Link to='/login' className='font-medium underline hover:text-blue-600 text-primary'>
                login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Signin
