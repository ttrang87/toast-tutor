import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTES } from '../constant/APIRoutes';
import Avatar_Cover_Bio from '../components/tutor_profile/Avatar_Cover_Bio'
import Education from "../components/tutor_profile/Education";
import Courses from "../components/tutor_profile/Courses";
import Awards from "../components/tutor_profile/Award";

const TutorProfile = () => {
  const [userId, setUserId] = useState(null)
  const [profileData, setProfileData] = useState(null)


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      console.log("Don't find userId at local storage")
    }
  }, [])

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(API_ROUTES.GET_TUTOR_PROFILE(userId))
        setProfileData(response.data)
      } catch (error) {
        console.error("Error fetching tutor profile:", error);
      }
    }
    fetchProfileData();
  }, [userId])

  // Return loading state if data isn't loaded yet
  if (!profileData) {
    return <div>Loading...</div>
  }

  const avatarData = {
    name: profileData.username, // Changed from name to username to match backend
    email: profileData.email,
    bio: profileData.profile.bio,
    teaching_style: profileData.profile.teaching_style,
    hourly_rate: profileData.profile.hourly_rate
  }

  // Updated to match backend response structure
  const educationData = profileData.profile.education_records
  const coursesData = profileData.profile.course_list // Changed from courses_records
  const awardsData = profileData.profile.awards // Changed from certifications_records

  return (
    <div className='bg-yellow-50 h-auto px-16 py-6 space-y-6'>
      <div className='rounded-xl h-96 bg-white'>
        <Avatar_Cover_Bio data={avatarData} />
      </div>
      <div className='rounded-xl h-auto bg-white px-10 py-8'>
        <Education data={educationData} />
      </div>
      <div className='rounded-xl h-auto bg-white px-10 py-8'>
        <Courses data={coursesData} />
      </div>
      <div className='rounded-xl h-auto bg-white px-10 py-8'>
        <Awards data={awardsData} />
      </div>
    </div>
  )
}

export default TutorProfile