const ProgressBar = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-8 rounded-full ${i < currentStep ? "bg-yellow-500" : "bg-yellow-100"}`}
        />
      ))}
    </div>
  );
};

export default ProgressBar;