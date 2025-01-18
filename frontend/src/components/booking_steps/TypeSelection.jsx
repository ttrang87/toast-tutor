import React from 'react';

const TypeSelection = ({ selectType, setSelectType }) => {
  return (
    <div className='flex flex-col gap-3 items-center justify-center text-lg'>
      <button 
        className={`w-full ${
          selectType === "exam" ? "bg-yellow-100" : "bg-white"
        } text-yellow-700 font-semibold rounded-md px-14 py-3 hover:bg-yellow-100 border-2 border-yellow-400`}
        onClick={() => setSelectType("exam")}
      >
        Standardized Tests
      </button>
      <p className='text-yellow-800 text-sm'>OR</p>
      <button 
        className={`w-full ${
          selectType === "subject" ? "bg-yellow-100" : "bg-white"
        } text-yellow-700 font-semibold rounded-md px-14 py-3 hover:bg-yellow-100 border-2 border-yellow-400`}
        onClick={() => setSelectType("subject")}
      >
        K-12 Subjects
      </button>
    </div>
  );
};

export default TypeSelection;