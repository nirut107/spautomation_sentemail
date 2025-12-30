import { useState } from "react";
interface Props {
  open: boolean;
  onClose: () => void;
  onEdited: () => Promise<void>;
  initial?: {
    id: number;
    taxId: string;
    name: string;
    emails: string[];
  };
}

export function CustomerFormModal({ open, onClose, onEdited, initial }: Props) {
  const [id, setID] = useState(initial?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [taxId, setTaxId] = useState(initial?.taxId ?? "");
  const [emails, setEmails] = useState<string[]>(initial?.emails ?? [""]);

  if (!open) return null;

  async function handleClick() {
    try {
      const res = await fetch("/api/customers", {
        method: "PUT",
        body: JSON.stringify({ taxId, emails, name }),
      });
    } catch (e) {
      console.error(e);
    }
    await onEdited();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 text-black">
        <h2 className="text-xl font-bold">
          {initial ? "Edit Customer" : "New Customer"}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Company name"
          className="w-full border rounded p-2"
        />

        <input
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          placeholder="Tax ID"
          className="w-full border rounded p-2"
          disabled={!!initial}
        />

        {emails.map((e, i) => (
          <input
            key={i}
            value={e}
            onChange={(ev) => {
              const copy = [...emails];
              copy[i] = ev.target.value;
              setEmails(copy);
            }}
            placeholder="Email"
            className="w-full border rounded p-2"
          />
        ))}

        <button
          onClick={() => setEmails([...emails, ""])}
          className="text-blue-600 text-sm"
        >
          + Add email
        </button>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
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
