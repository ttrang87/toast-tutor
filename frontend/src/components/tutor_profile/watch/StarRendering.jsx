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

export default renderStars;