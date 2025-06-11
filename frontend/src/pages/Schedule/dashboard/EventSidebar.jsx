import { Calendar, Clock, MapPin, Users, X } from "lucide-react";

export default function EventSidebar({ selectedEvent, onClose, convertToLocalTime }) {
  const getEventColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return 'bg-yellow-400';
      default:
        return 'bg-orange-300';
    }
  };

  const formatEventDateTime = (event) => {
    const localDateTime = convertToLocalTime(event.originalDate, event.originalTime);
    return localDateTime.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const handleMeetingClick = () => {
    if (selectedEvent.google_meet_link && selectedEvent.google_meet_link.startsWith('http')) {
      window.open(selectedEvent.google_meet_link, '_blank');
    } else {
      alert('Invalid or missing Google Meet link: ' + selectedEvent.google_meet_link);
    }
  };

  return (
    <div className="w-1/3 border-gray-50">
      <div className="p-6 border-2 border-gray-100 mt-20 mr-7 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Event Title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-4 h-4 rounded-full ${getEventColor(selectedEvent.status)}`} />
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
                <div className="font-medium">{formatEventDateTime(selectedEvent)}</div>
                <div className="text-sm flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  {selectedEvent.localTime} • {selectedEvent.duration}
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
            <h5 className="font-medium text-gray-900 mb-3">Attendees ({selectedEvent.attendees?.length || 0})</h5>
            <div className="space-y-2">
              {selectedEvent.attendees?.map((attendee, index) => (
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
              onClick={handleMeetingClick}
            >
              Go To Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}