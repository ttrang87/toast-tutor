import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../../../../constant/APIRoutes';

const ExamModal = ({ isOpen, onClose, userId, examData, mode, onExamUpdate, showToast }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        score: '',
        date: '',
        experience: ''
    });
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && examData) {
                // If editing, populate form with eduData
                setForm({
                    name: examData.name,
                    score: examData.score,
                    date: examData.date,
                    experience: examData.experience
                });
            }
        }
    }, [examData, mode]);

    // Create a wrapper for onClose to reset for

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (mode === 'add') {
                response = await axios.post(API_ROUTES.ADD_EXAM(userId), form, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                response = await axios.put(API_ROUTES.FIX_EXAM_INFOR(examData.id), form, {
                    headers: { 'Content-Type': 'application/json' }
                });

            }

            if (response.data) {
                onExamUpdate(response.data);
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
            await axios.delete(API_ROUTES.DELETE_EXAM_INFOR(examData.id), {
                headers: { 'Content-Type': 'application/json' },
            });
            onExamUpdate(null, examData.id); // Notify parent to refresh or update education list
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
                    {mode === 'add' ? 'Add Exam' : 'Edit Exam'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Exam Name</label>
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
                                Select a exam
                            </option>
                            {[
                                "SAT",
                                "ACT",
                                "AP Calculus AB",
                                "AP Calculus BC",
                                "AP Statistics",
                                "AP Biology",
                                "AP Chemistry",
                                "AP Physics 1",
                                "AP Physics 2",
                                "AP English Language and Composition",
                                "AP English Literature and Composition",
                                "IELTS",
                                "TOEFL",
                                "PTE",
                                "Duolingo English Test",
                                "GRE",
                                "GMAT",
                            ].map((exam, index) => (
                                <option key={index} value={exam}>
                                    {exam}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Your score</label>
                        <input
                            type='text'
                            value={form.score}
                            onChange={(e) => setForm((prev) => ({...prev, score: e.target.value}))}
                            className='p-2 rounded-lg border w-full'
                            required />

                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm((prev) => ({...prev, date: e.target.value}))}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Teaching experience</label>
                        <select
                            value={form.experience}
                            onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                            className='w-full p-2 border rounded-lg appearance-none bg-no-repeat'
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4L6 7.5L9.5 4' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                backgroundPosition: "right 0.5rem center"  // This moves the arrow 20px from the right
                            }}
                            required
                        >
                            <option value="" disabled>Select your experience</option>
                            <option value="0">Less than 1 year</option>
                            <option value="1">1 year</option>
                            <option value="2">2 years</option>
                            <option value="3">3 years</option>
                            <option value="4">4 years</option>
                            <option value="5">5 years</option>
                            <option value="6">More than 5 years</option>
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

export default ExamModal;