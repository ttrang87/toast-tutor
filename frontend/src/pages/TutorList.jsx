import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTES } from '../constant/APIRoutes';
import { SearchIcon } from "../assets/icon";
import { filterIcon } from "../assets/icon";
import { StarIcon } from "../assets/icon";
import { pfpIcon } from "../assets/icon";

const TutorList = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ROUTES.GET_ALL_TUTORS());
        // Transform the data to match the table structure
        const transformedTutors = response.data.map(tutor => ({
          id: tutor.id,
          name: tutor.username,
          education: tutor.profile?.education_records?.[0]?.school_name || 'Not specified',
          price: tutor.profile?.hourly_rate ? `$${tutor.profile.hourly_rate}/hr` : 'Not specified',
          rating: 5, // You might want to add a rating field to your model
        }));
        setTutors(transformedTutors);
        setError(null);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError(err.response?.data?.error || 'Failed to fetch tutors data');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(tutors.length / rowsPerPage);

  // Get the rows for the current page
  const currentRows = tutors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <div className="bg-yellow-50 h-full py-5">
        <div className="h-full mx-10 rounded-3xl p-5 bg-white shadow-md">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading tutors...</p>
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
      <div className="h-full mx-10 rounded-3xl p-5 bg-white shadow-md">
        <div className="flex py-5 px-5 flex-col gap-7">
          <div className="flex items-center justify-between w-full">
            <h2 className="font-bold text-3xl text-gray-600 pl-4">Instructors</h2>
            <div className="flex flex-row justify-center items-center gap-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-2xl h-10 w-72 bg-gray-100 pl-10 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Search"
                />
              </div>
              <button className="rounded-xl py-2 px-3 bg-gray-100 flex flex-row gap-2">
                <div>{filterIcon}</div>
                <p className="text-gray-600 font-semibold">Filter</p>
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <div
              className="grid grid-cols-4 pr-1 pl-28 py-2 rounded-xl"
              style={{ backgroundColor: "#fae1c4" }}
            >
              <p className="text-yellow-700 font-semibold">Tutor Name</p>
              <p className="text-yellow-700 font-semibold">Education</p>
              <p className="text-yellow-700 font-semibold">Price</p>
              <p className="text-yellow-700 font-semibold">Rating</p>
            </div>

            {currentRows.length > 0 ? (
              currentRows.map((tutor) => (
                <div key={tutor.id}>
                  <div className="relative">
                    <div className="absolute left-7 top-1/2 -translate-y-1/2 rounded-full bg-amber-100 p-2">
                      {pfpIcon}
                    </div>
                    <div className="grid grid-cols-4 py-5 pr-1 pl-28">
                      <p>{tutor.name}</p>
                      <p>{tutor.education}</p>
                      <p>{tutor.price}</p>
                      <div className="flex flex-row gap-2">
                        <div>{StarIcon}</div>
                        <p>{tutor.rating}</p>
                      </div>
                    </div>
                  </div>
                  <hr/>
                </div>
              ))
            ) : (
              <div className="text-center py-4">No tutors found</div>
            )}
          </div>

          {tutors.length > 0 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorList;

