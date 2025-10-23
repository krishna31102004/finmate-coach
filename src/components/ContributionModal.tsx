import React, { useState } from 'react';

interface Props {
  goal: { id: string; name: string; target: number; current: number };
  onClose: () => void;
  onAdd: (amount: number) => void;
}

export default function ContributionModal({ goal, onClose, onAdd }: Props) {
  const [amount, setAmount] = useState('');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-80 space-y-4 shadow-xl">
        <h3 className="font-semibold text-lg text-textHeading">Add Contribution</h3>
        <p className="text-sm text-gray-600">Goal: {goal.name}</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full rounded text-sm"
          placeholder="Enter amount"
        />
        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-2 bg-neutral text-textHeading rounded-md hover:bg-gray-200 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 bg-accent text-white rounded-md hover:bg-green-500 focus:outline-none"
            onClick={() => {
              const amt = parseFloat(amount);
              if (!isNaN(amt) && amt > 0) {
                onAdd(amt);
                setAmount('');
              }
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}