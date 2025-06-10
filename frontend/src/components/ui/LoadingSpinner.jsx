const LoadingSpinner = ({ size = "medium", light = false }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-12 w-12",
  };

  const borderColor = light ? "border-white" : "border-[#FFE082]";
  const spinnerColor = light ? "border-t-transparent" : "border-t-[#E9967A]";

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-4 ${borderColor} ${spinnerColor}`}
    />
  );
};

export default LoadingSpinner;
