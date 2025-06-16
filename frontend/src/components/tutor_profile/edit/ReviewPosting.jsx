import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_ROUTES } from '../../../constant/APIRoutes';
import StarRating from './StarRating';

const ReviewPosting = ({ onAddReview }) => {
    const { id } = useParams();
    const [rating, setRating] = useState(0);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const reviewData = {
            tutor: id, 
            user: localStorage.getItem('userId'), 
            comment: formData.get('comment'),
            rating: rating,
        };
        const clientReview = {
            ...reviewData,
            date: new Date().toLocaleString(), // Changed to local time
            user_name: 'You'
        };
        if (onAddReview) onAddReview(clientReview);
        try {
            await axios.post(API_ROUTES.REVIEW_POSTING(id), reviewData);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Add Your Review</h2>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <textarea name="comment" className="border rounded p-2" placeholder="Write your review..." required />
                <h2 className="text-lg font-semibold text-yellow-800 mb-2">Your Rating<StarRating rating={rating} setRating={setRating} /> </h2>
                <button type="submit" className="bg-yellow-700 text-white rounded px-4 py-2 w-fit">Submit</button>
            </form>
        </div>
    );
};

export default ReviewPosting;