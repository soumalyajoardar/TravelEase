import React from 'react';

export default function CancellationPolicy() {
  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary mb-4">Cancellation & refund</h2>
      <div className="text-sm text-secondary space-y-3">
        <div className="flex justify-between border-b border-border pb-2">
          <span>More than 24 hours before departure</span>
          <span className="font-medium text-primary">₹100 cancellation fee</span>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <span>12 to 24 hours before departure</span>
          <span className="font-medium text-primary">50% refund</span>
        </div>
        <div className="flex justify-between">
          <span>Less than 12 hours before departure</span>
          <span className="font-medium text-primary">Non-refundable</span>
        </div>
      </div>
    </div>
  );
}

export function ImportantInformation() {
  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary mb-4">Important Travel Information</h2>
      <ul className="list-disc pl-5 text-sm text-secondary space-y-2">
        <li>A valid Government-issued ID is required for boarding.</li>
        <li>Please report to the boarding point at least 30 minutes before departure.</li>
        <li>Baggage limit: 15kg per passenger. Excess baggage may incur additional charges.</li>
      </ul>
    </div>
  );
}
