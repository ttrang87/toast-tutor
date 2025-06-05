import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Review from './watch/Review';
import ReviewPosting from './edit/ReviewPosting'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../../constant/APIRoutes'; 
import FilterDropdown from './FilterDropdown'; 

const RATING_OPTIONS = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
];
const SORT_OPTIONS = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' }
];

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedRating, setSelectedRating] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [visibleCount, setVisibleCount] = useState(10); 
    const { id } = useParams();
    const storedUserId = localStorage.getItem("userId");
    const isOwner = storedUserId === id;

    useEffect(() => {
        const cacheKey = `reviews_${id}`;
        const cached = localStorage.getItem(cacheKey);
        setReviews(cached ? JSON.parse(cached) : []);
        (async () => {
            try {
                const { data: { reviews: fetched = [] } } = await axios.get(API_ROUTES.GET_REVIEW(id));
                setReviews(fetched);
                localStorage.setItem(cacheKey, JSON.stringify(fetched));
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        })();
    }, [id]);

    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + 10); 
    };

    const filteredReviews = useMemo(() => {
        let filtered = reviews;
        if (selectedRating !== 'all') {
            filtered = filtered.filter(r => r.rating === +selectedRating);
        }
        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'recent': return new Date(b.date) - new Date(a.date);
                case 'oldest': return new Date(a.date) - new Date(b.date);
                case 'highest': return b.rating - a.rating;
                case 'lowest': return a.rating - b.rating;
                default: return 0;
            }
        });
    }, [reviews, selectedRating, sortBy]);

    const averageRating = useMemo(() => {
        return reviews.length 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
            : 0;
    }, [reviews]);

    const ratingCounts = useMemo(() => reviews.reduce((acc, { rating }) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
    }, {1:0,2:0,3:0,4:0,5:0}), [reviews]);
     
    const handleAddReview = useCallback(newReview => setReviews(prev => [newReview, ...prev]), []);

    return (
        <div className="flex flex-col gap-6 py-2">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl text-yellow-800 font-bold">REVIEWS</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold text-2xl text-yellow-800">{averageRating}</span>
                    <span className="text-lg">({reviews.length} reviews)</span>
                </div>
            </div>
            {!isOwner && (
                <ReviewPosting onAddReview={handleAddReview} />
            )}
            <div className="flex items-center gap-4 flex-wrap">
                <FilterDropdown
                    label="Filter by Rating"
                    value={selectedRating}
                    onChange={setSelectedRating}
                    options={RATING_OPTIONS}
                />
                <FilterDropdown
                    label="Sort by"
                    value={sortBy}
                    onChange={setSortBy}
                    options={SORT_OPTIONS}
                />
                <div className="flex items-center gap-4 ml-auto">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-1 text-xs text-gray-600">
                            <span>{rating}★</span>
                            <span>({ratingCounts[rating]})</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="text-sm text-gray-600">
                Showing {filteredReviews.length} of {reviews.length} reviews
                {selectedRating !== 'all' && (
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {selectedRating} star{selectedRating !== '1' ? 's' : ''} only
                    </span>
                )}
            </div>
            <div className='grid grid-cols gap-4'>
                {filteredReviews.length > 0 ? (
                    filteredReviews.slice(0, visibleCount).map((review, index) => (
                        <Review key={index} review={review} />
                    ))
                ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                        No reviews found matching your filters.
                    </div>
                )}
            </div>
            {visibleCount < filteredReviews.length && (
                <button
                    onClick={handleShowMore}
                    className="bg-yellow-700 text-white rounded px-4 py-2 mt-4 self-center"
                >
                    Show More
                </button>
            )}
        </div>
    );
};

export default ReviewList;