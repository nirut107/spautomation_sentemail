# 📧 SP Automation – Document Email System

A business-grade web application for uploading PDF documents (Quotation / Invoice / Tax Invoice),
extracting customer data, managing recipient emails, and sending emails with proper email threading
(Quotation → PO → Invoice → Receipt).

Built with **Next.js + Prisma + Nodemailer**.

---

## ✨ Features

- 📄 Upload PDF (first file must be PDF, others optional)
- 🔍 Extract data from PDF
  - Document type (Quotation / Invoice / Receipt)
  - Document ID (QT-XXXXXXXXX, IN-XXXXXXXXX, RE-XXXXXXXXX)
  - Tax ID
  - Order list (with sub-orders)
- 👤 Customer management
  - Auto-check user by Tax ID
  - Create new user if not found
  - Multiple email addresses per customer
- 📧 Email sending
  - HTML email template (business style)
  - Attach PDF and other files
  - Embedded logo & bank book image (CID)
- 🔁 Email threading
  - Reply Quotation → Send Invoice in the same email thread
  - Uses Message-ID, In-Reply-To, References
- 🗂 Database tracking
  - Store Message-ID per document
  - Keep email history consistent

---

## 🧱 Tech Stack

- **Frontend**
  - Next.js (App Router)
  - React
  - Tailwind CSS

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - Nodemailer

- **Database**
  - PostgreSQL / MySQL / SQLite (via Prisma)

- **Email**
  - Gmail SMTP (App Password)
  - HTML Email (table-based, email-safe)

---

## 📁 Project Structure

.
├── app/
│ ├── api/
│ │ ├── readPDF/ # Extract text from PDF
│ │ ├── user/ # Check / create / update users
│ │ ├── send-email/ # Send email (thread-aware)
│ └── page.tsx # Upload & flow UI
│
├── components/
│ ├── AddUserModal.tsx
│ ├── EmailSelectionModal.tsx
│
├── prisma/
│ ├── schema.prisma
│
├── public/
│ ├── logo.png
│ ├── bookbank.png
│
├── README.md



---

## 🗄 Database Schema (Prisma)

```prisma
model User {
  id     Int      @id @default(autoincrement())
  taxId  String   @unique
  name   String
  emails String[]
}

model Quotation {
  id  Int    @id @default(autoincrement())
  QID String @unique
  MID String
}

model Invoice {
  id  Int    @id @default(autoincrement())
  IID String @unique
  MID String
}
