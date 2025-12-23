"use client";
import { useState } from "react";

interface AddUserModalProps {
  taxId: string;
  onClose: () => void;
  onSubmit: (emails: string[]) => Promise<void>;
}

export default function AddUserModal({
  taxId,
  onClose,
  onSubmit,
}: AddUserModalProps) {
  const [emails, setEmails] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const updateEmail = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const removeEmailField = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const valid = emails.filter((e) => e.trim() !== "");
    try {
      await onSubmit(valid);
    } catch {
    } finally {
      setLoading(false);
    }
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
            Create New Customer
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Add email address for document delivery
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Tax ID */}
          <div className="bg-gray-50 rounded-md px-4 py-2 text-sm">
            <span className="text-gray-500">Tax ID</span>
            <div className="font-semibold text-gray-800 mt-1">{taxId}</div>
          </div>

          {/* Emails */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Addresses
            </label>

            <div className="space-y-2">
              {emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="example@company.com"
                    className={inputClass}
                  />

                  {emails.length > 1 && (
                    <button
                      onClick={() => removeEmailField(index)}
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
            disabled={loading}
            className={`
    px-5 py-2 rounded-md
    flex items-center gap-2
    text-sm font-medium text-white
    transition
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }
  `}
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}

            {loading ? "Sending..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
