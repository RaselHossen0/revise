import React from 'react';

const ConfirmationModal = ({ open, handleClose, handleConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white border-2 shadow-lg p-6 w-72 rounded-md">
        <h2 className="text-xl font-semibold text-gray-900">
          Confirm Deletion
        </h2>
        <p className="mt-2 text-gray-700">
          Are you sure you want to delete this record?
        </p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
