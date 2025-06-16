import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EmailIcon,
  EditIcon,
  CameraIcon,
  CalendarIcon,
} from "../../../assets/icon";
import BasicInforModal from "./update_modal/BasicInforModal";
import AvatarModal from "./update_modal/AvatarModal";
import avatars from "../AvatarList";
import covers from "../CoverList";

const BasicInforEdit = ({ data, showToast }) => {
  const {
    id,
    username,
    email,
    bio,
    teaching_style,
    hourly_rate,
    avatar,
    cover,
  } = data;
  const navigate = useNavigate();
  // Parse teaching_style safely - handle both string and array formats
  const parseTeachingStyle = (styleData) => {
    if (Array.isArray(styleData)) {
      return styleData;
    }
    if (typeof styleData === "string") {
      try {
        return JSON.parse(styleData);
      } catch (error) {
        console.warn("Failed to parse teaching_style:", error);
        return [];
      }
    }
    return [];
  };

  const [tutorName, setTutorName] = useState(username);
  const [tutorEmail, setTutorEmail] = useState(email);
  const [tutorBio, setTutorBio] = useState(bio);
  const [tutorHourlyRate, setTutorHourlyRate] = useState(hourly_rate);
  const [tutorTeachingStyle, setTeachingStyle] = useState(
    parseTeachingStyle(teaching_style)
  );
  const [tutorAvatar, setAvatar] = useState(avatar);
  const [tutorCover, setCover] = useState(cover);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avaOpen, setAvaOpen] = useState(false);

  const fetchAvatar = avatars.find((ava) => ava.id === tutorAvatar);
  const fetchCover = covers.find((cov) => cov.id === tutorCover);

  return (
    <div>
      <div
        className="h-52 bg-gray-200 rounded-tl-xl rounded-tr-xl relative"
        style={{
          backgroundImage: `url(${fetchCover?.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Icon Group: Edit + Calendar */}
        <div className="absolute top-56 right-8 flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200"
            aria-label="Edit profile"
          >
            {EditIcon}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/meetings/tutor/${id}`)}
            className="p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200"
            aria-label="Open tutor calendar"
          >
            {CalendarIcon}
          </button>
        </div>

        {/* Profile Section */}
        <div className="relative">
          {/* Avatar */}
          <div className="absolute top-24 left-12 z-10">
            <div className="w-40 h-40 bg-gray-300 rounded-full border-4 border-white relative">
              <img
                src={fetchAvatar?.src}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              <button
                className="absolute bottom-0 right-3 bg-gray-200 p-1 rounded-full border-2 border-white cursor-pointer"
                onClick={() => setAvaOpen(true)}
              >
                {CameraIcon}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-10 py-10 mt-4 gap-1">
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            <div className="text-4xl text-yellow-800 font-bold">
              {tutorName}
            </div>
            <div className="ml-1">{tutorBio}</div>
          </div>
          <div className="flex flex-col gap-4 items-end mt-3">
            <div className="flex gap-3">
              {EmailIcon}
              <div>{tutorEmail}</div>
            </div>
            {/* <div className="flex gap-1">
              Rated {5}
              {StarIcon}by 5 students
            </div> */}
          </div>
        </div>
        <div className='flex justify-between items-end mt-5'>
          <div className='flex flex-wrap gap-3 max-w-4xl'>
            {tutorTeachingStyle?.map((style, index) => (
              <div key={index} className='px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors'>
                {style}
              </div>
            ))}
          </div>
          <div className='text-4xl font-bold text-yellow-800 whitespace-nowrap ml-6'>
            ${tutorHourlyRate}/h
          </div>
        </div>
      </div>
      <BasicInforModal
        profileId={id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tutorName={tutorName}
        setTutorName={setTutorName}
        tutorEmail={tutorEmail}
        setTutorEmail={setTutorEmail}
        tutorBio={tutorBio}
        setTutorBio={setTutorBio}
        tutorHourlyRate={tutorHourlyRate}
        setTutorHourlyRate={setTutorHourlyRate}
        tutorTeachingStyle={tutorTeachingStyle}
        setTeachingStyle={setTeachingStyle}
        showToast={showToast}
      />

      {avaOpen && (
        <AvatarModal
          onClose={() => setAvaOpen(false)}
          profileId={id}
          avatar={fetchAvatar}
          setAvatar={setAvatar}
          cover={fetchCover}
          setCover={setCover}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default BasicInforEdit;
