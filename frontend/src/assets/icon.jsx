/* src/assets/icon/index.jsx
   Toast Tutor icon library — unified warm palette
   -------------------------------------------------
   PRIMARY  (#E9967A)  → main brand accent
   GOLD     (#FFCA28)  → highlights / ratings
   DEEP     (#8B5E34)  → text-like accents
*/

const PRIMARY = "#E9967A";
const GOLD = "#FFCA28";
const DEEP = "#8B5E34";

/* ---------- primary-accent set (#E9967A) -------------------------------- */

export const ClockIcon = (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

export const BookIcon = (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
    />
  </svg>
);

export const CheckIcon = (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 12l3 3 5-5"
    />
  </svg>
);

export const EmailIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    <path
      strokeLinecap="round"
      strokeWidth="2"
      d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
    />
  </svg>
);

export const PhoneIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"
    />
  </svg>
);

/* ---------- gold highlight (#FFCA28) ------------------------------------- */

export const StarIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill={GOLD}>
    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
  </svg>
);

/* ---------- deep accent (#8B5E34) --------------------------------------- */

export const HomeIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={DEEP}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3.8 9.5 12.8 14l9-4.5-9-4.5-9 4.5Zm0 0V17m3-6v6.222C6.8 17.57 8.8 19 12.8 19c4 0 6-1.374 6-1.778V11"
    />
  </svg>
);

export const AwardIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={DEEP}>
    <path d="M11 9a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
    <path
      fillRule="evenodd"
      d="M9.896 3.051a2.681 2.681 0 0 1 4.208 0c.147.186.38.282.615.255a2.681 2.681 0 0 1 2.976 2.975.681.681 0 0 0 .254.615 2.681 2.681 0 0 1 0 4.208.682.682 0 0 0-.254.615 2.681 2.681 0 0 1-2.976 2.976.681.681 0 0 0-.615.254 2.682 2.682 0 0 1-4.208 0 .681.681 0 0 0-.614-.255 2.681 2.681 0 0 1-2.976-2.975.681.681 0 0 0-.255-.615 2.681 2.681 0 0 1 0-4.208.681.681 0 0 0 .255-.615 2.681 2.681 0 0 1 2.976-2.975.681.681 0 0 0 .614-.255ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      clipRule="evenodd"
    />
    <path d="M5.395 15.055 4.07 19a1 1 0 0 0 1.264 1.267l1.95-.65 1.144 1.707A1 1 0 0 0 10.2 21.1l1.12-3.18a4.641 4.641 0 0 1-2.515-1.208 4.667 4.667 0 0 1-3.411-1.656Zm7.269 2.867 1.12 3.177a1 1 0 0 0 1.773.224l1.144-1.707 1.95.65A1 1 0 0 0 19.915 19l-1.32-3.93a4.667 4.667 0 0 1-3.4 1.642 4.643 4.643 0 0 1-2.53 1.21Z" />
  </svg>
);

/* ---------- misc icons (primary colour by default) ----------------------- */

const strokeIcon = (d, w = "2") => (
  <path
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={w}
    d={d}
  />
);

export const CourseIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={PRIMARY}>
    <path
      fillRule="evenodd"
      d="M3 6a2 2 0 0 1 2-2h5.532a2 2 0 0 1 1.536.72l1.9 2.28H3V6Zm0 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Z"
      clipRule="evenodd"
    />
  </svg>
);

export const ExamIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={PRIMARY}>
    <path
      fillRule="evenodd"
      d="M11.644 3.066a1 1 0 0 1 .712 0l7 2.666A1 1 0 0 1 20 6.68a17.694 17.694 0 0 1-2.023 7.98 17.406 17.406 0 0 1-5.402 6.158 1 1 0 0 1-1.15 0 17.405 17.405 0 0 1-5.403-6.157A17.695 17.695 0 0 1 4 6.68a1 1 0 0 1 .644-.949l7-2.666Zm4.014 7.187a1 1 0 0 0-1.316-1.506l-3.296 2.884-.839-.838a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.366.046l4-3.5Z"
      clipRule="evenodd"
    />
  </svg>
);

export const EditIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    {strokeIcon(
      "M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
    )}
  </svg>
);

export const SmallEditIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    {strokeIcon(
      "M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
    )}
  </svg>
);

export const PlusIcon = (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    {strokeIcon("M5 12h14m-7 7V5")}
  </svg>
);

export const CameraIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={PRIMARY}>
    <path
      fillRule="evenodd"
      d="M7.5 4.586A2 2 0 0 1 8.914 4h6.172a2 2 0 0 1 1.414.586L17.914 6H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1.086L7.5 4.586ZM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      clipRule="evenodd"
    />
  </svg>
);

