const Review = ({ review }) => {
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span 
                key={index} 
                className={`text-lg ${index < (rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
            >
                ★
            </span>
        ));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className='flex gap-4 p-4 bg-gray-50 rounded-lg'>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-gray-400">👤</span>
            </div>
            <div className='flex flex-col gap-2 flex-1'>
                <div className='font-semibold text-lg text-gray-800'>{review.user_name || 'Anonymous'}</div>
                <div className="flex gap-1">
                    {renderStars(review.rating)}
                </div>
                <div className="text-sm text-gray-500">
                    {formatDate(review.date)} 
                </div>
                <div className="text-gray-700 mt-2 leading-relaxed">
                    {review.comment || 'No comment provided.'}
                </div>
            </div>
        </div>
    );
};

export default Review;