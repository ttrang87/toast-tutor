import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../../../../constant/APIRoutes';
import { Toaster } from 'react-hot-toast';

const AwardModal = ({ isOpen, onClose, userId, awardData, mode, onAwardUpdate, showToast }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        year: '',
    });
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && awardData) {
                setForm({
                    name: awardData.name,
                    year: awardData.year
                });
            }
        }
    }, [awardData, mode, isOpen]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (mode === 'add') {
                response = await axios.post(API_ROUTES.ADD_AWARD(userId), form, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                response = await axios.put(API_ROUTES.FIX_AWARD_INFOR(awardData.id), form, {
                    headers: { 'Content-Type': 'application/json' }
                });

            }
            if (response.data) {
                onAwardUpdate(response.data);
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
            await axios.delete(API_ROUTES.DELETE_AWARD_INFOR(awardData.id), {
                headers: { 'Content-Type': 'application/json' },
            });
            onAwardUpdate(null, awardData.id);
            showToast('success')
            onClose()
        } catch (error) {
            showToast('error')
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Toaster position='top-right' />
            <div className="bg-white rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl text-yellow-800 font-bold mb-6">
                    {mode === 'add' ? 'Add Award' : 'Edit Award'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Award Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <input
                            type="text"
                            value={form.year}
                            onChange={(e) => setForm(prev => ({ ...prev, year: e.target.value }))}
                            className="w-full p-2 border rounded-lg"
                        />
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
            </div>
        </div>
    );
};

export default AwardModal;