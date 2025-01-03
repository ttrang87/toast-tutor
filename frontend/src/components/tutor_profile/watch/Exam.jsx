import React from 'react';
import { ExamIcon } from '../../../assets/icon';

const Exams = ({ data }) => {
    return (
        <div className='flex flex-col gap-6 py-2'>
            <h1 className='text-2xl text-yellow-800 font-bold'>STANDARDIZED TEST</h1>
            <div className='grid grid-cols-2 gap-4'>
                {data?.map((exam, index) => (
                    <div key={index} className='flex gap-4'>
                        {ExamIcon}
                        <div className='flex flex-col gap-2'>
                            <div className='text-xl font-semibold'>{exam.name}</div>
                            <div className="flex gap-14 text-sm text-gray-700">
                                <div>
                                    <span className="font-medium">Score:</span> {exam.score}
                                </div>
                                <div>
                                    <span className="font-medium">Date:</span> {exam.date}
                                </div>
                                <div>
                                    <span className="font-medium">Experience:</span> {exam.experience} years
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Exams;
