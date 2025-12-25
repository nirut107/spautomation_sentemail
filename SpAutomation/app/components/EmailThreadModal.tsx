"use client";

import { EmailThread } from "./EmailThread";

interface Props {
  open: boolean;
  onClose: () => void;
  messages: any[];
  company: string;
}

export function EmailThreadModal({ open, onClose, messages, company }: Props) {
  //   if (!open) return null;

  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className=" cursor-pointer absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* modal */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[85vh]
    bg-white rounded-xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <p className="text-2xl text-black">{company}</p>
          </div>

          <button
            onClick={onClose}
            className="text-black cursor-pointer hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="flex-1 min-h-100 max-h-3/5 justify-center items-center w-full overflow-y-auto px-5 py-4 bg-gray-50">
          <EmailThread messages={messages} />
        </div>

        {/* footer */}
        <div className="px-5 py-3 border-t text-right">
          <button
            onClick={onClose}
            className="text-black px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
