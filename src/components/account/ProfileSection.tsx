import React, { useState } from 'react';
import { User } from '@/context/AuthContext';
import { updateProfile } from '@/services/accountService';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileSection({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(''); // Simulated missing data handling
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (mobile && !/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(name, email, mobile);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000); // Hide success after a bit
    } catch (err) {
      setError('Unable to save your changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setName(user.name);
    setEmail(user.email);
    setMobile('');
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-bold text-primary">Personal information</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-primary hover:underline border border-border px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
          >
            Edit profile
          </button>
        )}
      </div>

      {success && (
        <div className="mb-6 bg-success/10 border border-success/20 text-success p-4 rounded text-sm flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
          <span className="font-medium">Profile updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded text-sm flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!isEditing ? (
        <div className="space-y-6">
          <div>
            <span className="block text-sm text-secondary mb-1">Full Name</span>
            <span className="font-bold text-primary text-lg">{name}</span>
          </div>
          <div>
            <span className="block text-sm text-secondary mb-1">Email Address</span>
            <div className="flex items-center space-x-3">
              <span className="font-bold text-primary text-lg">{email}</span>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded">Verified</span>
            </div>
          </div>
          <div>
            <span className="block text-sm text-secondary mb-1">Mobile Number</span>
            {mobile ? (
              <span className="font-bold text-primary text-lg">+91 {mobile}</span>
            ) : (
              <span className="text-secondary italic">Not added</span>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-md">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">Full Name</label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">Email Address</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-secondary mt-1">You will need to verify your new email address.</p>
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-semibold text-primary mb-2">Mobile Number (Optional)</label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l border border-r-0 border-border bg-gray-50 text-secondary text-sm">+91</span>
              <input 
                id="mobile"
                type="tel" 
                placeholder="10-digit number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="flex-1 border border-border rounded-r px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary text-white font-medium px-6 py-2.5 rounded hover:bg-opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
            <button 
              type="button" 
              onClick={cancelEdit}
              disabled={isSubmitting}
              className="border border-border text-primary font-medium px-6 py-2.5 rounded hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
