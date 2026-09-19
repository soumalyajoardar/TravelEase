"use client";

import React, { useState } from 'react';
import { addRecord } from '@/services/travelService';
import { TravelRecord, TravelType, ACStatus, SeatType } from '@/types/travel';

interface TravelDataFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function TravelDataForm({ onCancel, onSuccess }: TravelDataFormProps) {
  const [type, setType] = useState<TravelType>('train');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    operator: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    baseFare: '',
    taxes: '',
    serviceFee: '',
    availability: '50',
    active: true,
    
    // Train specific
    trainNumber: '',
    classCategory: 'SL',
    
    // Bus specific
    busType: 'Volvo',
    acStatus: 'AC' as ACStatus,
    seatType: 'Sleeper' as SeatType,
    boardingInfo: '',
    droppingInfo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const base = Number(formData.baseFare) || 0;
    const taxes = Number(formData.taxes) || 0;
    const serviceFee = Number(formData.serviceFee) || 0;
    const total = base + taxes + serviceFee;

    const baseRecord = {
      id: Math.random().toString(36).substring(7),
      operator: formData.operator,
      origin: formData.origin,
      destination: formData.destination,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      duration: formData.duration,
      fare: { base, taxes, serviceFee, total },
      availability: Number(formData.availability),
      active: formData.active,
    };

    let record: TravelRecord;

    if (type === 'train') {
      record = {
        ...baseRecord,
        type: 'train',
        trainNumber: formData.trainNumber,
        classCategory: formData.classCategory
      };
    } else {
      record = {
        ...baseRecord,
        type: 'bus',
        busType: formData.busType,
        acStatus: formData.acStatus,
        seatType: formData.seatType,
        boardingInfo: formData.boardingInfo,
        droppingInfo: formData.droppingInfo
      };
    }

    await addRecord(record);
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Basic Info */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Travel Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as TravelType)}
              className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="train">Train</option>
              <option value="bus">Bus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Operator / Name *</label>
            <input required type="text" name="operator" value={formData.operator} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          
          {type === 'train' && (
            <>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Train Number *</label>
                <input required type="text" name="trainNumber" value={formData.trainNumber} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Class Category</label>
                <input type="text" name="classCategory" placeholder="e.g. 3A, SL" value={formData.classCategory} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </>
          )}

          {type === 'bus' && (
            <>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Bus Type</label>
                <input type="text" name="busType" placeholder="e.g. Volvo Multi-Axle" value={formData.busType} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">AC Status</label>
                <select name="acStatus" value={formData.acStatus} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Seat Type</label>
                <select name="seatType" value={formData.seatType} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="Sleeper">Sleeper</option>
                  <option value="Seater">Seater</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Route & Schedule */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-4">Route & Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Origin *</label>
            <input required type="text" name="origin" value={formData.origin} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Destination *</label>
            <input required type="text" name="destination" value={formData.destination} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Departure Time (HH:MM) *</label>
            <input required type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Arrival Time (HH:MM) *</label>
            <input required type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Duration *</label>
            <input required type="text" name="duration" placeholder="e.g. 11h 50m" value={formData.duration} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          
          {type === 'bus' && (
            <>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Boarding Info</label>
                <input type="text" name="boardingInfo" value={formData.boardingInfo} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Dropping Info</label>
                <input type="text" name="droppingInfo" value={formData.droppingInfo} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pricing & Status */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-4">Pricing & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Base Fare (₹) *</label>
            <input required type="number" name="baseFare" value={formData.baseFare} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Taxes (₹) *</label>
            <input required type="number" name="taxes" value={formData.taxes} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Service Fee (₹) *</label>
            <input required type="number" name="serviceFee" value={formData.serviceFee} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Availability (Seats)</label>
            <input required type="number" name="availability" value={formData.availability} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="rounded text-primary focus:ring-primary w-4 h-4" />
              <span className="font-medium text-primary">Active (Visible to users)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 border border-border text-primary font-medium rounded hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-medium rounded hover:bg-opacity-90 transition-opacity disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Record'}
        </button>
      </div>

    </form>
  );
}
