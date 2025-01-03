import React, { useState, useEffect } from 'react'
import { API_ROUTES } from '../../../../constant/APIRoutes'
import axios from 'axios'
import TeachingStyleSelector from './StyleUpdate'

const BasicInforModal = ({
    profileId,
    isOpen,
    onClose,
    tutorName,
    setTutorName,
    tutorEmail,
    setTutorEmail,
    tutorBio,
    setTutorBio,
    tutorHourlyRate,
    setTutorHourlyRate,
    tutorTeachingStyle,
    setTeachingStyle,
    showToast
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [localForm, setLocalForm] = useState({
        name: tutorName,
        email: tutorEmail,
        bio: tutorBio,
        hourlyRate: tutorHourlyRate,
        teachingStyle: tutorTeachingStyle
    })

    // Update local state when props change (e.g., modal reopens)
    useEffect(() => {
        setLocalForm({
            name: tutorName,
            email: tutorEmail,
            bio: tutorBio,
            hourlyRate: tutorHourlyRate,
            teachingStyle: tutorTeachingStyle
        })
    }, [tutorName, tutorEmail, tutorBio, tutorHourlyRate, tutorTeachingStyle, isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const data = {
            username: localForm.name,
            email: localForm.email,
            bio: localForm.bio,
            hourly_rate: localForm.hourlyRate,
            teaching_style: JSON.stringify(localForm.teachingStyle)
        }

        try {
            const response = await axios.put(API_ROUTES.FIX_BASIC_INFOR(profileId), data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            // Only update parent state after successful API call
            setTutorName(localForm.name)
            setTutorEmail(localForm.email)
            setTutorBio(localForm.bio)
            setTutorHourlyRate(localForm.hourlyRate)
            setTeachingStyle(localForm.teachingStyle)

            showToast('success')
            onClose()

        } catch (error) {
            const errorType = error.response?.data?.error

            if (errorType === 'username_exists') {
                showToast('username_exists')
            } else if (errorType === 'email_exists') {
                showToast('email_exists')
            } else {
                showToast('error')
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-container bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <h2 className="text-2xl text-yellow-800 font-bold mb-6">Edit Profile Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={localForm.name}
                            onChange={(e) => setLocalForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={localForm.email}
                            onChange={(e) => setLocalForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea
                            value={localForm.bio}
                            onChange={(e) => setLocalForm(prev => ({ ...prev, bio: e.target.value }))}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hourly Rate ($/h)</label>
                        <input
                            type="text"
                            value={localForm.hourlyRate}
                            onChange={(e) => setLocalForm(prev => ({ ...prev, hourlyRate: e.target.value }))}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    <TeachingStyleSelector
                        selectedStyles={localForm.teachingStyle}
                        onStyleChange={(styles) => setLocalForm(prev => ({ ...prev, teachingStyle: styles }))}
                    />

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-yellow-800 text-white rounded-lg hover:bg-yellow-900 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BasicInforModal