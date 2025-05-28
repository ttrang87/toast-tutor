"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { API_ROUTES } from "../../constant/APIRoutes";
import { NoMeetingIcon, RefreshIcon, ScheduleIcon } from "../../assets/icon";

const MeetingsListPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(API_ROUTES.GET_MEETINGS, {
        withCredentials: true,
      });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];
      setMeetings(list);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [location]);

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-[#FFFDE7] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8b5e34]">All Meetings</h1>
          <p className="text-[#b78846] mt-2">View all scheduled meetings</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <Link
            to="/meetings/create"
            className="rounded-lg bg-[#E9967A] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#e07a5f] shadow-sm flex items-center"
          >
            {ScheduleIcon}
            Schedule New Meeting
          </Link>
          <button
            onClick={fetchMeetings}
            className="rounded-lg bg-[#FFD54F] px-5 py-2.5 font-medium text-[#8b5e34] transition-colors hover:bg-[#FFCA28] shadow-sm flex items-center"
          >
            {RefreshIcon}
            Refresh List
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FFE082] border-t-[#E9967A]" />
          </div>
        ) : (
          <div className="rounded-xl border border-[#FFE082] bg-white p-6 shadow-md overflow-hidden">
            {meetings.filter((m) => m.status === "scheduled").length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mx-auto mb-4">
                  {NoMeetingIcon}
                </div>
                <h3 className="text-xl font-medium text-[#8b5e34] mb-2">
                  No scheduled meetings
                </h3>
                <p className="text-[#b78846]">
                  Schedule a new meeting to get started
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#FFE082]">
                      <th className="px-4 py-3 text-left font-medium text-[#8b5e34]">
                        Start Time
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-[#8b5e34]">
                        End Time
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-[#8b5e34]">
                        Organizer
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-[#8b5e34]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetings
                      .filter((m) => m.status === "scheduled")
                      .map((m) => (
                        <tr
                          key={m.id}
                          className="border-b border-[#FFE082] hover:bg-[#FFF8E1] transition-colors"
                        >
                          <td className="px-4 py-3 text-[#8b5e34]">
                            {formatDateTime(m.start_time)}
                          </td>
                          <td className="px-4 py-3 text-[#8b5e34]">
                            {formatDateTime(m.end_time)}
                          </td>
                          <td className="px-4 py-3 text-[#8b5e34]">
                            {m.organizer_name}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              to={`/meetings/${m.id}`}
                              className="rounded-lg bg-[#E9967A] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#e07a5f] transition-colors inline-block"
                            >
                              Book
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsListPage;
