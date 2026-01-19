"use client";
import { useCallback, useState, useEffect } from "react";
import AddUserModal from "@/app/components/AddUserModal";
import EmailSelectionModal from "@/app/components/EmailSelectionModal";
import { getText } from "@/app/util/text_message";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockArrowUp,
  X,
  CheckCircle,
  Loader2,
  ScanLine,
  Mail,
  ArrowRight,
  Trash2,
} from "lucide-react";

interface SendEmailModalProps {
  onClose: () => void;
}

export default function SendEmailModal({ onClose }: SendEmailModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [modalOpenSent, setModalOpenSent] = useState(false);
  const [existingEmails, setExistingEmails] = useState<string[]>([]);
  const [docID, setDocID] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [orders, setOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreat] = useState(false);

  const router = useRouter();

  useEffect(() => {
    console.log(title, taxId, files, orders);
  }, [title]);
  const showEmailSelectionModal = (
    emails: string[],
    nameOCR: string,
    docId: string[]
  ) => {
    setExistingEmails(emails);
    setName(nameOCR);
    setDocID(docId);
    setModalOpenSent(true);
  };

  const openAddUserModal = (id: string, nameOCR: string) => {
    setTaxId(id);
    setName(nameOCR);
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
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ taxId, emails, name }),
      });
      closeModal();
      showEmailSelectionModal(emails, name, docID);
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
    form.append("name", name);
    form.append("taxId", taxId);

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
    onClose();
  };

  const handleSubmitEmailSelection = async (
    selected: string[],
    newEmails: string[]
  ) => {
    if (newEmails.length > 0) {
      try {
        await fetch("api/user/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            taxId,
            emails: newEmails,
            name,
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

    const resOCR = await fetch("/api/OCR", {
      method: "POST",
      body: form,
    });

    const dataOCR = await resOCR.json();
    const data = await res.json();
    const dataOCRLine = dataOCR.text.split("\n");

    const target: string = "CustomerNameIssueDateSalesman";
    const typeOfDac: string = "ใบเสนอราคา";
    const targetoder: string = "No.DescriptionQuantityUnitPriceAmount";
    let findOrder: boolean = false;
    let find: boolean = false;
    let tmpOrder: string[] = [];
    let tmpDoc: string[] = [];
    let foundTaxId: string = "";
    let nameOCR: string = dataOCRLine[1];
    setName(nameOCR);

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
    });
    if (tmpOrder.length > 0) {
      setOrder(tmpOrder);
    }
    setDocID(tmpDoc);
    try {
      const resuser = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ taxId: foundTaxId }),
      });
      const data = await resuser.json();
      console.log(data);

      if (!data.exists) {
        if (foundTaxId) openAddUserModal(foundTaxId, nameOCR);
      } else {
        setTaxId(data.taxId);
        showEmailSelectionModal(data.emails, data.name, tmpDoc);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-orange-500/30">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#0f1115]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-8 border-b border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <ScanLine className="w-6 h-6 text-blue-500" /> System_Scan.exe
              </h1>
              <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-widest">
                OCR Processing Unit | Active Level: 11.68
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Drop Zone */}
          <motion.div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("fileInput")?.click()}
            whileHover={{
              borderColor: "rgba(59, 130, 246, 0.5)",
              backgroundColor: "rgba(59, 130, 246, 0.05)",
            }}
            className="group relative w-full min-h-[200px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
          >
            <div className="p-4 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <ClockArrowUp className="w-10 h-10 text-blue-500" />
            </div>
            <p className="mt-4 text-white font-bold tracking-tight">
              Injection Protocol
            </p>
            <p className="text-sm text-gray-500 mt-1 font-mono">
              DRAG & DROP OR BROWSE SYSTEM
            </p>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              multiple
              onChange={handleBrowse}
            />
          </motion.div>

          {/* File Queue - Visualizing your Array State */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-2">
                  Data_Queue
                </h2>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                  {files.map((file, index) => (
                    <motion.div
                      layout
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:bg-white/[0.05] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            index === 0
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-white/5 text-gray-500"
                          }`}
                        >
                          {/* <FilePdf className="w-5 h-5" /> */}
                        </div>
                        <div className="max-w-[300px]">
                          <p className="text-sm font-bold text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            SIZE: {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
          >
            Abort
          </button>
          <button
            onClick={handleNext}
            disabled={files.length === 0 || loading}
            className={`
              relative overflow-hidden px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest
              flex items-center gap-3 transition-all transform active:scale-95
              ${
                loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]"
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing_Data
              </>
            ) : (
              <>
                Initialize_Scan <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Keeping your logical modals */}
        {modalOpen && (
          <AddUserModal
            taxId={taxId}
            name={name}
            DocId={docID}
            onClose={closeModal}
            onSubmit={handleCreateUser}
          />
        )}
        {modalOpenSent && (
          <EmailSelectionModal
            emails={existingEmails}
            name={name}
            onClose={closeModalSent}
            onSubmit={handleSubmitEmailSelection}
          />
        )}
      </motion.div>
    </div>
  );
}
