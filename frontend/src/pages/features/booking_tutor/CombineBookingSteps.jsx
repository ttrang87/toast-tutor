import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../../../constant/APIRoutes';
import ProgressBar from '../../../components/booking_steps/ProgressBar';
import TimeService from '../../../components/booking_steps/TimeService';
import TypeSelection from '../../../components/booking_steps/TypeSelection';
import SubjectExamSelection from '../../../components/booking_steps/Subject_Exam_Selection';
import PayRangeSelection from '../../../components/booking_steps/PayRange';
import ExamPreferences from '../../../components/booking_steps/ExamPreferences';
import SubjectPreferences from '../../../components/booking_steps/SubjectPreference';
import NavigationButtons from '../../../components/booking_steps/NavigationButton';


const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectOption, setSelectOption] = useState(null);
  const [selectType, setSelectType] = useState(null);
  const [selectExam, setSelectExam] = useState('');
  const [selectRange, setSelectRange] = useState('')
  const [selectLevel, setSelectLevel] = useState('')
  const [selectGrade, setSelectGrade] = useState('')
  const [aimScore, setAimScore] = useState('')
  const [maxScore, setMaxScore] = useState('')
  const [note, setNote] = useState(null)
  const [teachingStyles, setTeachingStyles] = useState([])

  const navigate = useNavigate()

  const handleNext = async () => {
    // Validation logic remains the same
    if (
      (currentStep === 1 && !selectOption) ||
      (currentStep === 2 && !selectType) ||
      (currentStep === 3 && !selectExam) ||
      (currentStep === 4 && !selectRange) ||
      (currentStep === 5 && selectType === "exam" && (!aimScore || !maxScore)) ||
      (currentStep === 5 && selectType === "subject" && (!selectGrade || !selectLevel))
    ) {
      toast.error("Please fill in required information", { duration: 1500 });
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        // Extract min and max pay from selectRange
        const [minPay, maxPay] = selectRange.split('-').map(num => parseInt(num.trim()));

        const requestData = {
          userId: localStorage.getItem('userId'),
          request_type: selectType,
          subject_name: selectExam,
          grade: selectType === 'subject' ? parseInt(selectGrade) : 0,
          aim: selectType === 'exam' ? parseFloat(aimScore) : selectLevel,
          max_score: selectType === 'exam' ? parseFloat(maxScore) : 0,
          description: note || 'No note',
          min_pay: minPay,
          max_pay: maxPay,
          teaching_styles: teachingStyles,
          date: selectOption
        };

        // Store search parameters in localStorage for the matched tutors page
        localStorage.setItem('selectedSubject', selectExam);

        // Navigate to waiting page first
        navigate('/waiting_match');

        const response = await axios.post(API_ROUTES.FIND_TUTORS, requestData);

        if (response.data && Array.isArray(response.data)) {
          // Store the response data
          localStorage.setItem('matchedTutorsResponse', JSON.stringify(response.data));
        } else {
          toast.error('Invalid response from server');
        }
      } catch (error) {
        console.error('Error finding tutors:', error);
        toast.error('Error finding tutors. Please try again.');
      }
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <TimeService selectOption={selectOption} setSelectOption={setSelectOption} />;
      case 2:
        return <TypeSelection selectType={selectType} setSelectType={setSelectType} />;
      case 3:
        return <SubjectExamSelection
          selectType={selectType}
          selectExam={selectExam}
          setSelectExam={setSelectExam}
        />;
      case 4:
        return <PayRangeSelection
          selectRange={selectRange}
          setSelectRange={setSelectRange} />
      case 5:
        if (selectType === "exam") {
          return <ExamPreferences
            aimScore={aimScore}
            setAimScore={setAimScore}
            maxScore={maxScore}
            setMaxScore={setMaxScore}
            teachingStyles={teachingStyles}
            setTeachingStyles={setTeachingStyles}
            note={note}
            setNote={setNote} />
        } else {
          return <SubjectPreferences
            selectGrade={selectGrade}
            setSelectGrade={setSelectGrade}
            selectLevel={selectLevel}
            setSelectLevel={setSelectLevel}
            teachingStyles={teachingStyles}
            setTeachingStyles={setTeachingStyles}
            note={note}
            setNote={setNote} />
        }
      default:
        return null;
    }
  };

  return (
    <div className='flex items-center justify-center bg-yellow-50 min-h-screen'>
      <Toaster position="top-right" reverseOrder={false} />
      <div className='rounded-lg w-1/2 max-w-2xl min-h-[50vh] shadow-lg bg-white p-8 mb-20 space-y-5'>
        <h1 className='text-yellow-700 text-3xl font-bold text-center'>Tutor Match 🍞</h1>
        <ProgressBar currentStep={currentStep} totalSteps={5} />
        <div className='text-yellow-600 text-md text-center'>Step {currentStep} of 5</div>
        <div className='font-semibold text-yellow-700 text-xl !mb-4'>
          {currentStep === 1 && "Choose a Service"}
          {currentStep === 2 && "What do you need help with?"}
          {currentStep === 3 && (selectType === "exam" ? "Choose your exam" : "Choose your subject")}
          {currentStep === 4 && "What is the price you can pay for an hour?"}
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

export default Booking;