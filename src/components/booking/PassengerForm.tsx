import React, { useState } from 'react';
import { UserPlus, Trash2, User, AlertCircle } from 'lucide-react';
import { TravelRecord } from '@/types/travel';

export interface Passenger {
  id: string;
  fullName: string;
  age: string;
  gender: string;
}

interface PassengerFormProps {
  record: TravelRecord;
  passengers: Passenger[];
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
}

export default function PassengerForm({ record, passengers, setPassengers }: PassengerFormProps) {
  const maxPassengers = Math.min(6, record.availability); // Example rule: max 6 per booking, or up to availability
  
  // Contact details state
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [consent, setConsent] = useState(false);
  
  // Simple validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addPassenger = () => {
    if (passengers.length < maxPassengers) {
      setPassengers([...passengers, { id: Math.random().toString(36).substring(7), fullName: '', age: '', gender: '' }]);
    }
  };

  const removePassenger = (id: string) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
    }
  };

  const updatePassenger = (id: string, field: keyof Passenger, value: string) => {
    setPassengers(passengers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    passengers.forEach((p, index) => {
      if (!p.fullName.trim()) {
        newErrors[`p_${index}_name`] = "Please enter the passenger's full name.";
        isValid = false;
      }
      if (!p.age || isNaN(Number(p.age)) || Number(p.age) < 1 || Number(p.age) > 120) {
        newErrors[`p_${index}_age`] = "Please enter a valid age.";
        isValid = false;
      }
      if (!p.gender) {
        newErrors[`p_${index}_gender`] = "Please select a gender.";
        isValid = false;
      }
    });

    if (!mobile || !/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      newErrors['mobile'] = "Please enter a valid 10-digit mobile number.";
      isValid = false;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors['email'] = "Please enter a valid email address.";
      isValid = false;
    }

    if (!consent) {
      newErrors['consent'] = "You must agree to the Terms & Conditions to continue.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      window.location.href = `/booking/payment?tripId=${record.id}&classId=${encodeURIComponent('opt_1')}&passengers=${passengers.length}`;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white border border-border rounded-lg shadow-sm p-6 mb-6">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-xl font-bold text-primary flex items-center space-x-2">
            <User className="w-6 h-6 text-secondary" />
            <span>Passenger details</span>
          </h2>
          <p className="text-secondary text-sm mt-1">Enter details exactly as they appear on the passenger's identification document.</p>
        </div>

        <div className="space-y-6">
          {passengers.map((p, index) => (
            <div key={p.id} className="p-4 border border-border bg-background rounded-lg relative">
              <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                <h3 className="font-bold text-primary">Passenger {index + 1}</h3>
                {passengers.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removePassenger(p.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                    aria-label={`Remove Passenger ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <label htmlFor={`name-${p.id}`} className="block text-sm font-semibold text-primary mb-1">Full Name</label>
                  <input 
                    id={`name-${p.id}`}
                    type="text" 
                    placeholder="Enter full name"
                    value={p.fullName}
                    onChange={(e) => updatePassenger(p.id, 'fullName', e.target.value)}
                    className={`w-full border rounded px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary ${errors[`p_${index}_name`] ? 'border-red-500 bg-red-50' : 'border-border bg-white'}`}
                  />
                  {errors[`p_${index}_name`] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors[`p_${index}_name`]}</p>
                  )}
                </div>
                
                <div className="md:col-span-3">
                  <label htmlFor={`age-${p.id}`} className="block text-sm font-semibold text-primary mb-1">Age</label>
                  <input 
                    id={`age-${p.id}`}
                    type="number" 
                    placeholder="e.g. 35"
                    value={p.age}
                    onChange={(e) => updatePassenger(p.id, 'age', e.target.value)}
                    className={`w-full border rounded px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary ${errors[`p_${index}_age`] ? 'border-red-500 bg-red-50' : 'border-border bg-white'}`}
                  />
                  {errors[`p_${index}_age`] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors[`p_${index}_age`]}</p>
                  )}
                </div>
                
                <div className="md:col-span-3">
                  <label htmlFor={`gender-${p.id}`} className="block text-sm font-semibold text-primary mb-1">Gender</label>
                  <select 
                    id={`gender-${p.id}`}
                    value={p.gender}
                    onChange={(e) => updatePassenger(p.id, 'gender', e.target.value)}
                    className={`w-full border rounded px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none ${errors[`p_${index}_gender`] ? 'border-red-500 bg-red-50' : 'border-border bg-white'}`}
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors[`p_${index}_gender`] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors[`p_${index}_gender`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {passengers.length < maxPassengers && (
            <button 
              type="button" 
              onClick={addPassenger}
              className="flex items-center space-x-2 text-primary border border-primary font-medium px-4 py-3 rounded hover:bg-background transition-colors w-full justify-center md:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add another passenger</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-primary mb-2">Contact details</h2>
        <p className="text-secondary text-sm mb-6 pb-4 border-b border-border">Booking updates and important travel information will be sent to these details.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="mobile" className="block text-sm font-semibold text-primary mb-1">Mobile Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l border border-r-0 border-border bg-background text-secondary text-sm">+91</span>
              <input 
                id="mobile"
                type="tel" 
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={`w-full border rounded-r px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary ${errors['mobile'] ? 'border-red-500 bg-red-50' : 'border-border bg-white'}`}
              />
            </div>
            {errors['mobile'] && (
              <p className="text-red-600 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors['mobile']}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-primary mb-1">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary ${errors['email'] ? 'border-red-500 bg-red-50' : 'border-border bg-white'}`}
            />
            {errors['email'] && (
              <p className="text-red-600 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors['email']}</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-secondary italic">We only use the information needed to process your booking and provide your travel details.</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg shadow-sm p-6 mb-8">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 rounded text-primary focus:ring-primary w-5 h-5 border-gray-300"
          />
          <div>
            <span className="text-sm font-medium text-primary block">
              I agree to the TravelEase <a href="#" className="text-accent hover:underline">Terms & Conditions</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
            </span>
            {errors['consent'] && (
              <p className="text-red-600 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors['consent']}</p>
            )}
          </div>
        </label>
      </div>

      {/* Mobile-only CTA handled by CSS via parent, but we include a standard submit button that forms trigger */}
      <div className="hidden lg:block">
        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-opacity-90 text-white font-bold text-lg py-4 px-6 rounded transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Continue to payment
        </button>
      </div>
      
      {/* Invisible submit button to allow Enter key submission */}
      <button type="submit" className="hidden" aria-hidden="true">Submit</button>
    </form>
  );
}
