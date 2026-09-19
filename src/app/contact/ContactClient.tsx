"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { submitSupportTicket } from '@/services/helpService';
import Link from 'next/link';

export default function ContactClient() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    booking_reference: '',
    category: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const ticket = await submitSupportTicket({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        booking_reference: formData.booking_reference,
        category: formData.category,
        message: formData.message
      });
      setSuccessTicket(ticket.reference);
    } catch (err) {
      console.error(err);
      alert('Unable to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (successTicket) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white border border-border rounded-lg p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Your support request has been submitted.</h2>
          <p className="text-secondary mb-6">
            Thank you for reaching out. Our support team will review your message and respond shortly.
          </p>
          <div className="bg-gray-50 border border-border rounded p-4 mb-8 inline-block">
            <p className="text-sm text-secondary mb-1">Your Ticket Reference Number:</p>
            <p className="font-mono font-bold text-lg text-primary">{successTicket}</p>
          </div>
          <div>
            <Link href="/" className="text-primary font-medium hover:underline">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-3">Contact TravelEase</h1>
        <p className="text-secondary text-lg">
          Need help with a booking, payment or another TravelEase service? Contact our support team.
        </p>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">Full Name</label>
              <input 
                type="text" 
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-primary mb-1">Phone Number (Optional)</label>
              <input 
                type="tel" 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label htmlFor="booking_reference" className="block text-sm font-medium text-primary mb-1">Booking Reference (Optional)</label>
              <input 
                type="text" 
                id="booking_reference"
                name="booking_reference"
                value={formData.booking_reference}
                onChange={handleChange}
                placeholder="e.g. BKG-12345"
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-primary mb-1">Category</label>
            <select 
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
            >
              <option value="" disabled>Select a category</option>
              <option value="Booking">Booking</option>
              <option value="Payment">Payment</option>
              <option value="Cancellation">Cancellation</option>
              <option value="Refund">Refund</option>
              <option value="Account">Account</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="message" className="block text-sm font-medium text-primary">How can we help?</label>
              <span className="text-xs text-secondary">{formData.message.length}/1000</span>
            </div>
            <textarea 
              id="message"
              name="message"
              required
              maxLength={1000}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
            ></textarea>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-medium py-3 rounded hover:bg-opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit request'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
