const CalendarStyle = () => {
  return (
    <style>{`
          .react-calendar { width:100%; border:none; font-family:inherit; }
          .react-calendar__navigation { display:flex; justify-content:center; gap:1rem; margin-bottom:.75rem; }
          .react-calendar__navigation__label { font-size:1.25rem; font-weight:600; color:#8b5e34; }
          .react-calendar__navigation button { font-size:1.6rem; color:#8b5e34; padding:0 .25rem; }
          .react-calendar__month-view__weekdays { text-transform:uppercase; font-weight:600; color:#8b5e34; }
          .react-calendar__month-view__weekdays__weekday { padding:.6rem 0; padding-left:2.5rem;}
          .react-calendar__month-view__weekdays__weekday abbr { text-decoration:none; }
          .react-calendar__tile { padding:.8rem 0; border-radius:.5rem; font-weight:500; }
          .react-calendar__tile--now:not(.react-calendar__tile--active) { background:#FFE0824D; color:#8b5e34; }
          .react-calendar__tile--active,
          .react-calendar__tile--active:hover,
          .react-calendar__tile--active:focus { background:#FF8A65!important; color:#fff!important; }
          .react-calendar__month-view__days__day--weekend:not(.react-calendar__tile--active) { color:#FF8A00; }
          .react-calendar__month-view__days__day:not(.react-calendar__month-view__days__day--weekend):not(.react-calendar__tile--active) { color:#4c3b28; }
        `}</style>
  );
};

export default CalendarStyle;
