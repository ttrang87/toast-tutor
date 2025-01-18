import { React, useState } from 'react'
import { EmailIcon, StarIcon } from '../../../assets/icon'
import avatars from '../AvatarList'
import covers from '../CoverList'


const BasicInfor = ({ data }) => {
    const { id, username, email, bio, teaching_style, hourly_rate, avatar, cover } = data

    const parseTeachingStyle = (styleData) => {
        if (Array.isArray(styleData)) {
            return styleData;
        }
        if (typeof styleData === 'string') {
            try {
                return JSON.parse(styleData);
            } catch (error) {
                console.warn('Failed to parse teaching_style:', error);
                return [];
            }
        }
        return [];
    };

    const [Star, setStar] = useState(5)
    const teachingStyle = parseTeachingStyle(teaching_style)
    // const teachingStyle = teaching_style
    const fetchAvatar = avatars.find((ava) => ava.id === avatar)
    const fetchCover = covers.find((cov) => cov.id === cover)

    return (
        <div>
            <div className="h-52 bg-gray-200 rounded-tl-xl rounded-tr-xl relative"
                style={{ backgroundImage: `url(${fetchCover.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {/* Profile Section */}
                <div className="relative">
                    {/* Avatar */}
                    <div className="absolute top-24 left-12 z-10">
                        <div className="w-40 h-40 bg-gray-300 rounded-full border-4 border-white relative">
                            <img src={fetchAvatar.src} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col px-10 py-10 mt-4 gap-1'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-4'>
                        <div className='text-4xl text-yellow-800 font-bold'>{username}</div>
                        <div className='ml-1'>{bio}</div>
                    </div>
                    <div className='flex flex-col gap-4 items-end mt-3'>
                        <div className='flex gap-3'>
                            {EmailIcon}
                            <div>{email}</div>
                        </div>
                        <div className='flex gap-1'>Rated {Star}{StarIcon}by 5 students</div>
                    </div>
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-3 mt-3'>
                        {teachingStyle?.map((style, index) => (
                            <div key={index} className='px-4 py-1 bg-gray-200 rounded-xl text-center hover:bg-gray-300'>
                                {style}
                            </div>
                        ))}
                    </div>
                    <div className='text-3xl font-bold pb-2 text-yellow-800'>{hourly_rate}$/h</div>
                </div>
            </div>
        </div>

    )
}

export default BasicInfor 