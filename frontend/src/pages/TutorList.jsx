import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_ROUTES } from '../constant/APIRoutes';
import { createClient } from '@supabase/supabase-js';

import { TutorListHeader } from "./Listing/TutorListHeader";
import { TutorListFilter } from "./Listing/TutorListFilter";
import { TutorListTable } from "./Listing/TutorListTable";
import { TutorListPagination } from "./Listing/TutorListPagination";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TutorList = (presenceRef) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    available_courses: [],
    available_exams: []
  });

  const [_priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: 200 });
  const [minimumRating, setMinimumRating] = useState(0);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const rowsPerPage = 5;

  const getAvatarPath = (tutorId) => {
    const DEFAULT_AVATAR = '/src/assets/avatar/avatar.png';

    if (!tutorId || tutorId < 1 || tutorId > 15) {
      return DEFAULT_AVATAR;
    }

    const fileType = tutorId > 15 ? 'jpg' : 'png';
    return `/src/assets/avatar/avatar${tutorId}.${fileType}`;
  };
  useEffect(() => {
    const updateOnlineUsers = () => {
      const presences = presenceRef.presenceRef['current'];
      const newOnlineUsers = Object.keys(presences);
      setOnlineUsers(newOnlineUsers);
    };

    updateOnlineUsers();
  }, [presenceRef.presenceRef]);
  console.log('Online Users:', onlineUsers);
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ROUTES.GET_ALL_TUTORS);
        // Set filter options from API response
        console.log(response);
        setFilterOptions({
          available_courses: response.data.filter_options.available_courses,
          available_exams: response.data.filter_options.available_exams
        });

        const transformedTutors = response.data.user_details.map(tutor => ({
          id: tutor.userid,
          name: tutor.username,
          education: tutor.education[0]?.school_name || 'Not specified',
          price: tutor.hourly_rate ? parseFloat(tutor.hourly_rate) : 0,
          rating: 5,
          courses: tutor.courses || [],
          avatar: tutor.avatar,
          exams: tutor.exams || [],
        }));
        const maxPrice = Math.max(...transformedTutors.map(tutor => tutor.price));
        setPriceRange({ min: 0, max: maxPrice });
        setSelectedPriceRange({ min: 0, max: maxPrice });

        setTutors(transformedTutors);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch tutors data');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);          

  const filteredTutors = tutors.filter(tutor =>
    (searchTerm === '' ||
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.education.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.courses.some(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      )) &&
    (tutor.price >= selectedPriceRange.min && tutor.price <= selectedPriceRange.max) &&
    (minimumRating === 0 || tutor.rating >= minimumRating) &&
    (selectedCourses.length === 0 ||
      selectedCourses.some(selectedCourse =>
        tutor.courses.some(course => course.name === selectedCourse)
      )) &&
    (selectedExams.length === 0 ||
      selectedExams.some(selectedExam =>
        tutor.exams.some(exam => exam.name === selectedExam)
      ))
  );

  const totalPages = Math.ceil(filteredTutors.length / rowsPerPage);
  const currentRows = filteredTutors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRangeChange = (range) => {
    setSelectedPriceRange(range);
    setCurrentPage(1);
  };

  const handleMinimumRatingChange = (rating) => {
    setMinimumRating(rating);
    setCurrentPage(1);
  };

  const handleCourseFilter = (course) => {
    setSelectedCourses(prev =>
      prev.includes(course)
        ? prev.filter(c => c !== course)
        : [...prev, course]
    );
    setCurrentPage(1);
  };

  const handleExamFilter = (exam) => {
    setSelectedExams(prev =>
      prev.includes(exam)
        ? prev.filter(e => e !== exam)
        : [...prev, exam]
    );
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="bg-yellow-50 h-full py-5">
        <div className="h-full mx-10 rounded-3xl p-5 bg-white shadow-md">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 font-semibold text-xl">Loading tutors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 h-full py-5">
        <div className="h-full mx-10 rounded-3xl p-5 bg-white shadow-md">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-yellow-50 h-full py-5">
      <div className="h-full mx-10 rounded-3xl p-5 bg-white shadow-md relative">
        <div className="flex py-5 px-5 flex-col gap-7">
          <TutorListHeader
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            showFilterDropdown={showFilterDropdown}
            setShowFilterDropdown={setShowFilterDropdown}
          />
          <div className="relative">
            <TutorListFilter
              showFilterDropdown={showFilterDropdown}
              filterOptions={filterOptions}
              selectedPriceRange={selectedPriceRange}
              handleRangeChange={handleRangeChange}
              minimumRating={minimumRating}
              handleMinimumRatingChange={handleMinimumRatingChange}
              selectedCourses={selectedCourses}
              handleCourseFilter={handleCourseFilter}
              selectedExams={selectedExams}
              handleExamFilter={handleExamFilter}
            />
          </div>

          <TutorListTable
            currentRows={currentRows}
            getAvatarPath={getAvatarPath}
            onlineUsers={onlineUsers}
          />
          {filteredTutors.length > 0 && (
            <TutorListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorList;