"use client";
import { useState, useEffect } from "react";
import { CustomerFormModal } from "../components/CustomerFormModal";
import { NewCustomerModal } from "../components/NewCustomerModal";

interface Initial {
  taxId: string;
  name: string;
  emails: string[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModelEdit, setOpenModalEdit] = useState(false);
  const [initial, setInitial] = useState<Initial>();
  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch(
        `/api/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`
      );
      const data = await res.json();
      setCustomers(data);
    };

    fetchCustomers();
  }, [search]);

  function handleClickEdit(c: Initial): void {
    setOpenModalEdit(true);
    setInitial({
      taxId: c.taxId,
      name: c.name,
      emails: c.emails,
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center pt-20 px-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-black">👥 Customers</h1>
          <p className="text-gray-500 mt-1">
            Search, add, edit or delete customers
          </p>
        </div>

        {/* Search + Add */}
        <div className="flex gap-3">
          <input
            placeholder="Search by company, tax ID, email"
            className="flex-1 border rounded-lg px-4 py-2 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => setOpenModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + New Customer
          </button>
        </div>

        {/* List (mock empty state) */}
        {customers.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-gray-600">No customers found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {customers.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl border p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-black">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.taxId}</div>
                  <div className="text-sm text-gray-400">
                    {c.emails.join(", ")}
                  </div>
                </div>

                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => handleClickEdit(c)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {openModal && <NewCustomerModal onClose={() => setOpenModal(false)} />}
        {openModelEdit && (
          <CustomerFormModal
            open={openModelEdit}
            onClose={() => setOpenModalEdit(false)}
            initial={initial}
          />
        )}
      </div>
    </main>
  );
}
