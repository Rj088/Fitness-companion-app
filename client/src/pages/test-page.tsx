import React from 'react';

export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Test Page</h1>
        <p className="text-center text-gray-600 mb-4">
          This is a simple test page to verify that routing and rendering are working correctly.
        </p>
        <div className="bg-blue-100 p-4 rounded-md">
          <p className="text-blue-800">
            If you can see this page, then the basic rendering is working!
          </p>
        </div>
      </div>
    </div>
  );
}