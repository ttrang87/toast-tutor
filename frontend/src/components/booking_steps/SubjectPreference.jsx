import React from 'react';
import TeachingStyleSelector from '../tutor_profile/edit/update_modal/StyleUpdate';

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const GRADE_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const SubjectPreferences = ({ selectGrade, setSelectGrade, selectLevel, setSelectLevel, teachingStyles, setTeachingStyles, note, setNote }) => {
    const gradeOptions = GRADE_OPTIONS;
    const levelOptions = LEVEL_OPTIONS

    return (
        <div className='relative mb-32 flex flex-col gap-4'>
            <div>
                <label className='block text-sm font-medium mb-1'>Choose your grade (*)</label>
                <select
                    value={selectGrade}
                    onChange={(e) => setSelectGrade(e.target.value)}
                    className="w-full text-yellow-800 py-2 px-4 rounded-lg appearance-none bg-no-repeat focus:outline-none focus:ring-0 focus:border-yellow-400 border border-gray-300"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4L6 7.5L9.5 4' stroke='brown' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 0.5rem center"
                    }}
                    required
                >
                    <option value="" disabled></option>
                    {gradeOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className='block text-sm font-medium mb-1'>Choose your aim level (*)</label>
                <select
                    value={selectLevel}
                    onChange={(e) => setSelectLevel(e.target.value)}
                    className="w-full text-yellow-800 py-2 px-4 rounded-lg appearance-none bg-no-repeat focus:outline-none focus:ring-0 focus:border-yellow-400 border border-gray-300"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4L6 7.5L9.5 4' stroke='brown' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 0.5rem center"
                    }}
                    required
                >
                    <option value="" disabled></option>
                    {levelOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <TeachingStyleSelector
                selectedStyles={teachingStyles}
                onStyleChange={(styles) => setTeachingStyles(styles)} />

            <div>
                <label className="block text-sm font-medium mb-1">Note for your tutor</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    rows="2"
                />
            </div>
        </div>
    );
};

export default SubjectPreferences;