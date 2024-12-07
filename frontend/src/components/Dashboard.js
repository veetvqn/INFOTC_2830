import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventModal from './AddEventModal';
import ViewEventModal from './ViewEventModal';

// EventCard subcomponent
const EventCard = ({ event, onClick }) => {
  const date = new Date(event.event_date);
  const formattedDate = date.toLocaleString();

  return (
    <div
      onClick={() => onClick(event)}
      className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow min-w-full"
    >
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <div className="flex items-center gap-4">
        <p className="text-gray-600 text-sm">{formattedDate}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
          event.status === 'C' 
            ? 'bg-green-100 text-green-800'
            : event.status === 'X'
            ? 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {event.status === 'C' ? 'Completed' : event.status === 'X' ? 'Cancelled' : 'Active'}
        </span>
      </div>
    </div>
  );
};

// EventList subcomponent
const EventList = ({ events, onEventClick }) => {
  return (
    <div className="flex flex-col space-y-2 overflow-x-auto">
      {events.map(event => (
        <EventCard 
          key={event.id} 
          event={event} 
          onClick={onEventClick}
        />
      ))}
    </div>
  );
};

// Main Dashboard component
function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = async (eventData) => {
    try {
      if (!user || !user.id) {
        console.error('No valid user found');
        navigate('/login');
        return;
      }
  
      const eventDate = new Date(eventData.eventDate);
      const localDate = eventDate.toLocaleDateString('en-CA') + ' ' + 
                       eventDate.toTimeString().split(' ')[0];
    
      const requestBody = {
        userId: user.id,
        title: eventData.title.trim(),
        details: eventData.details.trim() || '',
        eventDate: localDate
      };
    
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }
    
      await fetchEvents();
      setIsAddModalOpen(false);
    
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleStatusChange = (eventId, newStatus) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    ));
    setIsViewModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const today = new Date().toDateString();
  const selectedDateString = selectedDate ? new Date(selectedDate).toDateString() : null;

  const todayEvents = events.filter(event => 
    new Date(event.event_date).toDateString() === today
  );

  const selectedDateEvents = events.filter(event => 
    new Date(event.event_date).toDateString() === selectedDateString
  );

  const filteredEvents = selectedDate
    ? events.filter(event => new Date(event.event_date).toDateString() === selectedDateString)
    : events;

  // Sort events by date
  const sortedFilteredEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.event_date) - new Date(b.event_date)
  );

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleResetDate = () => {
    setSelectedDate('');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800">
      {/* Header */}
      <div className="w-full bg-white/5 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-white/80">{user?.username || user?.email}</span>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                Add Event
              </button>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Today's Events */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Today's Events</h2>
          {todayEvents.length === 0 ? (
            <p className="text-gray-500">No events scheduled for today.</p>
          ) : (
            <EventList events={todayEvents} onEventClick={handleEventClick} />
          )}
        </div>

        {/* Date Selection and Events */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold">Events by Date</h2>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
              {selectedDate && (
                <button
                  onClick={handleResetDate}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                >
                  Show All Events
                </button>
              )}
            </div>
          </div>

          <div className="mb-2 text-sm text-gray-500">
            {selectedDate 
              ? `Showing events for ${new Date(selectedDate).toLocaleDateString()}`
              : 'Showing all events'}
          </div>

          {sortedFilteredEvents.length === 0 ? (
            <p className="text-gray-500">
              {selectedDate 
                ? 'No events scheduled for this date.'
                : 'No events found.'}
            </p>
          ) : (
            <EventList events={sortedFilteredEvents} onEventClick={handleEventClick} />
          )}
        </div>
      </div>

      <EventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEvent}
      />

      <ViewEventModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default Dashboard;