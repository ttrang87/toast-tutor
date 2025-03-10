import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../../../../constant/APIRoutes';

const EducationModal = ({ isOpen, onClose, userId, eduData, mode, onEducationUpdate, showToast }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    school_name: '',
    degree: '',
    start_year: '',
    end_year: 'Present'
  });
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && eduData) {
        // If editing, populate form with eduData
        setForm({
          school_name: eduData.school_name,
          degree: eduData.degree,
          start_year: eduData.start_year,
          end_year: eduData.end_year
        });
      }
    }
  }, [eduData, mode]);

  // Create a wrapper for onClose to reset for

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (mode === 'add') {
        response = await axios.post(API_ROUTES.ADD_EDUCATION(userId), form, {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        response = await axios.put(API_ROUTES.FIX_EDUCATION_INFOR(eduData.id), form, {
          headers: { 'Content-Type': 'application/json' }
        });

      }

      if (response.data) {
        onEducationUpdate(response.data);
        showToast('success')
        onClose();
      }
    } catch (error) {
      showToast('error')
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(API_ROUTES.DELETE_EDUCATION_INFOR(eduData.id), {
        headers: { 'Content-Type': 'application/json' },
      });
      onEducationUpdate(null, eduData.id); // Notify parent to refresh or update education list
      showToast('success')
      onClose()
    } catch (error) {
      showToast('error')
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl text-yellow-800 font-bold mb-6">
          {mode === 'add' ? 'Add School' : 'Edit School'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">School Name</label>
            <input
              type="text"
              value={form.school_name}
              onChange={(e) => setForm(prev => ({ ...prev, school_name: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Degree</label>
            <input
              type="text"
              value={form.degree}
              onChange={(e) => setForm(prev => ({ ...prev, degree: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Year</label>
            <input
              type="number"
              value={form.start_year}
              onChange={(e) => setForm(prev => ({ ...prev, start_year: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              min="1900"
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Year</label>
            <input
              type="text"
              value={form.end_year}
              onChange={(e) => setForm(prev => ({ ...prev, end_year: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Present"
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

export default EducationModal;