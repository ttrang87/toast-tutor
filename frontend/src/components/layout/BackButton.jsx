import { useNavigate } from "react-router-dom";

const BackButton = ({ to = "/", label = "Back to Home", onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-lg text-[#FF8A65] hover:text-[#ff7043]"
    >
      ← {label}
    </button>
  );
};

export default BackButton;
