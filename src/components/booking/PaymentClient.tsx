"use client";

import React, { useState, useEffect } from 'react';
import { getRecordById } from '@/services/travelService';
import { TravelRecord, TrainRecord, BusRecord } from '@/types/travel';
import CheckoutProgress from './CheckoutProgress';
import FareSummary from './FareSummary';
import Link from 'next/link';
import { ShieldCheck, CreditCard, Smartphone, Building, AlertCircle } from 'lucide-react';

export default function PaymentClient({ tripId, classId, passengerCount }: { tripId: string, classId: string, passengerCount: number }) {
  const [record, setRecord] = useState<TravelRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [paymentState, setPaymentState] = useState<'ready' | 'processing' | 'success' | 'failed'>('ready');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setIsLoading(true);
        // Validates and re-fetches the actual pricing from backend
        const data = await getRecordById(tripId);
        if (data) {
          setRecord(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      fetchRecord();
    } else {
      setIsLoading(false);
      setError(true);
    }
  }, [tripId]);

  if (isLoading) return null; // Suspense handles skeleton

  if (error || !record) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-[1440px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Payment session unavailable</h2>
        <p className="text-secondary mb-8 max-w-md">
          We couldn't load this booking session. Please return to search and start again.
        </p>
        <Link 
          href="/search" 
          className="bg-primary text-white font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-opacity"
        >
          Back to search
        </Link>
      </div>
    );
  }

  const isTrain = record.type === 'train';
  const selectedCategory = isTrain ? (record as TrainRecord).classCategory : `${(record as BusRecord).acStatus} ${(record as BusRecord).seatType}`;
  const totalPayable = record.fare.total * passengerCount;

  const handlePayment = async () => {
    if (!consent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    setPaymentState('processing');

    try {
      // Import createBooking if not already imported, but let's just use it safely.
      // Wait, I need to make sure createBooking is imported at the top! I'll do that in another replace.
      const { createBooking } = await import('@/services/travelService');
      
      const passengersList = Array.from({ length: passengerCount }).map((_, i) => ({
        fullName: `Passenger ${i+1}`,
        age: '30',
        gender: 'other'
      })); // In a real flow, this would come from the context. We mock it structurally for the confirmation page.

      const booking = await createBooking({
        trip: record,
        passengers: passengersList,
        totalPaid: totalPayable,
        status: 'confirmed',
        paymentMethod: selectedMethod
      });

      setPaymentState('success');
      window.location.href = `/booking/confirmation/${booking.id}`;
    } catch (err) {
      setPaymentState('failed');
    }
  };

  return (
    <div className="pb-32 lg:pb-12">
      <CheckoutProgress currentStep={3} />
      
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Column */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            
            {/* Trip & Passenger Summary */}
            <div className="bg-white border border-border rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4 border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold text-primary mb-1">Booking overview</h2>
                  <p className="text-sm text-secondary">Review your trip before paying.</p>
                </div>
                <Link href={`/trip/${record.id}`} className="text-sm font-medium text-secondary hover:text-primary underline underline-offset-2">
                  Edit trip
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 text-sm">
                <div>
                  <span className="block text-secondary text-xs uppercase tracking-wider mb-1">Route</span>
                  <span className="font-semibold text-primary">{record.origin} → {record.destination}</span>
                </div>
                <div>
                  <span className="block text-secondary text-xs uppercase tracking-wider mb-1">Departure</span>
                  <span className="font-semibold text-primary">{record.departureTime}</span>
                </div>
                <div>
                  <span className="block text-secondary text-xs uppercase tracking-wider mb-1">Operator</span>
                  <span className="font-semibold text-primary truncate max-w-[120px] block" title={record.operator}>{record.operator}</span>
                </div>
                <div>
                  <span className="block text-secondary text-xs uppercase tracking-wider mb-1">Passengers</span>
                  <span className="font-semibold text-primary">{passengerCount} ({selectedCategory})</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white border border-border rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-primary mb-4">Payment method</h2>
              
              <div className="space-y-3">
                <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${selectedMethod === 'upi' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}>
                  <div className="flex items-center h-5">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="upi" 
                      checked={selectedMethod === 'upi'}
                      onChange={() => setSelectedMethod('upi')}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      disabled={paymentState === 'processing'}
                    />
                  </div>
                  <div className="ml-3 flex-1 flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-primary">UPI</span>
                      <span className="block text-sm text-secondary mt-0.5">Pay securely using your UPI app.</span>
                    </div>
                    <Smartphone className="w-6 h-6 text-secondary hidden sm:block" strokeWidth={1.5} />
                  </div>
                </label>

                <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${selectedMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}>
                  <div className="flex items-center h-5">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={selectedMethod === 'card'}
                      onChange={() => setSelectedMethod('card')}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      disabled={paymentState === 'processing'}
                    />
                  </div>
                  <div className="ml-3 flex-1 flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-primary">Credit / Debit Card</span>
                      <span className="block text-sm text-secondary mt-0.5">Pay using a Visa, Mastercard, or RuPay card.</span>
                    </div>
                    <CreditCard className="w-6 h-6 text-secondary hidden sm:block" strokeWidth={1.5} />
                  </div>
                </label>

                <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${selectedMethod === 'netbanking' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}>
                  <div className="flex items-center h-5">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="netbanking" 
                      checked={selectedMethod === 'netbanking'}
                      onChange={() => setSelectedMethod('netbanking')}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      disabled={paymentState === 'processing'}
                    />
                  </div>
                  <div className="ml-3 flex-1 flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-primary">Net Banking</span>
                      <span className="block text-sm text-secondary mt-0.5">Pay using your bank account.</span>
                    </div>
                    <Building className="w-6 h-6 text-secondary hidden sm:block" strokeWidth={1.5} />
                  </div>
                </label>
              </div>

              {/* Dynamic Payment Input Areas (Mocked) */}
              {selectedMethod === 'upi' && (
                <div className="mt-6 p-4 bg-background border border-border rounded">
                  <label htmlFor="upiId" className="block text-sm font-semibold text-primary mb-2">UPI ID</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      id="upiId"
                      type="text" 
                      placeholder="username@bank"
                      className="flex-1 border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={paymentState === 'processing'}
                    />
                    <button type="button" className="bg-primary text-white font-medium px-4 py-2 rounded hover:bg-opacity-90 transition-opacity whitespace-nowrap" disabled={paymentState === 'processing'}>
                      Verify UPI ID
                    </button>
                  </div>
                </div>
              )}
              
              {selectedMethod === 'card' && (
                <div className="mt-6 p-4 bg-background border border-border rounded space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-semibold text-primary mb-2">Card Number</label>
                    <input 
                      id="cardNumber"
                      type="text" 
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={paymentState === 'processing'}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-semibold text-primary mb-2">Expiry Date</label>
                      <input 
                        id="expiry"
                        type="text" 
                        placeholder="MM/YY"
                        className="w-full border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={paymentState === 'processing'}
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-semibold text-primary mb-2">CVV</label>
                      <input 
                        id="cvv"
                        type="password" 
                        placeholder="•••"
                        maxLength={4}
                        className="w-full border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={paymentState === 'processing'}
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0 space-y-6">
            
            <FareSummary record={record} passengerCount={passengerCount} />

            <div className="bg-white border border-border rounded-lg shadow-sm p-6">
              <label className="flex items-start space-x-3 cursor-pointer mb-4">
                <input 
                  type="checkbox" 
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 rounded text-primary focus:ring-primary w-5 h-5 border-gray-300"
                  disabled={paymentState === 'processing'}
                />
                <div>
                  <span className="text-sm font-medium text-primary block">
                    I agree to the TravelEase <a href="#" className="text-accent hover:underline">Terms & Conditions</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
                  </span>
                  {consentError && (
                    <p className="text-red-600 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>You must agree to continue.</p>
                  )}
                </div>
              </label>

              {paymentState === 'failed' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                  <div>
                    <span className="font-bold block mb-1">Payment could not be completed.</span>
                    Your payment was not processed. Please try again or use a different payment method.
                  </div>
                </div>
              )}

              <button 
                onClick={handlePayment}
                disabled={paymentState === 'processing' || paymentState === 'success'}
                className="w-full bg-primary hover:bg-opacity-90 disabled:bg-opacity-70 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-4 rounded transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center"
              >
                {paymentState === 'processing' ? 'Processing payment...' : `Pay ₹${totalPayable}`}
              </button>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-center text-xs text-secondary">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                <span>Your payment is securely processed.</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
