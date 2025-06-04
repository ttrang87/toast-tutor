import { LightIcon, CalendarIcon } from "../../assets/icon";

const TimeService = ({ selectOption, setSelectOption }) => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <button
        className={`flex gap-3 items-center justify-center w-full ${
          selectOption === "sos" ? "bg-yellow-100" : "bg-white"
        } text-yellow-700 font-semibold rounded-lg px-14 py-3 hover:bg-yellow-100 border-2 border-yellow-400`}
        onClick={() => setSelectOption("sos")}
      >
        <button className="w-8 h-8 rounded-full bg-yellow-200 p-2">
          {LightIcon}
        </button>
        <div className="flex flex-col text-left">
          <div className="text-yellow-700 font-semibold text-lg">SOS Tutor</div>
          <div className="text-yellow-500 font-semibold text-sm">
            Get immediate help with available tutors
          </div>
        </div>
      </button>
      <p className="text-yellow-800 text-sm">OR</p>
      <button
        className={`flex gap-3 items-center justify-center w-full ${
          selectOption === "class" ? "bg-yellow-100" : "bg-white"
        } text-yellow-700 font-semibold rounded-lg px-14 py-3 hover:bg-yellow-100 border-2 border-yellow-400`}
        onClick={() => setSelectOption("class")}
      >
        <button className="w-8 h-8 rounded-full bg-yellow-200 p-2">
          {CalendarIcon}
        </button>
        <div className="flex flex-col text-left">
          <div className="text-yellow-700 font-semibold text-lg">
            Class Schedule
          </div>
          <div className="text-yellow-500 font-semibold text-sm">
            Book sessions with your best matched tutors
          </div>
        </div>
      </button>
    </div>
  );
};

const TypeSelection = ({ selectType, setSelectType }) => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center text-lg">
      <button
        className={`w-full ${
          selectType === "exam" ? "bg-yellow-100" : "bg-white"
        } text-yellow-700 font-semibold rounded-md px-14 py-3 hover:bg-yellow-100 transition-colors duration-200 border-2 border-yellow-400`}
        onClick={() => setSelectType("exam")}
      >
        Standardized Tests
      </button>
      <p className="text-yellow-800 text-sm">OR</p>
      <button
        className={`w-full ${
          selectType === "subject" ? "bg-yellow-100" : "bg-white"
        } text-yellow-700 font-semibold rounded-md px-14 py-3 hover:bg-yellow-100 transition-colors duration-200 border-2 border-yellow-400`}
        onClick={() => setSelectType("subject")}
      >
        K-12 Subjects
      </button>
    </div>
  );
};

export default TimeService;
TypeSelection;
