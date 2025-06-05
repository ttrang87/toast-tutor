import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import avatars from '../../../components/tutor_profile/AvatarList';
import { TransparentStarIcon, EducationIcon, SmallClockIcon, SmallBookIcon } from '../../../assets/icon';


const TutorCard = ({ tutor, subjectName, isBestChoice }) => {
  const navigate = useNavigate()
  const fetchAvatar = avatars.find((ava) => ava.id === tutor.avatar);

  // Convert teaching styles from array to comma-separated string if needed
  let teachingStylesArray = [];
  try {
    teachingStylesArray = Array.isArray(tutor.teachingStyles)
      ? tutor.teachingStyles
      : JSON.parse(tutor.teachingStyles);
  } catch (error) {
    console.error("Error parsing teachingStyles:", error);
    teachingStylesArray = [];
  }


  return (
    <div className={` relative flex flex-col gap-3 bg-white rounded-lg shadow-lg p-5 mb-4 ${isBestChoice ? 'border-4 border-yellow-500' : ''} hover:scale-105 transition duration-200`}>
      {isBestChoice && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 rounded-bl-lg font-semibold">
          Best Choice
        </div>
      )}
      <div className='flex gap-3'>
        <div className="w-16 h-16 bg-gray-300 rounded-full border-2 border-white relative">
          <img
            src={fetchAvatar?.src || avatars[0].src}
            alt="Avatar"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='text-xl font-bold'>{tutor.username}</div>
          <div className='flex gap-2'>
            {TransparentStarIcon}
            <p className='text-sm'>4.9</p>
          </div>
        </div>
        <div className={`ml-auto text-lg ${isBestChoice ? 'mt-6' : ''}`}>
          <p className='text-xl font-semibold text-yellow-700'>${tutor.hourlyRate}/hr</p>
        </div>
      </div>
      <div className='flex gap-3 pl-2'>
        {EducationIcon}
        <p className='text-sm'>{tutor.school || 'Not specified'}</p>
      </div>
      <div className='flex gap-3 pl-2'>
        {SmallBookIcon}
        <p className='text-sm'>
          {subjectName}
          {tutor.score && ` - ${tutor.score}`}
        </p>
      </div>
      <div className='flex gap-3 pl-2'>
        {SmallClockIcon}
        <p className="text-sm">
          {tutor.experience > 5
            ? "More than 5 years experience"
            : tutor.experience < 1
              ? "Less than 1 year experience"
              : `${tutor.experience} years experience`}
        </p>
      </div>
      <div className='flex justify-between'>
        <div className='flex flex-wrap gap-2'>
          {teachingStylesArray.map((style, index) => (
            <span
              key={index}
              className='rounded-full min-w-12 text-center px-2 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold border border-yellow-700'
            >
              {style}
            </span>
          ))}
        </div>
        <div className='space-x-5 text-yellow-600'>
          <button className='underline text-sm hover:text-yellow-700'
            onClick={() => navigate(`/tutor/profile/${tutor.userId}`)}>Profle</button>
          <button className='underline text-sm hover:text-yellow-700'>Calendar</button>
        </div>
      </div>
    </div>
  );
};

const MatchedTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [visibleTutors, setVisibleTutors] = useState(3);
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    const response = localStorage.getItem('matchedTutorsResponse');
    if (response) {
      try {
        const parsedResponse = JSON.parse(response);
        setTutors(parsedResponse);
        setSubjectName(localStorage.getItem('selectedSubject'));
      } catch (error) {
        console.error('Error parsing tutor data:', error);
      }
    }
  }, []);

  const handleShowMore = () => {
    setVisibleTutors(prev => Math.min(prev + 3, tutors.length));
  };

  return (
    <div className='flex flex-col items-center justify-center bg-yellow-50 min-h-screen py-1 pb-40'>
      <h1 className="text-2xl font-bold text-center mb-5 text-yellow-600">Top Matched Tutors</h1>
      <div className='w-3/5 max-w-2xl space-y-4'>
        {tutors.slice(0, visibleTutors).map((tutor, index) => (
          <TutorCard
            key={tutor.userId}
            tutor={tutor}
            subjectName={subjectName}
            isBestChoice={index === 0}
          />
        ))}

        {tutors.length > visibleTutors && (
          <div className='flex justify-center mt-6'>
            <button
              onClick={handleShowMore}
              className='bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition duration-200'
            >
              Show More
            </button>
          </div>
        )}

        {tutors.length === 0 && (
          <div className='text-center text-gray-600 py-8'>
            No matching tutors found. Please try different criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchedTutors;