import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../../../../constant/APIRoutes';

const CourseModal = ({ isOpen, onClose, userId, courseData, mode, onCourseUpdate, showToast }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        grade: '',
        level: '',
        experience:''
    });
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && courseData) {
                // If editing, populate form with eduData
                setForm({
                    name: courseData.name,
                    grade: courseData.grade,
                    level: courseData.level,
                    experience: courseData.experience
                });
            }
        }
    }, [courseData, mode, isOpen]);

    // Create a wrapper for onClose to reset for

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (mode === 'add') {
                response = await axios.post(API_ROUTES.ADD_COURSE(userId), form, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                response = await axios.put(API_ROUTES.FIX_COURSE_INFOR(courseData.id), form, {
                    headers: { 'Content-Type': 'application/json' }
                });

            }

            if (response.data) {
                onCourseUpdate(response.data);
                showToast('success')
                onClose();
            }
        } catch (error) {
            showToast('error')
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(API_ROUTES.DELETE_COURSE_INFOR(courseData.id), {
                headers: { 'Content-Type': 'application/json' },
            });
            onCourseUpdate(null, courseData.id); // Notify parent to refresh or update education list
            showToast('success')
            onClose()
        } catch (error) {
            showToast('error')
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl text-yellow-800 font-bold mb-6">
                    {mode === 'add' ? 'Add Course' : 'Edit Course'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Course Name</label>
                        <select
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 border rounded-lg appearance-none bg-no-repeat"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4L6 7.5L9.5 4' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                backgroundPosition: "right 0.5rem center"  // This moves the arrow 20px from the right
                            }}
                            required
                        >
                            <option value="" disabled>
                                Select a course
                            </option>
                            {[
                                "Mathematics",
                                "Biology",
                                "Physics",
                                "Chemistry",
                                "Geography",
                                "History",
                                "Art",
                                "Music",
                                "Literature",
                                "Economics",
                                "Programming/Coding",
                                "Robotics",
                                "English",
                                "Chinese",
                                "French",
                                "Spanish",
                                "Japanese",
                            ].map((course, index) => (
                                <option key={index} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Teaching grade</label>
                        <select
                            value={form.grade}
                            onChange={(e) => setForm((prev) => ({ ...prev, grade: e.target.value }))}
                            className="w-full p-2 border rounded-lg appearance-none bg-no-repeat"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4L6 7.5L9.5 4' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                backgroundPosition: "right 0.5rem center"  // This moves the arrow 20px from the right
                            }}
                            required>
                            <option value="" disabled>Select teaching grade</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Your Level</label>
                        <select
                            value={form.level}
                            onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
                            className="w-full p-2 border rounded-lg appearance-none bg-no-repeat"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4L6 7.5L9.5 4' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                backgroundPosition: "right 0.5rem center"  // This moves the arrow 20px from the right
                            }}
                            required
                        >
                            <option value="" disabled>Select your level</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Teaching experience</label>
                        <select
                        value={form.experience}
                        onChange={(e) => setForm((prev) => ({...prev, experience: e.target.value}))}
                        className='w-full p-2 border rounded-lg appearance-none bg-no-repeat'
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4L6 7.5L9.5 4' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                            backgroundPosition: "right 0.5rem center"  // This moves the arrow 20px from the right
                        }}
                        required
                    >
                        <option value="" disabled>Select your experience</option>
                        <option value="<1">Less than 1 year</option>
                        <option value="1">1 year</option>
                        <option value="2">2 years</option>
                        <option value="3">3 years</option>
                        <option value="4">4 years</option>
                        <option value="5">5 years</option>
                        <option value=">5">More than 5 years</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-lg transition-colors"
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
                        {mode === 'edit' && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </form>
            </div >
        </div >
    );
};

export default CourseModal;