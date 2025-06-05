import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_ROUTES } from '../../../constant/APIRoutes';

const StarRating = ({ rating, setRating }) => {
    const [hoveredRating, setHoveredRating] = useState(0);
    const handleMouseEnter = (index) => setHoveredRating(index);
    const handleMouseLeave = () => setHoveredRating(0);
    const handleClick = (index) => setRating(index);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`cursor-pointer text-2xl ${hoveredRating >= star || rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

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
            date: new Date().toISOString(),
            user_name: 'You'
        };
        if (onAddReview) onAddReview(clientReview);
        try {
            const response = await axios.post(API_ROUTES.REVIEW_POSTING(id), reviewData);
            if (response.status === 201) {
                console.log('Review submitted successfully:', response.data);
            }
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