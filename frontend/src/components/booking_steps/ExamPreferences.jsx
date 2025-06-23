import TeachingStyleSelector from "../tutor_profile/edit/update_modal/StyleUpdate";

const ExamPreferences = ({
  aimScore,
  setAimScore,
  maxScore,
  setMaxScore,
  teachingStyles,
  setTeachingStyles,
  note,
  setNote,
}) => {
  return (
    <div className="relative mb-32 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Your aim score(*)
          </label>
          <input
            type="text"
            value={aimScore}
            onChange={(e) => setAimScore(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Max score for this exam(*)
          </label>
          <input
            type="text"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
      </div>

      <TeachingStyleSelector
        selectedStyles={teachingStyles}
        onStyleChange={(styles) => setTeachingStyles(styles)}
      />

      <div>
        <label className="block text-sm font-medium mb-1">
          Note for your tutor
        </label>
        <textarea
          value={note || ""}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border rounded-lg"
          rows="2"
        />
      </div>
    </div>
  );
};

export default ExamPreferences;
