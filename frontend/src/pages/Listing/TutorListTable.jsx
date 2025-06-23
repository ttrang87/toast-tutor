import { Link } from "react-router-dom"
import { StarIcon, pfpIcon } from "../../assets/icon"


export const TutorListTable = ({ currentRows, getAvatarPath, onlineUsers = [] }) => {
  return (
    <div className="flex flex-col">
      {/* Header Row */}
      <div className="grid grid-cols-5 gap-4 px-8 py-3 rounded-xl items-center" style={{ backgroundColor: "#fae1c4" }}>
        <div></div> {/* Empty space for avatar column */}
        <p className="text-yellow-700 font-semibold">Tutor Name</p>
        <p className="text-yellow-700 font-semibold">Education</p>
        <p className="text-yellow-700 font-semibold text-center">Price</p>
        <p className="text-yellow-700 font-semibold text-center">Rating</p>
      </div>


      {/* Data Rows */}
      {currentRows.length > 0 ? (
        currentRows.map((tutor) => (
          <div key={tutor.id} className="border-b">
            <div className="grid grid-cols-5 gap-4 px-8 py-3 items-center">
              {/* Avatar Column */}
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={tutor.avatar ? getAvatarPath(tutor.avatar) : pfpIcon}
                    alt={`${tutor.name}'s avatar`}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {/* Online Status Indicator */}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                      onlineUsers.includes(tutor.id.toString()) ? "bg-green-500" : "bg-gray-400"
                    }`}
                    title={onlineUsers.includes(tutor.id.toString()) ? "Online" : "Offline"}
                  ></div>
                </div>
              </div>


              {/* Tutor Name Column */}
              <div>
                <Link to={`/tutor/profile/${tutor.id}`} className="text-gray-700 hover:underline font-medium">
                  {tutor.name}
                </Link>
              </div>


              {/* Education Column */}
              <div>
                <p className="text-gray-700">{tutor.education}</p>
              </div>


              {/* Price Column */}
              <div className="text-center">
                <p className="text-gray-700">${tutor.price}/hr</p>
              </div>


              {/* Rating Column */}
              <div className="flex items-center justify-center gap-2">
                {StarIcon}
                <p className="text-gray-700">{tutor.rating}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">No tutors found</div>
      )}
    </div>
  )
}

