import React from "react";
import { Link } from 'react-router-dom';
import { StarIcon } from "../../assets/icon";

export const TutorListTable = ({ currentRows, getAvatarPath }) => {
  return (
    <div className="flex flex-col">
      <div
        className="flex flex-row pr-28 pl-28 py-2 rounded-xl gap-2 justify-between"
        style={{ backgroundColor: "#fae1c4" }}
      >
        <p className="text-yellow-700 font-semibold">Tutor Name</p>
        <p className="text-yellow-700 font-semibold">Education</p>
        <p className="text-yellow-700 font-semibold">Price</p>
        <p className="text-yellow-700 font-semibold">Rating</p>
      </div>

      {currentRows.length > 0 ? (
        currentRows.map((tutor) => (
          <div key={tutor.id} className="border-b">
            <div className="flex items-center py-3 pr-10 pl-5">
              <div className=" mr-14">
                <img
                  src={tutor.avatar ? getAvatarPath(tutor.avatar) : pfpIcon}
                  alt={`${tutor.name}'s avatar`}
                  className=" w-14 rounded-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-36 mr-12 flex-grow text-md text-gray-700 ">
                <Link
                  to={`/tutor/profile/${tutor.id}`}
                  className="hover:underline"
                >
                  {tutor.name}
                </Link>
                <p className="w-56">{tutor.education}</p>
                <p className="ml-7">${tutor.price}/hr</p>
                <div className="flex items-center gap-2 ml-1">
                  {StarIcon}
                  <p>{tutor.rating}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4">No tutors found</div>
      )}
    </div>
  );
};