import { useState, useEffect } from "react";
import { Calendar, List, ChevronLeft, ChevronRight, X, Clock, MapPin, Users } from "lucide-react";
import axios from "axios";
import { API_ROUTES } from "../../constant/APIRoutes";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ScheduleDashboard() {
  const [view, setView] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId")

  // Function to fetch meetings from API
  const fetchUserMeetings = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(API_ROUTES.GET_USER_SCHEDULE(userId));
      setEvents(response.data);
      console.log(response.data)
    } catch (err) {
      console.error('Error fetching meetings:', err);
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 404) {
          setError('User not found');
        } else {
          setError(`Failed to fetch meetings: ${err.response.status}`);
        }
      } else if (err.request) {
        // Request was made but no response
        setError('Network error - please check your connection');
      } else {
        // Something else happened
        setError(err.message || 'An unexpected error occurred');
      }
      
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchUserMeetings(userId);
    } else {
      // If no userId provided, show empty state
      setEvents([]);
      setLoading(false);
    }
  }, [userId]);

  // Refresh function that can be called manually
  const refreshMeetings = () => {
    if (userId) {
      fetchUserMeetings(userId);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event) => event.date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatEventDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 p-5 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading meetings...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-yellow-50 p-5 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <X className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-600 mb-4">Error loading meetings: {error}</p>
                <button
                  onClick={refreshMeetings}
                  className="px-4 py-2 bg-orange-300 text-white rounded-lg hover:bg-orange-400 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No userId provided
  if (!userId) {
    return (
      <div className="min-h-screen bg-yellow-50 p-5 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Please provide a user ID to view meetings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-5 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 mt-7">
            <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-orange-100">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-600">My Meetings</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshMeetings}
                  className="px-5 py-2 text-md font-medium bg-white rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Refresh
                </button>
                <div className="flex bg-white rounded-lg p-1">
                  <button
                    onClick={() => setView("calendar")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                      view === "calendar" 
                        ? "bg-gray-100 shadow-sm text-yellow-600" 
                        : "text-gray-600 hover:text-gray-700"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                      view === "list" 
                        ? "bg-gray-100 shadow-sm text-yellow-600" 
                        : "text-gray-600 hover:text-gray-700"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Main Content */}
            <div className={`${selectedEvent && view === "calendar" ? "w-2/3" : "w-full"} p-6`}>
              {view === "calendar" ? (
                <div className="space-y-4 px-2">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-600">
                      {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigateMonth("prev")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => navigateMonth("next")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 bg-amber-100 p-1 rounded-lg">
                    {/* Day headers */}
                    {daysOfWeek.map((day) => (
                      <div key={day} className="p-3 text-center font-semibold text-gray-600 text-sm">
                        {day}
                      </div>
                    ))}

                    {/* Calendar days */}
                    {getDaysInMonth(currentDate).map((day, index) => {
                      const dayEvents = getEventsForDate(day);
                      return (
                        <div
                          key={index}
                          className={`min-h-[120px] p-2 bg-white rounded ${!day ? "bg-gray-50" : "hover:bg-gray-50"} transition-colors`}
                        >
                          {day && (
                            <>
                              <div className="font-semibold text-sm mb-2 text-gray-800">{day}</div>
                              <div className="space-y-1">
                                {dayEvents.slice(0, 2).map((event) => (
                                  <div
                                    key={event.id}
                                    onClick={() => handleEventClick(event)}
                                    className={`text-xs p-2 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity bg-orange-300`}
                                    title={`${event.time} - ${event.title}`}
                                  >
                                    <div className="font-medium">{event.time}</div>
                                    <div className="truncate">{event.title}</div>
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-gray-500 font-medium">
                                    +{dayEvents.length - 2} more
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 h-[80vh]">
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No meetings found</h3>
                      <p className="text-gray-500">You don&apos;t have any meetings scheduled yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedEvents.map((event) => (
                        <div key={event.id} className="border-2 border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className={`w-4 h-4 rounded-full bg-orange-300`} />
                                  <h3 className="font-semibold text-xl text-orange-300">{event.title}</h3>
                                </div>
                                <div className="text-gray-600 space-y-2 ml-7">
                                  <p className="text-sm font-medium">{formatEventDate(event.date)}</p>
                                  <p className="text-sm flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {event.time} • {event.duration}
                                  </p>
                                  <p className="text-sm">{event.description}</p>
                                </div>
                              </div>
                              <button 
                              className="px-4 py-2 bg-amber-100 rounded-lg text-gray-600 hover:bg-amber-200 transition-colors"
                              onClick={() => {
                                if (selectedEvent.google_meet_link && selectedEvent.google_meet_link.startsWith('http')) {
                                  window.open(selectedEvent.google_meet_link, '_blank');
                                } else {
                                  alert('Invalid or missing Google Meet link: ' + selectedEvent.google_meet_link);
                                }
                              }}
                              >
                                Go to Meeting
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Event Details Sidebar */}
            {selectedEvent && view === "calendar" && (
              <div className="w-1/3 border-gray-50">
                <div className="p-6 border-2 border-gray-100 mt-20 mr-7 rounded-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Event Title */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full bg-orange-300`} />
                        <h4 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h4>
                      </div>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {selectedEvent.type}
                      </span>
                    </div>

                    {/* Date and Time */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{formatEventDate(selectedEvent.date)}</div>
                          <div className="text-sm flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4" />
                            {selectedEvent.time} • {selectedEvent.duration}
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="h-5 w-5" />
                        <span>{selectedEvent.location}</span>
                      </div>

                      {/* Organizer */}
                      <div className="flex items-center gap-3 text-gray-600">
                        <Users className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Organized by</div>
                          <div className="text-sm">{selectedEvent.organizer}</div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                      <p className="text-gray-600 text-sm leading-relaxed">{selectedEvent.description}</p>
                    </div>

                    {/* Attendees */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Attendees ({selectedEvent.attendees.length})</h5>
                      <div className="space-y-2">
                        {selectedEvent.attendees.map((attendee, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                              <span className="text-amber-600 text-sm font-medium">
                                {attendee.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm text-gray-700">{attendee}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-3">
                      <button 
                      className="w-full bg-amber-400 text-white py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors"
                      onClick={() => {
                        if (selectedEvent.google_meet_link && selectedEvent.google_meet_link.startsWith('http')) {
                          window.open(selectedEvent.google_meet_link, '_blank');
                        } else {
                          alert('Invalid or missing Google Meet link: ' + selectedEvent.google_meet_link);
                        }
                      }}
                      >Go To Meeting</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}