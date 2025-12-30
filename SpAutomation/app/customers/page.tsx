"use client";
import { useState, useEffect } from "react";
import { CustomerFormModal } from "../components/CustomerFormModal";
import { NewCustomerModal } from "../components/NewCustomerModal";
import { useRouter } from "next/navigation";

interface Customer {
  id: number;
  taxId: string;
  name: string;
  emails: string[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModelEdit, setOpenModalEdit] = useState(false);
  const [initial, setInitial] = useState<Customer>();

  const router = useRouter();

  const fetchCustomers = async () => {
    const res = await fetch(
      `/api/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`
    );
    const data = await res.json();
    console.log(data, "customers");
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  function handleClickEdit(c: Customer): void {
    setOpenModalEdit(true);
    setInitial({
      id: c.id,
      taxId: c.taxId,
      name: c.name,
      emails: c.emails,
    });
  }
  async function handleClickDelete(c: Customer) {
    try {
      const res = await fetch("/api/customers", {
        method: "DELETE",
        body: JSON.stringify({ taxId: c.taxId }),
      });
    } catch (e) {
      console.error(e);
    }
    fetchCustomers();
  }

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center pt-20 px-4">
      <div className="w-full max-w-4xl space-y-6">
        <button
          onClick={() => router.push("/")}
          className="
    flex items-center gap-2
    bg-gray-700 border
    px-4 py-2 rounded-lg
    text-sm font-medium
    text-white
    hover:bg-gray-100
    hover:text-black
    transition
    cursor-pointer
  "
        >
          ← Dashboard
        </button>

        {/* Header */}
        <div className="flex-col text-center mt-10">
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
            {customers.map((c: Customer) => (
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
                <div className="flex gap-2">
                  {/* Edit */}
                  <button
                    onClick={() => handleClickEdit(c)}
                    className="
      inline-flex items-center gap-2
      px-4 py-2 rounded-lg
      text-sm font-medium
      text-blue-700
      bg-blue-100
      hover:bg-blue-200
      hover:text-blue-800
      transition
    "
                  >
                    ✏️ Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleClickDelete(c)}
                    className="
      inline-flex items-center gap-2
      px-4 py-2 rounded-lg
      text-sm font-medium
      text-red-700
      bg-red-100
      hover:bg-red-200
      hover:text-red-800
      transition
    "
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {openModal && (
          <NewCustomerModal
            onClose={() => setOpenModal(false)}
            onNew={() => fetchCustomers()}
          />
        )}
        {openModelEdit && (
          <CustomerFormModal
            open={openModelEdit}
            onClose={() => setOpenModalEdit(false)}
            onEdited={() => fetchCustomers()}
            initial={initial}
          />
        )}
      </div>
    </main>
  );
}
