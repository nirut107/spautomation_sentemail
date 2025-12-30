import { useState } from "react";

interface Props {
  onClose: () => void;
  onNew: () => Promise<void>;
}

export function NewCustomerModal({ onClose, onNew }: Props) {
  const [name, setName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);

  async function handleClick() {
    try {
      const res = await fetch("/api/customers", {
        method: "PUT",
        body: JSON.stringify({ taxId, emails, name }),
      });
    } catch (e) {
      console.error(e);
    }
    await onNew();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 text-black">
        <h2 className="text-xl font-bold">New Customer</h2>

        <input
          placeholder="Company name"
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Tax ID"
          className="w-full border rounded px-3 py-2"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
        />

        {emails.map((email, i) => (
          <input
            key={i}
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => {
              const copy = [...emails];
              copy[i] = e.target.value;
              setEmails(copy);
            }}
          />
        ))}

        <button
          onClick={() => setEmails([...emails, ""])}
          className="text-blue-600 text-sm"
        >
          + Add email
        </button>

        <div className="flex justify-end gap-3 pt-2 ">
          <button onClick={onClose} className="px-4 py-2 rounded bg-red-400">
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleClick}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
