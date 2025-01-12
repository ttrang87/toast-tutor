import React from 'react';

const TeachingStyleSelector = ({ selectedStyles, onStyleChange }) => {
  const TEACHING_STYLES = [
    "Strict but Fair", "Motivational", "Caring", "Creative", "Logical",
    "Fun", "Patient", "Understanding", "Lecture-Based", "Modeling",
    "Gamification", "Visual Learners", "Learn By Doing", "Auditory Learners"
  ];

  /* If a style is selected, it is removed from the selectedStyles, and vice versa */
  const handleStyleClick = (style) => {
    if (selectedStyles.includes(style)) {
      onStyleChange(selectedStyles.filter(s => s !== style));
    } else {
      onStyleChange([...selectedStyles, style]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Teaching Styles */}
      <div>
        <label className="block text-sm font-medium mb-2">Selected Teaching Styles</label>
        <div className="flex flex-wrap justify-center items-center gap-2 p-4 min-h-24 border-2 border-dashed border-yellow-700 rounded-lg">
          {selectedStyles.length > 0 ? (
            selectedStyles.map((style) => (
              <div
                key={style}
                onClick={() => handleStyleClick(style)}
                className="px-4 py-2 bg-yellow-800 text-white rounded-lg cursor-pointer hover:bg-yellow-900 transition-colors text-center text-sm"
              >
                {style}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No styles selected</p>
          )}
        </div>
      </div>

      {/* Available Teaching Styles */}
      <div>
        <label className="block text-sm font-medium mb-2">Available Teaching Styles</label>
        <div className="flex flex-wrap justify-center items-center gap-2 p-4 min-h-24 border-2 border-dashed border-gray-300 rounded-lg">
          {TEACHING_STYLES.filter(style => !selectedStyles.includes(style)).map((style) => (
            <div
              key={style}
              onClick={() => handleStyleClick(style)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors text-center text-sm"
            >
              {style}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeachingStyleSelector;
