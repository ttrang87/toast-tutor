import BackButton from "../layout/BackButton";

const CalendarFooter = ({ to = "/" }) => (
  <footer className="mt-10 text-center">
    <BackButton to={to} label="Back to Previous" />
  </footer>
);

export default CalendarFooter;
