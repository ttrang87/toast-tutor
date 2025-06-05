import { useState}  from 'react';

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

export default StarRating;