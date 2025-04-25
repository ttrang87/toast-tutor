import { useState } from 'react';
import { HomeIcon, SmallEditIcon, PlusIcon } from '../../../assets/icon';
import EducationModal from './update_modal/EducationModal';


const EducationEdit = ({ data, userId, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const [educationData, setEducationData] = useState(data)

    const handleClick = (eduId, choice) => {
        setSelectedEducation(eduId);
        setMode(choice);
        setIsModalOpen(true);
    };

    const handleEducationUpdate = (updatedEducation, deletedEducationId = null) => {
        setEducationData((prevData) => {
            if (deletedEducationId) {
                // Filter out the deleted education by ID
                return prevData.filter((edu) => edu.id !== deletedEducationId);
            } else if (mode === 'add') {
                // For new education, append to the array
                return [...prevData, updatedEducation];
            } else {
                // For editing existing education, update the matching item
                return prevData.map((edu) =>
                    edu.id === updatedEducation.id ? updatedEducation : edu
                );
            }
        });
    };

    return (
        <div className='relative flex flex-col gap-6 mb-2'>
            <div className='flex justify-between'>
                <h1 className='text-2xl text-yellow-800 font-bold pt-2'>EDUCATION</h1>
                <button
                    className='absolute-right p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'
                    onClick={() => handleClick(null, 'add')}>
                    {PlusIcon}
                </button>
            </div>

            <div className='flex flex-col gap-4'>
                {educationData?.map((edu) => (
                    <div key={edu.id} className='flex gap-4'>
                        {HomeIcon}
                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-3'>
                                <div className='text-xl font-semibold'>{edu.school_name}</div>
                                <button
                                    className='p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'
                                    onClick={() => handleClick(edu.id, 'edit')}
                                >
                                    {SmallEditIcon}
                                </button>
                            </div>
                            <div className='flex gap-6'>
                                <div>{edu.degree}</div>
                                <div>({edu.start_year} - {edu.end_year})</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <EducationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    eduData={educationData.find((edu) => edu.id === selectedEducation)} // Pass selected education data
                    mode={mode}
                    onEducationUpdate={handleEducationUpdate}
                    showToast={showToast}
                />
            )}
        </div>
    );
};

export default EducationEdit;
