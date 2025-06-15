import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";

const MeetingActions = ({
  status,
  onBook,
  onPayNow,
  onCancel,
  isLoading = false,
}) => {
  if (status === "scheduled") {
    return (
      <Button
        variant="primary"
        size="large"
        fullWidth
        onClick={onBook}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="small" light />
            Processing...
          </>
        ) : (
          "Book this slot"
        )}
      </Button>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex flex-col gap-4">
        <Button
          variant="success"
          size="large"
          fullWidth
          onClick={onPayNow}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" light />
              Processing...
            </>
          ) : (
            "Pay now"
          )}
        </Button>
        <Button
          variant="ghost"
          size="large"
          fullWidth
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel reservation
        </Button>
      </div>
    );
  }

  if (status === "booked") {
    return (
      <div className="text-center py-4 px-6 bg-[#FFF8E1] text-[#8b5e34] rounded-xl border border-[#FFE082] font-medium">
        This meeting is <span className="font-bold">booked</span>.
      </div>
    );
  }

  return null;
};

export default MeetingActions;
