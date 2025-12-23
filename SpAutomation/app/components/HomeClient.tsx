"use client";
import { useCallback, useState, useEffect } from "react";
import AddUserModal from "@/app/components/AddUserModal";
import EmailSelectionModal from "@/app/components/EmailSelectionModal";
import { getText } from "@/app/util/text_message";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [modalOpenSent, setModalOpenSent] = useState(false);
  const [existingEmails, setExistingEmails] = useState<string[]>([]);
  const [docID, setDocID] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [orders, setOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreat] = useState(false);

  useEffect(() => {
    console.log(title, taxId, files, orders);
  }, [title]);
  const showEmailSelectionModal = (emails: string[]) => {
    setExistingEmails(emails);
    setModalOpenSent(true);
  };

  const openAddUserModal = (id: string) => {
    setTaxId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setLoading(false);
    setModalOpen(false);
  };
  const closeModalSent = () => {
    setLoading(false);
    setModalOpenSent(false);
  };

  const handleCreateUser = async (emails: string[]) => {
    setCreat(true);
    try {
      await fetch("/api/user/create", {
        method: "POST",
        body: JSON.stringify({ taxId, emails }),
      });
      closeModal();
      showEmailSelectionModal(emails);
    } catch (err) {
      console.log(err);
      closeModal();
    } finally {
      setCreat(false);
    }
  };

  const sendEmail = async (selected: string[], newEmails: string[]) => {
    const allEmails = Array.from(new Set([...selected, ...newEmails]));

    if (allEmails.length === 0) {
      alert("No email selected");
      return;
    }
    let subject = "นำส่ง " + title;
    const htmlMessage = getText(title, orders);
    const form = new FormData();
    form.append("to", JSON.stringify(allEmails));
    form.append("subject", subject);
    form.append("message", htmlMessage);

    files.forEach((file: File) => {
      form.append("files", file);
    });
    docID.forEach((docID: string) => {
      form.append("DocID", docID);
    });
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send email");
        setLoading(false);
        setModalOpenSent(false);
        return;
      }
      alert("Email sent successfully!");
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
    setModalOpenSent(false);
    
  };

  const handleSubmitEmailSelection = async (
    selected: string[],
    newEmails: string[]
  ) => {
    if (newEmails.length > 0) {
      try {
        await fetch("api/user/update", {
          method: "PUT",
          body: JSON.stringify({
            taxId,
            emails: newEmails,
          }),
        });
      } catch (error) {
        console.log(error);
      }
    }
    await sendEmail(selected, newEmails);
  };

  const handleFiles = (uploaded: FileList | null) => {
    if (!uploaded) return;

    const newFiles = Array.from(uploaded);

    if (files.length === 0) {
      const first = newFiles[0];
      if (!first || first.type !== "application/pdf") {
        alert("The first file must be a PDF");
        return;
      }
      setFiles([first, ...newFiles.slice(1)]);
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  function extractTaxId(text: string) {
    const clean = text.replace(/\s+/g, "").normalize("NFC");

    const match = clean.match(/(\d-\d{4}-\d{5}-\d{2}-\d)/);

    if (!match) return null;

    const dashed = match[1];
    const normalized = dashed.replace(/-/g, "");

    return normalized;
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (files.length === 0 || loading) return;
    setLoading(true);

    const form = new FormData();
    form.append("file", files[0]);

    const res = await fetch("/api/readPDF", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    console.log(data.lines);

    const target: string = "CustomerNameIssueDateSalesman";
    const typeOfDac: string = "ใบเสนอราคา";
    const targetoder: string = "No.DescriptionQuantityUnitPriceAmount";
    let findOrder: boolean = false;
    let find: boolean = false;
    let tmp_text: string;
    let tmpOrder: string[] = [];
    let tmpDoc: string[] = [];
    let foundTaxId: string = "";

    data.lines.find((line: string) => {
      const clean = line.replace(/\s+/g, "");
      console.log(clean);
      if (find) {
        let Id = extractTaxId(clean);
        if (Id) {
          foundTaxId = Id;
          setTaxId(Id);
        }
      }
      if (clean.includes("รวมเป")) {
        findOrder = false;
      }
      if (findOrder) {
        if (Number(clean[0]) > 0) {
          console.log("Order", clean);
          let tmp = clean.split(",");
          tmpOrder.push(tmp[0].replace(/^\d+/, "").replace(/\d+$/, ""));
          console.log(tmpOrder);
        } else {
          let subOrder = clean.split("-");
          subOrder.forEach((sub) => {
            if (sub) tmpOrder.push("-" + sub);
          });
        }
      }
      if (clean.includes(target)) {
        find = true;
      }
      if (
        clean.startsWith(typeOfDac) ||
        clean == "Invoice" ||
        clean == "TaxInvoice/Receipt"
      ) {
        setTitle(clean);
      }
      if (clean.includes(targetoder)) {
        findOrder = true;
      }
      if (clean.includes("QT-")) {
        const match = clean.match(/QT-\d{9}/);
        if (match) tmpDoc.push(match.toString());
      }
      if (clean.includes("IN-")) {
        const match = clean.match(/IN-\d{9}/);
        if (match) tmpDoc.push(match.toString());
      }
      if (clean.includes("RE-")) {
        const match = clean.match(/RE-\d{9}/);
        if (match) tmpDoc.push(match.toString());
      }

      tmp_text = clean;
    });
    if (tmpOrder.length > 0) {
      setOrder(tmpOrder);
    }
    setDocID(tmpDoc);
    try {
      const resuser = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ taxId }),
      });
      const data = await resuser.json();
      console.log(data);

      if (!data.exists) {
        if (foundTaxId) openAddUserModal(foundTaxId);
      } else {
        setTaxId(data.taxId);
        console.log(data.taxId);
        showEmailSelectionModal(data.emails);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Upload Documents</h1>
          <p className="text-gray-500 mt-1">
            Upload quotation, invoice, or related files
          </p>
        </div>

        {/* Drop Zone */}
        <div
          className="
        w-full min-h-[220px]
        border-2 border-dashed border-gray-300
        rounded-xl bg-white
        flex flex-col items-center justify-center
        cursor-pointer
        transition
        hover:border-blue-500 hover:bg-blue-50
      "
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <p className="text-gray-600 font-medium">Drag & Drop files here</p>
          <p className="text-sm text-gray-400 mt-1">First file must be PDF</p>
        </div>

        <input
          id="fileInput"
          type="file"
          className="hidden"
          multiple
          onChange={handleBrowse}
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-semibold text-gray-700 mb-3">Files Selected</h2>

            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="
                flex items-center justify-between
                rounded-md px-3 py-2
                bg-gray-50
              "
                >
                  <span
                    className={`
                  truncate
                  ${
                    index === 0
                      ? "text-blue-700 font-semibold"
                      : "text-gray-700"
                  }
                `}
                  >
                    {index === 0 && (
                      <span className="mr-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        PDF
                      </span>
                    )}
                    {file.name}
                  </span>

                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={files.length === 0 || loading}
            className={`
      px-6 py-3 rounded-lg font-medium
      flex items-center gap-2
      ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }
      text-white transition
    `}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
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

            {loading ? "Processing..." : "Continue"}
          </button>
        </div>

        {/* Modals */}
        {modalOpen && (
          <AddUserModal
            taxId={taxId}
            onClose={closeModal}
            onSubmit={handleCreateUser}
          />
        )}

        {modalOpenSent && (
          <EmailSelectionModal
            emails={existingEmails}
            onClose={closeModalSent}
            onSubmit={handleSubmitEmailSelection}
          />
        )}
      </div>
    </main>
  );
}
