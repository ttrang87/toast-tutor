import { useState } from "react";
import { PriceRangeInputs } from "./PriceRangeInputs";

export const TutorListFilter = ({
  showFilterDropdown,
  filterOptions,
  selectedPriceRange,
  handleRangeChange,
  minimumRating,
  handleMinimumRatingChange,
  selectedCourses,
  handleCourseFilter,
  selectedExams,
  handleExamFilter
}) => {
  const [showCourseFilter, setShowCourseFilter] = useState(false);
  const [showExamFilter, setShowExamFilter] = useState(false);

  if (!showFilterDropdown) return null;

  // Group courses by name for organized display
  const coursesByName = filterOptions.available_courses?.reduce((acc, course) => {
    if (!acc[course.name]) {
      acc[course.name] = {
        name: course.name,
        grades: new Set(),
        experiences: new Set()
      };
    }
    acc[course.name].grades.add(course.grade);
    acc[course.name].experiences.add(course.experience);
    return acc;
  }, {});

  // Group exams by name
  const examsByName = filterOptions.available_exams?.reduce((acc, exam) => {
    if (!acc[exam.name]) {
      acc[exam.name] = {
        name: exam.name,
        experiences: new Set()
      };
    }
    acc[exam.name].experiences.add(exam.experience);
    return acc;
  }, {});

  return (
    <div className="absolute right-0 top-full bg-gray-50 min-w-[60vh] rounded-lg shadow-lg p-3 z-50 max-h-[60vh] overflow-y-auto">
      <p className="text-xl font-bold pl-2 mb-1 text-gray-600">Filter</p>

      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-2 pl-2">
          Price Range ($/hr)
        </div>
        <PriceRangeInputs
          initialRange={selectedPriceRange}
          onRangeChange={handleRangeChange}
        />
      </div>

      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-2 pl-2">
          Minimum Rating
        </div>
        <div className="px-4">
          <select
            value={minimumRating}
            onChange={(e) => handleMinimumRatingChange(Number(e.target.value))}
            className="w-full p-2 rounded-md border border-gray-300"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 stars</option>
            <option value={4}>4+ stars</option>
            <option value={3}>3+ stars</option>
            <option value={2}>2+ stars</option>
            <option value={1}>1+ stars</option>
          </select>
        </div>
      </div>

      <div
        onClick={() => setShowCourseFilter(!showCourseFilter)}
        className="text-sm font-semibold text-gray-700 mb-1 pl-2 rounded-md py-2 bg-white cursor-pointer hover:bg-gray-100"
      >
        Filter by Course
      </div>
      {showCourseFilter && (
        <div className={`pb-2 pl-1 ${
          Object.keys(coursesByName || {}).length > 4 ? 'grid grid-cols-2 gap-x-2' : ''
        }`}>
          {Object.values(coursesByName || {}).map(course => (
            <div key={course.name} className="flex items-center">
              <input
                type="checkbox"
                id={`course-${course.name}`}
                checked={selectedCourses.includes(course.name)}
                onChange={() => handleCourseFilter(course.name)}
                className="mr-2"
              />
              <label 
                htmlFor={`course-${course.name}`} 
                className="text-gray-800 pb-1"
                title={`Grades: ${Array.from(course.grades).join(', ')}\nExperience: ${Array.from(course.experiences).join(', ')}`}
              >
                {course.name}
              </label>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => setShowExamFilter(!showExamFilter)}
        className="text-sm font-semibold text-gray-700 mb-1 pl-2 rounded-md py-2 bg-white cursor-pointer hover:bg-gray-100"
      >
        Filter by Exam
      </div>
      {showExamFilter && (
        <div className={`pb-2 pl-1 ${
          Object.keys(examsByName || {}).length > 4 ? 'grid grid-cols-2 gap-x-2' : ''
        }`}>
          {Object.values(examsByName || {}).map(exam => (
            <div key={exam.name} className="flex items-center">
              <input
                type="checkbox"
                id={`exam-${exam.name}`}
                checked={selectedExams.includes(exam.name)}
                onChange={() => handleExamFilter(exam.name)}
                className="mr-2"
              />
              <label 
                htmlFor={`exam-${exam.name}`} 
                className="text-gray-800 pb-1"
                title={`Experience: ${Array.from(exam.experiences).join(', ')}`}
              >
                {exam.name}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};