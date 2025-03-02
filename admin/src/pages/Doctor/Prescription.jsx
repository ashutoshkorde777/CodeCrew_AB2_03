import React from "react";
// import { useForm } from "react-hook-form";
import html2pdf from "html2pdf.js";

const Prescription = () => {
  const { register, handleSubmit, reset } = useForm();

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log("Prescription Data:", data);
    generatePDF(data);
  };

  // Function to generate and download PDF
  const generatePDF = (data) => {
    const prescriptionContent = document.getElementById("prescription-content");

    // Create a PDF from the prescription content
    html2pdf()
      .from(prescriptionContent)
      .save("prescription.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Prescription Form</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        {/* Patient Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                type="text"
                {...register("patientName", { required: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                {...register("age", { required: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender", { required: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                {...register("date", { required: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Prescription Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Prescription Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Diagnosis
            </label>
            <textarea
              {...register("diagnosis", { required: true })}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Medication
            </label>
            <textarea
              {...register("medication", { required: true })}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Instructions
            </label>
            <textarea
              {...register("instructions", { required: true })}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Download PDF
          </button>
        </div>
      </form>

      {/* Hidden Prescription Content for PDF */}
      <div id="prescription-content" className="hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Prescription</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Patient Details</h2>
            <p>
              <strong>Name:</strong> <span id="pdf-patientName"></span>
            </p>
            <p>
              <strong>Age:</strong> <span id="pdf-age"></span>
            </p>
            <p>
              <strong>Gender:</strong> <span id="pdf-gender"></span>
            </p>
            <p>
              <strong>Date:</strong> <span id="pdf-date"></span>
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Prescription Details</h2>
            <p>
              <strong>Diagnosis:</strong> <span id="pdf-diagnosis"></span>
            </p>
            <p>
              <strong>Medication:</strong> <span id="pdf-medication"></span>
            </p>
            <p>
              <strong>Instructions:</strong> <span id="pdf-instructions"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescription;