import React, { useState, useEffect } from 'react';
import { SavedPassenger, getSavedPassengers, addSavedPassenger, removeSavedPassenger } from '@/services/accountService';
import { Users, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PassengersSection() {
  const [passengers, setPassengers] = useState<SavedPassenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New passenger form state
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete dialog state
  const [passengerToDelete, setPassengerToDelete] = useState<SavedPassenger | null>(null);

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    try {
      setIsLoading(true);
      const data = await getSavedPassengers();
      setPassengers(data);
    } catch (err) {
      // Handle silently for mock
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter the full name.');
      return;
    }
    if (!age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
      setError('Please enter a valid age.');
      return;
    }
    if (!gender) {
      setError('Please select a gender.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPassenger = await addSavedPassenger({ fullName, age, gender });
      setPassengers([...passengers, newPassenger]);
      setSuccess('Passenger saved.');
      setIsAdding(false);
      setFullName('');
      setAge('');
      setGender('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Unable to save passenger. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!passengerToDelete) return;
    
    setIsSubmitting(true);
    try {
      await removeSavedPassenger(passengerToDelete.id);
      setPassengers(passengers.filter(p => p.id !== passengerToDelete.id));
      setPassengerToDelete(null);
      setSuccess('Passenger removed.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert("Unable to remove passenger.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 h-64 rounded-lg w-full"></div>;
  }

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Saved passengers</h2>
          <p className="text-secondary text-sm mt-1">Add passengers to make future bookings faster.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-1 bg-primary text-white text-sm font-medium px-4 py-2 rounded hover:bg-opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add passenger</span>
          </button>
        )}
      </div>

      {success && (
        <div className="mb-6 bg-success/10 border border-success/20 text-success p-4 rounded text-sm flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {isAdding && (
        <div className="mb-8 p-6 bg-gray-50 border border-border rounded-lg">
          <h3 className="font-bold text-primary mb-4">Add new passenger</h3>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label htmlFor="fullName" className="block text-sm font-semibold text-primary mb-1">Full Name</label>
              <input 
                id="fullName"
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-border rounded px-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="age" className="block text-sm font-semibold text-primary mb-1">Age</label>
              <input 
                id="age"
                type="number" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border border-border rounded px-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="gender" className="block text-sm font-semibold text-primary mb-1">Gender</label>
              <select 
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-border rounded px-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white appearance-none"
              >
                <option value="" disabled>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="md:col-span-12 flex space-x-4 mt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary text-white font-medium px-6 py-2 rounded hover:bg-opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save passenger'}
              </button>
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setError(''); }}
                disabled={isSubmitting}
                className="border border-border text-primary font-medium px-6 py-2 rounded hover:bg-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!isAdding && passengers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-lg font-bold text-primary mb-2">No saved passengers</h3>
          <p className="text-secondary text-sm">You haven't saved any passengers yet.</p>
        </div>
      )}

      {passengers.length > 0 && (
        <div className="space-y-4">
          {passengers.map(p => (
            <div key={p.id} className="flex justify-between items-center p-4 border border-border rounded hover:border-primary/30 transition-colors">
              <div>
                <span className="block font-bold text-primary text-lg">{p.fullName}</span>
                <span className="text-sm text-secondary">{p.age} years • <span className="capitalize">{p.gender}</span></span>
              </div>
              <button 
                onClick={() => setPassengerToDelete(p)}
                className="p-2 text-secondary hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                aria-label={`Remove ${p.fullName}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {passengerToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-primary mb-2">Remove saved passenger?</h3>
            <p className="text-secondary text-sm mb-6 pb-4 border-b border-border">
              This will remove <strong>{passengerToDelete.fullName}</strong> from your saved passenger list. It will not cancel any existing bookings.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setPassengerToDelete(null)}
                className="px-4 py-2 border border-border text-primary font-medium rounded hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Keep passenger
              </button>
              <button 
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Removing...' : 'Remove passenger'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
