"use client";
import { useEffect, useState } from "react";
import SendEmailModal from "./SendEmailModal";
import { OTCard } from "./OTCard";

interface DashboardRow {
  taxId: string;
  company: string;
  OTD: string;
  IID: string | null;
  RID: string | null;
}

const MOCK_DASHBOARD_DATA: DashboardRow[] = [
  {
    taxId: "0115550001143",
    company: "บริษัท กราฟฟิค อาร์ต ดีไซน์ จำกัด",
    OTD: "QT-256811001",
    IID: null,
    RID: null,
  },
  {
    taxId: "0125556019478",
    company: "บริษัท เอ บี ซี อินดัสตรี จำกัด",
    OTD: "QT-256811002",
    IID: "IN-256812003",
    RID: null,
  },
  {
    taxId: "0135557012345",
    company: "บริษัท เอส พี ออโตเมชั่น แอนด์ ซอฟต์แวร์ จำกัด",
    OTD: "QT-256811003",
    IID: "IN-256812004",
    RID: "RE-256812006",
  },
  {
    taxId: "0145558098765",
    company: "บริษัท ไทยเทค โซลูชั่น จำกัด",
    OTD: "QT-256811004",
    IID: null,
    RID: null,
  },
];

export default function Home() {
  // const [data, setData] = useState<DashboardRow[]>([]);
  const [open, setOpen] = useState(false);
  const [data] = useState(MOCK_DASHBOARD_DATA);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [totalPages, setTotalPages] = useState(3);

  // useEffect(() => {
  //   fetch(`/api/dashboard?page=${page}&limit=10`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setRows(data.data);
  //       setTotalPages(data.totalPages);
  //     });
  // }, [page]);

  const openSendModal = (row: DashboardRow) => {
    setOpen(true);
  };

  return (
    <main className="flex flex-col items-center   min-h-screen bg-gray-50 p-6">
      <div className="flex justify-center items-center">
        <img src="/logo.png" className="w-30"></img>
      <h1 className="text-3xl font-bold m-6 text-black" >SP Automation and software enginer</h1>
      </div>
      
      <div className="max-w-5xl mx-auto space-y-6">
        

        <div className="grid gap-4">
          {data.map((row) => (
            <OTCard key={row.OTD} row={row} />
          ))}
        </div>
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
      </div>
      <div>
        <button
          className="text-black mask-radial-at-bottom bg-green-500 mt-5 p-2 rounded-lg"
          onClick={() => setOpen(true)}
        >
          Send New Email
        </button>
      </div>

      {open && <SendEmailModal onClose={() => setOpen(false)} />}
    </main>
  );
}
