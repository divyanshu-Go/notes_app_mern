import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


const PasswordInput = ({value, onChange, placeholder}) => {

    const [showPassword, setShowPassword]= useState(false)

    const toggleShowPassword= ()=>{ setShowPassword(!showPassword) }

  return (
    <div className='flex items-center w-full text-xs bg-transparent border-[1.5px] rounded mb-3 '>
      <input className='w-full text-xs bg-transparent px-4 py-[9px] rounded outline-none' 
      placeholder={placeholder || 'password'}
      value={value} 
      onChange={onChange}
      type={showPassword ? 'text': 'Password'} 
      />

      <div className='pr-3'>
      {showPassword ? 
      (
      <FaRegEye
      size={15}
      onClick={()=>toggleShowPassword()}
      className='text-blue-400 cursor-pointer'
      ></FaRegEye>
      ) : 
      (<FaRegEyeSlash
      size={16}
      onClick={()=>toggleShowPassword()}
      className='text-slate-400 cursor-pointer'
      ></FaRegEyeSlash>
      )
      }
      </div>
    </div>
  );
}

export default PasswordInput
