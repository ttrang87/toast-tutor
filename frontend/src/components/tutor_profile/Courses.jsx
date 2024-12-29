import React from 'react';

const Courses = ({ data }) => {
    return (
        <div className='flex flex-col gap-6'>
            <h1 className='text-2xl text-yellow-800 font-bold'>SUBJECTS OFFER</h1>
            <div className='flex flex-col gap-4'>
                {data?.map((course, index) => (
                    <div key={index}>
                        <div className='flex flex-col gap-2'>
                            <div className='text-xl font-semibold'>{course.name}</div>
                            <div>Level: {course.level}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
