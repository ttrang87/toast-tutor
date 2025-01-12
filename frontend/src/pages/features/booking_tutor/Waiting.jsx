import React from 'react'
import waiting from '../../../assets/waiting.png'
const Waiting = () => {
    return (
        <div className='flex items-center justify-center bg-yellow-50 min-h-screen'>
            <div className='flex flex-col items-center justify-center gap-4 pb-24'>
                <img
                    src={waiting}
                    alt="Waiting Picture"
                    className='animate-float w-1/2'
                />
                <div className="loading-spinner" /> {/* equivalent with <div></div> so dont need </div> */}
                <div className='text-3xl text-yellow-700 font-bold text-center'>We are finding your perfect tutor</div>
                <div className='text-md text-yellow-700 text-center'>Learning is a lifelong journey! Don't give up</div>

            </div>

        </div>
    )
}

export default Waiting