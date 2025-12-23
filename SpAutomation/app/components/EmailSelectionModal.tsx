"use client";
import { useState } from "react";

interface EmailSelectionModalProps {
  emails: string[];
  onClose: () => void;
  onSubmit: (selected: string[], newEmails: string[]) => void;
}

export default function EmailSelectionModal({
  emails,
  onClose,
  onSubmit,
}: EmailSelectionModalProps) {
  const [selected, setSelected] = useState<string[]>([...emails]);
  const [newEmails, setNewEmails] = useState<string[]>([""]);

  const toggleEmail = (email: string) => {
    setSelected((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const updateNewEmail = (index: number, value: string) => {
    const updated = [...newEmails];
    updated[index] = value;
    setNewEmails(updated);
  };

  const addEmailField = () => {
    setNewEmails([...newEmails, ""]);
  };

  const removeEmailField = (index: number) => {
    setNewEmails(newEmails.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const filtered = newEmails.filter((e) => e.trim() !== "");
    onSubmit(selected, filtered);
  };
  const inputClass = `
  w-full rounded-md border border-gray-300
  px-3 py-2 text-sm
  text-gray-900 placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-blue-500
`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Select Email Recipients
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose existing emails or add new ones
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-5">
          {/* Existing Emails */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Existing Emails
            </p>

            <div className="space-y-2">
              {emails.map((email) => (
                <label
                  key={email}
                  className="
                flex items-center gap-3
                bg-gray-50 rounded-md
                px-3 py-2
                cursor-pointer
                hover:bg-gray-100
              "
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(email)}
                    onChange={() => toggleEmail(email)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-800 truncate">
                    {email}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* New Emails */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Add More Emails
            </p>

            <div className="space-y-2">
              {newEmails.map((email, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={email}
                    onChange={(e) => updateNewEmail(idx, e.target.value)}
                    placeholder="example@company.com"
                    className={inputClass}
                  />

                  {idx > 0 && (
                    <button
                      onClick={() => removeEmailField(idx)}
                      className="
                    text-gray-400 hover:text-red-500
                    text-sm font-medium
                  "
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addEmailField}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              + Add another email
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
          px-4 py-2 rounded-md border
          text-sm text-gray-700
          hover:bg-gray-100
        "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
          px-5 py-2 rounded-md
          bg-blue-600 text-white
          text-sm font-medium
          hover:bg-blue-700
        "
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
