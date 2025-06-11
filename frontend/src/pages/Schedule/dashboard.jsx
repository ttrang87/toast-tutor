import { useState, useEffect, useCallback } from "react";
import { Calendar, List, Users, X } from "lucide-react";
import axios from "axios";

import { API_ROUTES } from "../../constant/APIRoutes";
import CalendarView from "./dashboard/CalendarView";
import ListView from "./dashboard/ListView";
import EventSidebar from "./dashboard/EventSidebar";

export default function ScheduleDashboard() {
  const [view, setView] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;

  // Helper function to convert GMT/UTC datetime to local timezone
  const convertToLocalTime = useCallback((dateStr, timeStr) => {
    const utcDateTime = new Date(`${dateStr}T${timeStr}:00.000Z`);
    return utcDateTime;
  }, []);

  // Helper function to format local time from UTC
  const formatLocalTime = useCallback((dateStr, timeStr) => {
    const localDateTime = convertToLocalTime(dateStr, timeStr);
    return localDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }, [convertToLocalTime]);

  // Helper function to get local date string from UTC datetime
  const getLocalDateString = useCallback((dateStr, timeStr) => {
    const localDateTime = convertToLocalTime(dateStr, timeStr);
    const year = localDateTime.getFullYear();
    const month = String(localDateTime.getMonth() + 1).padStart(2, "0");
    const day = String(localDateTime.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [convertToLocalTime]);

  // Move fetchUserMeetings outside useEffect and make it a useCallback
  const fetchUserMeetings = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(API_ROUTES.GET_USER_SCHEDULE(userId));

      const eventsWithLocalTime = response.data
        .filter(event => event.status !== 'pending')
        .map(event => ({
          ...event,
          localDate: getLocalDateString(event.date, event.time),
          localTime: formatLocalTime(event.date, event.time),
          originalDate: event.date,
          originalTime: event.time,
        }));

      setEvents(eventsWithLocalTime);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError('User not found');
        } else {
          setError(`Failed to fetch meetings: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Network error - please check your connection');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }

      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [formatLocalTime, getLocalDateString]);

  useEffect(() => {
    if (userId) {
      fetchUserMeetings(userId);
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [userId, fetchUserMeetings]);

  const refreshMeetings = () => {
    if (userId) {
      fetchUserMeetings(userId);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

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
        <div className="bg-white shadow-xl rounded-lg overflow-hidden h-full">
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
                <CalendarView
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  events={events}
                  onEventClick={handleEventClick}
                  convertToLocalTime={convertToLocalTime}
                />
              ) : (
                <ListView
                  events={events}
                  convertToLocalTime={convertToLocalTime}
                />
              )}
            </div>

            {/* Event Details Sidebar */}
            {selectedEvent && view === "calendar" && (
              <EventSidebar
                selectedEvent={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                convertToLocalTime={convertToLocalTime}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    );
  }
