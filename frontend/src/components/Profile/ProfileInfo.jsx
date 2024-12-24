import React from 'react'
import { initials } from '../../utils/helper'

const ProfileInfo = ({userInfo, onLogout}) => {

    

    return (
        <>
            <div className=" flex items-center gap-2 ">
                <h4 className=" w-9 h-9 flex items-center justify-center text-sm text-gray-800 font-semibold rounded-full bg-slate-200">
                    {initials(userInfo?.fullName)}
                </h4>

                <div className="w-10 h-10 text-xs flex flex-col items-center justify-center gap-1">
                    <h4 className='w-9 text-xs font-light whitespace-nowrap overflow-hidden text-ellipsis'>{userInfo?.fullName}</h4>
                    <button onClick={onLogout} className='underline cursor-pointer font-medium text-slate-600'>
                        Logout
                    </button>
                </div>
            </div>

        </>
    )
}

export default ProfileInfo
