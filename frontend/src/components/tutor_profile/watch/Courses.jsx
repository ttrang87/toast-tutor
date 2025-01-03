import React from 'react';
import { CourseIcon } from '../../../assets/icon';

const Courses = ({ data }) => {
    return (
        <div className='flex flex-col gap-6 py-2'>
            <h1 className='text-2xl text-yellow-800 font-bold'>SUBJECTS OFFER</h1>
            <div className='grid grid-cols-2 gap-4'>
                {data?.map((course, index) => (
                    <div key={index} className='flex gap-4'>
                        {CourseIcon}
                        <div className='flex flex-col gap-2'>
                            <div className='text-xl font-semibold'>{course.name}</div>
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
        </div>
    );
};

export default Courses;
