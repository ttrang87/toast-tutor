import { useState } from 'react'
import axios from 'axios'
import { API_ROUTES } from '../../../../constant/APIRoutes'
import avatars from '../../AvatarList'
import covers from '../../CoverList'

const AvatarModal = ({ onClose, profileId, avatar, setAvatar, cover, setCover, showToast }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(avatar)
    const [selectedCover, setSelectedCover] = useState(cover)

    const handleChooseAvatar = (id) => {
        setSelectedAvatar(id)
    }

    const handleChooseCover = (id) => {
        setSelectedCover(id)
    }

    const data = {};
    if (selectedAvatar !== avatar) {
        data.avatar = selectedAvatar;
    }
    if (selectedCover !== cover) {
        data.cover = selectedCover;
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const response = await axios.put(API_ROUTES.FIX_BASIC_INFOR(profileId), data, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (data.avatar) { setAvatar(selectedAvatar) }
            if (data.cover) { setCover(selectedCover) }
            showToast('success')
            onClose();

        } catch (error) {
            showToast('error')
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='modal-container bg-white rounded-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide'>
                <h2 className='font-semibold text-yellow-800 text-2xl mb-4 text-center'>Select Your Avatar</h2>
                <div className='flex flex-wrap gap-2 justify-center mb-4'>
                    {avatars.map((avatar) => (
                        <div
                            key={avatar.id}
                            className={`w-20 h-20 rounded-full border-2 cursor-pointer ${selectedAvatar === avatar.id ? 'border-blue-600' : 'border-gray-300'
                                }`}
                            onClick={() => handleChooseAvatar(avatar.id)}>
                            <img
                                src={avatar.src}
                                alt='avatar_option'
                                className='w-full h-full object-cover rounded-full' />
                        </div>
                    )
                    )}
                </div>
                <h2 className='font-semibold text-yellow-800 text-2xl mb-4 text-center'>Select Your Cover</h2>
                <div className='flex flex-wrap gap-2 justify-center mb-4'>
                    {covers.map((cover) => (
                        <div
                            key={cover.id}
                            className={`w-20 h-20 rounded-lg border-2 cursor-pointer ${selectedCover === cover.id ? 'border-blue-600' : 'border-gray-300'
                                }`}
                            onClick={() => handleChooseCover(cover.id)}>
                            <img
                                src={cover.src}
                                alt='cover_option'
                                className='w-full h-full object-cover rounded-lg' />
                        </div>
                    )
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-900"
                        disabled={isLoading || !selectedAvatar}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>

    )
}

export default AvatarModal