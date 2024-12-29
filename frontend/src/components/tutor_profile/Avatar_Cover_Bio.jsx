import { React, useState } from 'react'
import { EmailIcon, StarIcon } from '../../assets/icon'


const Avatar_Cover_Bio = ({ data }) => {
    const { name, email, bio, teachingStyle, hourlyRate } = data;
    console.log(teachingStyle)
    const [tutorName, setTutorName] = useState(name)
    const [tutorEmail, setTutorEmail] = useState(email)
    const [tutorBio, setTutorBio] = useState(bio)
    const [tutorHourlyRate, setTutorHourlyRate] = useState(hourlyRate)
    const [tutorTeachingStyle, setTeachingStyle] = useState(teachingStyle)
    const [Star, setStar] = useState(5)

    return (
        <div>
            <div className="h-48 bg-gray-200 rounded-tl-xl rounded-tr-xl">
                {/* Profile Section */}
                <div className="relative">
                    {/* Avatar */}
                    <div className="absolute top-24 left-12 z-10">
                        <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white"></div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col px-10 pt-10 gap-1'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1'>
                        <div className='text-4xl text-yellow-800 font-bold'>{tutorName}</div>
                        <div className='ml-1'>{tutorBio}</div>
                    </div>
                    <div className='flex flex-col gap-1 items-end'>
                        <div className='flex gap-3'>
                            {EmailIcon}
                            <div>{tutorEmail}</div>
                        </div>
                        <div className='flex gap-1'>Rated {Star}{StarIcon}by 5 students</div>
                    </div>
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-3 mt-3'>
                        {tutorTeachingStyle?.map((style, index) => (
                            <div key={index} className='px-4 py-1 bg-gray-200 rounded-xl text-center hover:bg-gray-300'>
                                {style}
                            </div>
                        ))}
                    </div>
                    <div className='text-3xl font-bold pb-2 text-yellow-800'>{tutorHourlyRate}</div>
                </div>
            </div>

        </div>

    )
}

export default Avatar_Cover_Bio