import { EmailIcon, StarIcon, CalendarIcon } from "../../../assets/icon";
import { useNavigate, useParams } from "react-router-dom";
import avatars from "../AvatarList";
import covers from "../CoverList";

const BasicInfor = ({ data }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // Make sure this is useNavigate, NOT useNavigation
  const { username, email, bio, teaching_style, hourly_rate, avatar, cover } =
    data;

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

  const teachingStyle = parseTeachingStyle(teaching_style);
  const fetchAvatar = avatars.find((ava) => ava.id === avatar);
  const fetchCover = covers.find((cov) => cov.id === cover);

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
        {/* Calendar Button - positioned exactly like in BasicInforEdit */}
        <div className="absolute top-56 right-8">
          <button
            type="button"
            onClick={() => navigate(`/meetings/tutor/${id}`)}
            className="p-2 rounded-full bg-transparent hover:bg-yellow-100 focus:outline-none focus:ring-1 focus:ring-yellow-600"
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
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-10 py-10 mt-4 gap-1">
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            <div className="text-4xl text-yellow-800 font-bold">{username}</div>
            <div className="ml-1">{bio}</div>
          </div>
          <div className="flex flex-col gap-4 items-end mt-3">
            <div className="flex gap-3">
              {EmailIcon}
              <div>{email}</div>
            </div>
            <div className="flex gap-1">
              Rated {5}
              {StarIcon}by 5 students
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-3 mt-3">
            {teachingStyle?.map((style, index) => (
              <div
                key={index}
                className="px-4 py-1 bg-gray-200 rounded-xl text-center hover:bg-gray-300"
              >
                {style}
              </div>
            ))}
          </div>
          <div className="text-3xl font-bold pb-2 text-yellow-800">
            {hourly_rate}$/h
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfor;
