import React, { useState, useEffect } from 'react'
import waiting from '../../../assets/waiting.png'
import { useNavigate } from 'react-router-dom'
const WaitingMatched = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        let minimumWaitTimer;
        let checkResponseInterval;

        const checkForResponse = () => {
            const matchedTutors = localStorage.getItem('matchedTutorsResponse');
            if (matchedTutors && !isLoading) {
                navigate(`/matched_tutors/${userId}`)
            }
        };

        // Set minimum wait time of 1 second
        minimumWaitTimer = setTimeout(() => {
            setIsLoading(false);
            checkForResponse();
        }, 1000);

        // Check for response every 100ms
        checkResponseInterval = setInterval(checkForResponse, 100);

        // Set maximum wait time of 10 seconds
        const maxWaitTimer = setTimeout(() => {
            clearInterval(checkResponseInterval);
            if (isLoading) {
                setIsLoading(false);
                toast.error('Taking longer than expected. Please try again.');
                navigate(`/booking/${userId}`)
            }
        }, 10000);

        return () => {
            clearTimeout(minimumWaitTimer);
            clearTimeout(maxWaitTimer);
            clearInterval(checkResponseInterval);
        };
    }, [navigate, isLoading]);
    return (
        <div className='flex items-center justify-center bg-yellow-50 min-h-screen'>
            <div className='flex flex-col items-center justify-center gap-4 pb-24'>
                <img
                    src={waiting}
                    alt="Waiting Picture"
                    className='animate-float w-1/2'
                />
                <div className="loading-spinner" /> {/* equivalent with <div></div> so dont need </div> */}
                <div className='text-3xl text-yellow-700 font-bold text-center'>We are finding your perfect tutor</div>
                <div className='text-md text-yellow-700 text-center'>Learning is a lifelong journey! Don't give up</div>

            </div>

        </div>
    )
}

export default WaitingMatched