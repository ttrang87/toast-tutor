import { ArrowLeftIcon, ArrowRightIcon } from '../../assets/icon';

const NavigationButtons = ({ currentStep, handleBack, handleNext }) => {
  return (
    <div className="flex justify-between text-sm pt-4">
      {/* Back Button: Display if currentStep > 1 */}
      {currentStep > 1 && (
        <button
          className="flex gap-2 px-3 py-2 rounded-md text-yellow-700 hover:bg-yellow-100 transition-colors duration-100"
          onClick={handleBack}
        >
          <div className="pt-1">{ArrowLeftIcon}</div>
          <div>Back</div>
        </button>
      )}

      {/* Next or Start Matching Button */}
      <div className={currentStep === 1 ? 'ml-auto' : ''}>
        <button
          className="flex gap-2 px-3 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition-colors duration-100"
          onClick={handleNext}
        >
          <div>{currentStep === 5 ? 'Start Matching' : 'Next'}</div>
          <div className="pt-1">{ArrowRightIcon}</div>
        </button>
      </div>
    </div>
  );
};

export default NavigationButtons;
