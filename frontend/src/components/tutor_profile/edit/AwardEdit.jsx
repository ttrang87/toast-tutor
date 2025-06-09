import { useState } from 'react';
import { AwardIcon, PlusIcon, SmallEditIcon } from '../../../assets/icon';
import AwardModal from './update_modal/AwardModal';

const AwardsEdit = ({ data, userId, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(null);
    const [selectedAward, setSelectedAward] = useState(null);
    const [awardData, setAwardData] = useState(data)

    const handleClick = (awardId, choice) => {
        setSelectedAward(awardId);
        setMode(choice);
        setIsModalOpen(true);
    };

    const handleAwardUpdate = (updatedAward, deletedAwardId = null) => {
        setAwardData((prevData) => {
            if (deletedAwardId) {
                return prevData.filter((award) => award.id !== deletedAwardId);
            } else if (mode === 'add') {
                return [...prevData, updatedAward];
            } else {
                return prevData.map((award) =>
                    award.id === updatedAward.id ? updatedAward : award
                );
            }
        });
    };

    return (
        <div className=' relative flex flex-col gap-6 mb-2'>
            <div className='flex justify-between'>
                <h1 className='text-2xl text-yellow-800 font-bold pt-2'>CERTIFICATION & AWARD</h1>
                <button
                    className='absolute-right p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'
                    onClick={() => handleClick(null, 'add')}>
                    {PlusIcon}
                </button>
            </div>
            <div className='flex flex-col gap-4'>
                {awardData?.map((award, index) => (
                    <div key={index} className='flex gap-4'>
                        {AwardIcon}
                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-3'>
                                <div className='text-xl font-semibold'>{award.name}</div>
                                <button
                                    className='p-2 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'
                                    onClick={() => handleClick(award.id, 'edit')}
                                >
                                    {SmallEditIcon}
                                </button>
                            </div>
                            <div>{award.year}</div>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <AwardModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    awardData={awardData.find((award) => award.id === selectedAward)} // Pass selected education data
                    mode={mode}
                    onAwardUpdate={handleAwardUpdate} // Pass update callback
                    showToast={showToast}
                />
            )}
        </div>
    );
};

export default AwardsEdit;