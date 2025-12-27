import { StepBar } from "./StepBar";
import { use, useState } from "react";
import { EmailThreadModal } from "./EmailThreadModal";

interface Props {
  row: {
    company: string;
    OTD: string;
    MID: string;
    IID: string | null;
    RID: string | null;
  };
}

export function OTCard({ row }: Props) {
  const [openThread, setOpenThread] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async (MID: string, company: string) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/google/getthread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ MID }),
      });

      const data = await res.json();

      if (data.needAuth) {
        window.location.href = data.authUrl;
        return;
      }
      console.log(data)

      setMessages(data.messages);
      setCompany(company);
      setOpenThread(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => handleClick(row.MID, row.company)}
        className={`
      group flex justify-between items-center
      cursor-pointer bg-white rounded-xl shadow-sm
      p-4 text-black border transition-all
      ${loading ? "opacity-60 pointer-events-none" : ""}
      hover:shadow-lg hover:-translate-y-0.5
      hover:border-blue-300 hover:bg-blue-50/40
    `}
      >
        <div className="flex items-center mr-16">
          <div>
            <h2 className="font-semibold text-lg group-hover:text-blue-700">
              {row.company}
            </h2>
            <p className="text-sm text-gray-500">{row.OTD}</p>
          </div>
        </div>

        <StepBar OTD={row.OTD} IID={row.IID} RID={row.RID} />
      </div>

      {/* 🔄 Loading overlay */}
      {loading && (
        <div
          className="
      absolute inset-0
      flex items-center justify-center
      bg-white/80 rounded-xl
    "
        >
          <div className="flex items-center gap-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-75"
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
            <span className="text-sm font-medium">Loading email thread…</span>
          </div>
        </div>
      )}
      {openThread &&(
        <EmailThreadModal
          open={openThread}
          onClose={() => setOpenThread(false)}
          messages={messages}
          company={company}
        />
      )}
    </div>
  );
}
