"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call to request reset password link
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <main className="flex-1 min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block text-primary font-bold text-2xl tracking-tight mb-6">
          TravelEase
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Forgot your password?</h1>
        <p className="text-secondary text-sm md:text-base px-4">
          Enter the email address associated with your TravelEase account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
          
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-lg font-bold text-primary mb-2">Check your email</h2>
              <p className="text-secondary text-sm mb-6">
                If an account matches that email address, we'll send instructions to reset your password.
              </p>
              <Link 
                href="/login"
                className="w-full flex justify-center py-3 px-4 border border-border rounded shadow-sm text-base font-bold text-primary bg-white hover:bg-gray-50 transition-colors"
              >
                Return to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded text-sm flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-border rounded shadow-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-base font-bold text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
                  >
                    {isSubmitting ? 'Sending link...' : 'Send reset link'}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-center">
                  <Link href="/login" className="font-medium text-primary hover:underline text-sm flex items-center justify-center">
                    &larr; Back to sign in
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
