import { React, useState } from 'react';
import { PlusIcon, SmallEditIcon, ExamIcon } from '../../../assets/icon';
import ExamModal from './update_modal/ExamModal';

const ExamsEdit = ({ data, userId, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [examData, setExamData] = useState(data)

    const handleClick = (examId, choice) => {
        setSelectedExam(examId);
        setMode(choice);
        setIsModalOpen(true);
    };

    const handleExamUpdate = (updatedExam, deletedExamId = null) => {
        setExamData((prevData) => {
            if (deletedExamId) {
                return prevData.filter((exam) => exam.id !== deletedExamId);
            } else if (mode === 'add') {
                return [...prevData, updatedExam];
            } else {
                return prevData.map((exam) =>
                    exam.id === updatedExam.id ? updatedExam : exam
                );
            }
        });
    };

    return (
        <div className=' relative flex flex-col gap-6 mb-2'>
            <div className='flex justify-between'>
                <h1 className='text-2xl text-yellow-800 font-bold pt-2'>STANDARDIZED TEST</h1>
                <button
                    className='absolute-right p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'
                    onClick={() => handleClick(null, 'add')}>
                    {PlusIcon}
                </button>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                {examData?.map((exam, index) => (
                    <div key={index} className='flex gap-4'>
                        {ExamIcon}
                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-3'>
                                <div className='text-xl font-semibold'>{exam.name}</div>
                                <button
                                    className='p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'
                                    onClick={() => handleClick(exam.id, 'edit')}
                                >
                                    {SmallEditIcon}
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-6 text-sm text-gray-700">
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
            {isModalOpen && (
                <ExamModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    examData={examData.find((exam) => exam.id === selectedExam)} // Pass selected education data
                    mode={mode}
                    onExamUpdate={handleExamUpdate}
                    showToast={showToast}
                />
            )}
        </div>
    );
};

export default ExamsEdit;
