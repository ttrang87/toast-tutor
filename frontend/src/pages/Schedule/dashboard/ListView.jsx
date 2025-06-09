import { Calendar, Clock } from "lucide-react";

export default function ListView({ events, convertToLocalTime }) {
  const getEventColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return 'bg-yellow-400';
      default:
        return 'bg-orange-300';
    }
  };

  const getEventTextColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return 'text-yellow-400';
      default:
        return 'text-orange-300';
    }
  };

  const formatEventDate = (event) => {
    const localDateTime = convertToLocalTime(event.originalDate, event.originalTime);
    return localDateTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Sort events by local time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = convertToLocalTime(a.originalDate, a.originalTime);
    const dateB = convertToLocalTime(b.originalDate, b.originalTime);
    return dateA.getTime() - dateB.getTime();
  });

  const handleMeetingClick = (event) => {
    if (event.google_meet_link && event.google_meet_link.startsWith('http')) {
      window.open(event.google_meet_link, '_blank');
    } else {
      alert('Invalid or missing Google Meet link: ' + event.google_meet_link);
    }
  };

  return (
    <div className="space-y-6 h-[80vh] overflow-y-auto">
      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No meetings found</h3>
          <p className="text-gray-500">You don&apos;t have any meetings scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-4 pb-8">
          {sortedEvents.map((event) => (
            <div key={event.id} className="border-2 border-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-4 h-4 rounded-full ${getEventColor(event.status)}`} />
                      <h3 className={`font-semibold text-xl text-orange-300 ${getEventTextColor(event.status)}`}>{event.title}</h3>
                    </div>
                    <div className="text-gray-600 space-y-2 ml-7">
                      <p className="text-sm font-medium">{formatEventDate(event)}</p>
                      <p className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {event.localTime} • {event.duration}
                      </p>
                      <p className="text-sm">{event.description}</p>
                    </div>
                  </div>
                  <button 
                    className="px-4 py-2 bg-amber-100 rounded-lg text-gray-600 hover:bg-amber-200 transition-colors"
                    onClick={() => handleMeetingClick(event)}
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
  );
}