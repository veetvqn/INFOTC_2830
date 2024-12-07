import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ViewEventModal = ({ event, isOpen, onClose, onStatusChange, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!isOpen || !event) return null;

  const date = new Date(event.event_date);
  const formattedDate = date.toLocaleString();

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${event.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      onDelete(event.id);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="text-red-500" size={48} />
            <h3 className="text-xl font-semibold text-center">Delete Event</h3>
            <p className="text-gray-600 text-center">
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Event Details</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-medium">{event.title}</h4>
          <p className="text-gray-600">
            <span className="font-medium">Date:</span> {formattedDate}
          </p>
          <div className="flex gap-2">
            <span className="font-medium">Status:</span>
            <select
              value={event.status}
              onChange={(e) => onStatusChange(event.id, e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="P">Active</option>
              <option value="C">Completed</option>
              <option value="X">Cancelled</option>
            </select>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <span className="font-medium">Details:</span>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {event.details || 'No additional details provided.'}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Event
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;