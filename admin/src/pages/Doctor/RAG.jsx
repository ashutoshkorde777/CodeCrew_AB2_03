import React, { useState } from 'react';

const RAG = () => {
  // State to store the input values
  const [query, setQuery] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [output, setOutput] = useState('');

  // Function to handle the "Go" button click
  const handleGoClick = async () => {
    try {
      // Send the input data to the FastAPI backend
      const response = await fetch('http://localhost:8000/rag_cdss/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query, // Match the field name in the FastAPI request model
          symptoms, // Match the field name in the FastAPI request model
        }),
      });

      // Parse the response from the backend
      const data = await response.json();
      setOutput(data.recommendation); // Set the output state with the response
    } catch (error) {
      console.error('Error:', error);
      setOutput('An error occurred while processing your request.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">Doctor Query and Symptoms Input</h1>

      {/* Input for Doctor Query */}
      <div className="mb-6">
        <label htmlFor="query" className="block text-neutral-700 text-lg font-medium mb-2">
          Doctor Query:
        </label>
        <input
          type="text"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter your query..."
        />
      </div>

      {/* Input for Symptoms */}
      <div className="mb-6">
        <label htmlFor="symptoms" className="block text-neutral-700 text-lg font-medium mb-2">
          Symptoms:
        </label>
        <input
          type="text"
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter symptoms..."
        />
      </div>

      {/* Go Button */}
      <button
        onClick={handleGoClick}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-all"
      >
        Go
      </button>

      {/* Output Section */}
      {output && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Output:</h2>
          <p className="text-gray-700">{output}</p>
        </div>
      )}
    </div>
  );
};

export default RAG;