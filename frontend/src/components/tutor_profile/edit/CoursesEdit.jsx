import { useState } from 'react';
import { PlusIcon, SmallEditIcon, CourseIcon } from '../../../assets/icon';
import CourseModal from './update_modal/CourseModal';

const CoursesEdit = ({ data, userId, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseData, setCourseData] = useState(data)

    const handleClick = (courseId, choice) => {
        setSelectedCourse(courseId);
        setMode(choice);
        setIsModalOpen(true);
    };

    const handleCourseUpdate = (updatedCourse, deletedCourseId = null) => {
        setCourseData((prevData) => {
            if (deletedCourseId) {
                return prevData.filter((course) => course.id !== deletedCourseId);
            } else if (mode === 'add') {
                return [...prevData, updatedCourse];
            } else {
                return prevData.map((course) =>
                    course.id === updatedCourse.id ? updatedCourse : course
                );
            }
        });
    };

    return (
        <div className=' relative flex flex-col gap-6 mb-2'>
            <div className='flex justify-between'>
                <h1 className='text-2xl text-yellow-800 font-bold pt-2'>COURSES OFFER</h1>
                <button
                    className='absolute-right p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'
                    onClick={() => handleClick(null, 'add')}>
                    {PlusIcon}
                </button>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                {courseData?.map((course, index) => (
                    <div key={index} className='flex gap-4'>
                        {CourseIcon}
                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-3'>
                                <div className='text-xl font-semibold'>{course.name}</div>
                                <button
                                    className='p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'
                                    onClick={() => handleClick(course.id, 'edit')}
                                >
                                    {SmallEditIcon}
                                </button>
                            </div>
                            <div className="flex gap-14 text-sm text-gray-700">
                                <div>
                                    <span className="font-medium">Grade:</span> {course.grade}
                                </div>
                                <div>
                                    <span className="font-medium">Level:</span> {course.level}
                                </div>
                                <div>
                                    <span className="font-medium">Experience:</span> {course.experience} years
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <CourseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    courseData={courseData.find((course) => course.id === selectedCourse)} // Pass selected education data
                    mode={mode}
                    onCourseUpdate={handleCourseUpdate}
                    showToast={showToast}
                />
            )}
        </div>
    );
};

export default CoursesEdit;
