import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_ROUTES } from '../../../constant/APIRoutes';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const ReviewPosting = ({ onAddReview }) => {
    const { id } = useParams();
    const [rating, setRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false); 
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); 
        const toastId = toast.loading('Submitting your review...');
        const formData = new FormData(event.target);
        const reviewData = {
            tutor: id, 
            user: localStorage.getItem('userId'), 
            comment: formData.get('comment'),
            rating: rating,
        };
        const clientReview = {
            ...reviewData,
            date: new Date().toLocaleString(),
            user_name: localStorage.getItem('user_name') || 'You',
        };
        try {
            await axios.post(API_ROUTES.REVIEW_POSTING(id), reviewData);
            toast.success('Review submitted successfully!', { id: toastId }); 
            if (onAddReview) onAddReview(clientReview);
            event.target.reset();
            setRating(0);
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review. Please try again.', { id: toastId });  
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Add Your Review</h2>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <textarea name="comment" className="border rounded p-2" placeholder="Write your review..." required />
                <h2 className="text-lg font-semibold text-yellow-800 mb-2">Your Rating<StarRating rating={rating} setRating={setRating} /> </h2>
                <button type="submit" className="bg-yellow-700 text-white rounded px-4 py-2 w-fit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default ReviewPosting;