export const LightIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={GOLD}>
    {strokeIcon(
      "M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z"
    )}
  </svg>
);

/* Calendar and navigation icons ------------------------------------------- */
export const CalendarIcon = (
  <svg
    className="w-4 h-4 text-yellow-600 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke={PRIMARY}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
    />
  </svg>
);

export const ArrowLeftIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    {strokeIcon("M5 12h14M5 12l4-4m-4 4 4 4")}
  </svg>
);

export const ArrowRightIcon = (
  <svg
    className="w-4 h-4 text-white"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    {strokeIcon("M19 12H5m14 0-4 4m4-4-4-4")}
  </svg>
);

/* Outline star / education / small icons (stroke = GOLD) ------------------ */

export const TransparentStarIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={GOLD}>
    <path
      strokeWidth="2"
      d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
    />
  </svg>
);

export const EducationIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={GOLD}>
    {strokeIcon(
      "M3.8 9.5 12.8 14l9-4.5-9-4.5-9 4.5Zm0 0V17m3-6v6.2222c0 .3483 2 1.7778 6 1.7778 4 0 6-1.374 6-1.778V11"
    )}
  </svg>
);

export const SmallClockIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={GOLD}>
    {strokeIcon("M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z")}
  </svg>
);

export const SmallBookIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={GOLD}>
    {strokeIcon(
      "M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    )}
  </svg>
);

/* Locks / checks ----------------------------------------------------------- */
export const LockIcon = (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill={DEEP}>
    <path
      fillRule="evenodd"
      d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
      clipRule="evenodd"
    />
  </svg>
);

export const UnlockIcon = (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill={DEEP}>
    <path
      fillRule="evenodd"
      d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
      clipRule="evenodd"
    />
  </svg>
);

export const CheckerIcon = (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={DEEP}>
    {strokeIcon("M5 11.917 9.724 16.5 19 7.5")}
  </svg>
);

export const EnvelopeIcon = (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill={DEEP}>
    <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
    <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
  </svg>
);

/* arrows / eyes ------------------------------------------------------------ */

export const ArrowIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    {strokeIcon("M19 12H5m14 0-4 4m4-4-4-4")}
  </svg>
);

export const EyeCloseIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={DEEP}>
    <path d="m4 15.6 3.055-3.056A4.913 4.913 0 0 1 7 12.012a5.006 5.006 0 0 1 5-5c.178.009.356.027.532.054l1.744-1.744A8.973 8.973 0 0 0 12 5.012c-5.388 0-10 5.336-10 7A6.49 6.49 0 0 0 4 15.6Z" />
    <path d="m14.7 10.726 4.995-5.007A.998.998 0 0 0 18.99 4a1 1 0 0 0-.71.305l-4.995 5.007a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.402.211.59l-4.995 4.983a1 1 0 1 0 1.414 1.414l4.995-4.983c.189.091.386.162.59.211.011 0 .021.007.033.01a2.982 2.982 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z" />
    <path d="m19.821 8.605-2.857 2.857a4.952 4.952 0 0 1-5.514 5.514l-1.785 1.785c.767.166 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z" />
  </svg>
);

export const EyeOpenIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={DEEP}>
    <path
      fillRule="evenodd"
      d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      clipRule="evenodd"
    />
  </svg>
);

/* scheduler / refresh ------------------------------------------------------ */

export const ScheduleIcon = (
  <svg
    className="h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke={PRIMARY}
  >
    {strokeIcon("M12 6v12m-6-6h12")}
  </svg>
);

export const RefreshIcon = (
  <svg
    className="h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke={PRIMARY}
  >
    {strokeIcon(
      "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"
    )}
  </svg>
);

export const NoMeetingIcon = (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke={DEEP}>
    {strokeIcon(
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
    )}
  </svg>
);

export const CalendarCheck = (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    {strokeIcon(
      "M9 11l3 3L22 4M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
    )}
  </svg>
);

export const Clock = ClockIcon; // reuse
export const SmallClock = SmallClockIcon;

/* log out / google --------------------------------------------------------- */

export const LogOut = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}>
    {strokeIcon(
      "M17 16l4-4m0 0-4-4m4 4H7m6 4v1a2 2 0 1 1-4 0v-1m0-8V7a2 2 0 1 1 4 0v1"
    )}
  </svg>
);

export const GoogleCalendarIcon = (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill={PRIMARY}>
    <path d="M21.8 10.04H21V10H12V14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.53 6 14.92 6.58 15.98 7.52L18.81 4.69C17.02 3.03 14.63 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 11.33 21.93 10.68 21.8 10.04Z" />
  </svg>
);
