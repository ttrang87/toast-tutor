import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../constant/APIRoutes";
import { toast, Toaster } from "react-hot-toast";

import BasicInfor from "../components/tutor_profile/watch/BasicInfor";
import BasicInforEdit from "../components/tutor_profile/edit/BasicInforEdit";
import Education from "../components/tutor_profile/watch/Education";
import EducationEdit from "../components/tutor_profile/edit/EducationEdit";
import Courses from "../components/tutor_profile/watch/Courses";
import CoursesEdit from "../components/tutor_profile/edit/CoursesEdit";
import Exams from "../components/tutor_profile/watch/Exam";
import ExamsEdit from "../components/tutor_profile/edit/ExamEdit";
import Awards from "../components/tutor_profile/watch/Award";
import AwardsEdit from "../components/tutor_profile/edit/AwardEdit";

const TutorProfile = () => {
  const [loggedInUserId, setLoggedInUserId] = useState(null); // Store logged-in user's ID
  const [profileData, setProfileData] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    // Get logged-in user's ID from localStorage or your auth provider
    const storedUserId = localStorage.getItem("userId");
    setLoggedInUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(API_ROUTES.GET_TUTOR_PROFILE(userId));
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching tutor profile:", error);
      }
    };
    fetchProfileData();
  }, [userId]);

  // Return loading state if data isn't loaded yet
  if (!profileData) {
    return (
      <div className="h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-4xl font-bold text-yellow-800">Loading...</div>
      </div>
    );
  }

  // Determine if the logged-in user is the profile owner
  const isOwner = String(loggedInUserId) === String(userId);

  const basicprofileData = profileData.profile;
  const educationData = profileData.education;
  const coursesData = profileData.course;
  const examsData = profileData.exam;
  const awardsData = profileData.award;

  const showToast = (status) => {
    if (status === "success") {
      toast.success("Updated Successfully", { duration: 1500 });
    } else if (status === "username_exists") {
      toast.error("This username already exists. Please try a different one.", {
        duration: 1500,
      });
    } else if (status === "email_exists") {
      toast.error("This email already exists. Please try a different one.", {
        duration: 1500,
      });
    } else {
      toast.error("Failed to save changes. Please try again.", {
        duration: 1500,
      });
    }
  };

  return (
    <div className="bg-yellow-50 h-auto px-24 py-1 space-y-6 pb-8">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Basic Information */}
      <div className="rounded-xl h-auto bg-white">
        {isOwner ? (
          <BasicInforEdit
            data={basicprofileData}
            userId={userId}
            showToast={showToast}
          />
        ) : (
          <BasicInfor data={basicprofileData} />
        )}
      </div>

      {/* Education Section */}
      <div className="rounded-xl h-auto bg-white px-10 py-8">
        {isOwner ? (
          <EducationEdit
            data={educationData}
            userId={userId}
            showToast={showToast}
          />
        ) : (
          <Education data={educationData} />
        )}
      </div>

      {/* Courses Section */}
      <div className="rounded-xl h-auto bg-white px-10 py-8">
        {isOwner ? (
          <CoursesEdit
            data={coursesData}
            userId={userId}
            showToast={showToast}
          />
        ) : (
          <Courses data={coursesData} />
        )}
      </div>

      {/* Exams Section */}
      <div className="rounded-xl h-auto bg-white px-10 py-8">
        {isOwner ? (
          <ExamsEdit data={examsData} userId={userId} showToast={showToast} />
        ) : (
          <Exams data={examsData} />
        )}
      </div>

      {/* Awards Section */}
      <div className="rounded-xl h-auto bg-white px-10 py-8">
        {isOwner ? (
          <AwardsEdit data={awardsData} userId={userId} showToast={showToast} />
        ) : (
          <Awards data={awardsData} />
        )}
      </div>
    </div>
  );
};

export default TutorProfile;
