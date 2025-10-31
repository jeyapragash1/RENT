import React from 'react';

export default function PricingPage(){
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded shadow text-center">
          <h3 className="text-xl font-semibold">Basic</h3>
          <p className="text-3xl font-bold mt-4">Rs. 0<span className="text-base">/listing</span></p>
          <p className="text-gray-600 mt-4">List your vehicle at no cost. Basic support included.</p>
        </div>
        <div className="bg-white p-8 rounded shadow text-center">
          <h3 className="text-xl font-semibold">Standard</h3>
          <p className="text-3xl font-bold mt-4">Rs. 199<span className="text-base">/month</span></p>
          <p className="text-gray-600 mt-4">Featured listings and priority support.</p>
        </div>
        <div className="bg-white p-8 rounded shadow text-center">
          <h3 className="text-xl font-semibold">Premium</h3>
          <p className="text-3xl font-bold mt-4">Rs. 499<span className="text-base">/month</span></p>
          <p className="text-gray-600 mt-4">Top placement and a dedicated account manager.</p>
        </div>
      </div>
    </div>
  );
}
