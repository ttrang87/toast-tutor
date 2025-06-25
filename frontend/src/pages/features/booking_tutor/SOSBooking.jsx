import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../../../constant/APIRoutes";
import ProgressBar from "../../../components/booking_steps/ProgressBar";
import TypeSelection from "../../../components/booking_steps/TypeSelection";
import SubjectExamSelection from "../../../components/booking_steps/Subject_Exam_Selection";
import NavigationButtons from "../../../components/booking_steps/NavigationButton";

const SOSBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectType, setSelectType] = useState(null);
  const [selectExam, setSelectExam] = useState("");

  const navigate = useNavigate();
  const totalSteps = 2;

  const handleNext = async () => {
    if (
      (currentStep === 1 && !selectType) ||
      (currentStep === 2 && !selectExam)
    ) {
      toast.error("Please fill in required information", { duration: 1500 });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        const requestData = {
          userId: localStorage.getItem("userId"),
          request_type: selectType,
          subject_name: selectExam,
          date: "sos",
        };
        localStorage.setItem("selectedSubject", selectExam);

        // Navigate to waiting page first
        navigate("/waiting_match");

        const response = await axios.post(API_ROUTES.FIND_SOS_TUTORS, requestData);

        if (response.data && Array.isArray(response.data)) {
          // Store the response data
          localStorage.setItem(
            "matchedTutorsResponse",
            JSON.stringify(response.data)
          );
        } else {
          toast.error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error finding tutors:", error);
        toast.error("Error finding tutors. Please try again.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TypeSelection
            selectType={selectType}
            setSelectType={setSelectType}
          />
        );
      case 2:
        return (
          <SubjectExamSelection
            selectType={selectType}
            selectExam={selectExam}
            setSelectExam={setSelectExam}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center bg-yellow-50 min-h-screen">
      <div className="rounded-lg w-1/2 max-w-2xl min-h-[50vh] shadow-lg bg-white p-8 mb-20 space-y-5">
        <h1 className="text-yellow-700 text-3xl font-bold text-center">
          SOS Tutor Match 🍞
        </h1>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <div className="text-yellow-600 text-md text-center">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="font-semibold text-yellow-700 text-xl !mb-4">
          {currentStep === 1 && "What do you need help with?"}
          {currentStep === 2 &&
            (selectType === "exam"
              ? "Choose your exam"
              : "Choose your subject")}
        </div>

        {renderStepContent()}

        <NavigationButtons
          currentStep={currentStep}
          handleBack={handleBack}
          handleNext={handleNext}
        />
      </div>
    </div>
  );
};

export default SOSBooking;
