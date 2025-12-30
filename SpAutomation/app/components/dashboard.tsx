"use client";
import { useEffect, useState } from "react";
import SendEmailModal from "./SendEmailModal";
import { OTCard } from "./OTCard";
import { getGmailAuth } from "@/lib/gmailAuth";
import { useRouter } from 'next/navigation';

interface DashboardRow {
  taxId: string;
  company: string;
  OTD: string;
  MID: string;
  IID: string | null;
  RID: string | null;
}



export default function Home() {
  // const [data, setData] = useState<DashboardRow[]>([]);
  const [open, setOpen] = useState(false);
  // const [data] = useState(MOCK_DASHBOARD_DATA);
  const [page, setPage] = useState(1);
  const [data, setRows] = useState<DashboardRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard?page=${page}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data.data);
        setTotalPages(data.totalPages);
      });
    setLoading(false);
  }, [page]);
  const router = useRouter();
  

  const openSendModal = (row: DashboardRow) => {
    setOpen(true);
  };

  return (
    <main className="flex flex-col items-center   min-h-screen bg-gray-50 p-6">
      <div className="flex justify-center items-center">
        <img src="/logo.png" className="w-30"></img>
        <h1 className="text-3xl font-bold m-6 text-black">
          SP Automation and software enginer
        </h1>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Have data */}
        {!loading && data.length > 0 && (
          <div className="grid gap-4">
            {data.map((row) => (
              <OTCard key={row.OTD} row={row} />
            ))}
          </div>
        )}

        {/* No data */}
        {!loading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-dashed border-amber-300 bg-amber-50 text-center px-6">
            <div className="text-5xl mb-4">📄</div>

            <h2 className="text-xl font-semibold text-amber-800">
              No OT data yet
            </h2>

            <p className="text-amber-700 mt-2 max-w-md">
              You haven’t sent any quotation or invoice yet. Start by sending a
              new email to create your first OT process.
            </p>

            <button
              onClick={() => setOpen(true)}
              className="mt-6 px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              Send New Email
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded  border-amber-950 text-black
        ${page === i + 1 ? "bg-blue-600 text-white" : ""}
      `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        {data.length != 0 && (
          <div>
            <button
              onClick={() => router.push("/customers")}
              className="
        m-6 px-6 py-3 rounded-lg
        bg-blue-500 text-white font-medium
        hover:bg-blue-950
      "
            >
              Edit Customer
            </button>

            <button
              onClick={() => setOpen(true)}
              className="
        mt-6 px-6 py-3 rounded-lg
        bg-green-600 text-white font-medium
        hover:bg-green-700 transition
      "
            >
              Send New Email
            </button>
          </div>
        )}
      </div>

      {open && <SendEmailModal onClose={() => setOpen(false)} />}
    </main>
  );
}
