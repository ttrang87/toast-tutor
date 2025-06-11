const CountdownTimer = ({ seconds }) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="text-center text-lg font-semibold text-white border-2 py-1 rounded-xl bg-yellow-600">
      Complete payment within&nbsp;
      <span className="font-mono">
        {mm}:{ss}
      </span>
    </div>
  );
};

export default CountdownTimer;
