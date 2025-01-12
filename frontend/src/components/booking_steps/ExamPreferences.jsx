import React from 'react';
import TeachingStyleSelector from '../tutor_profile/edit/update_modal/StyleUpdate';

const ExamPreferences = ({ aimScore, setAimScore, teachingStyles, setTeachingStyles, note, setNote }) => {
  return (
    <div className='relative mb-32 flex flex-col gap-4'>
      <div>
        <label className="block text-sm font-medium mb-1">Your aim score(*)</label>
        <input
          type="text"
          value={aimScore}
          onChange={(e) => setAimScore(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
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

export default ExamPreferences;