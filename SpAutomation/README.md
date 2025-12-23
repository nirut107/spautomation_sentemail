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

```text
.
├── app/
│   ├── api/
│   │   ├── readPDF/            # Extract text from PDF
│   │   ├── user/               # Check / create / update users
│   │   └── send-email/         # Send email (thread-aware)
│   │
│   └── page.tsx                # Upload & document flow UI
│
├── components/
│   ├── AddUserModal.tsx        # Create new customer & emails
│   └── EmailSelectionModal.tsx # Select / add recipient emails
│
├── prisma/
│   └── schema.prisma           # Prisma database schema
│
├── public/
│   ├── logo.png                # Company logo (email CID)
│   └── bookbank.png            # Bank book image (payment reference)
│
└── README.md
```



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
```
---
## 🔐 Environment Variables

---
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sp.automationsoftware.co@gmail.com
SMTP_PASS=YOUR_GMAIL_APP_PASSWORD
```
---


## ▶️ Getting Started
### 1️⃣ Install dependencies
```bash 
npm install
```

## 2️⃣ Setup database
```bash
npx prisma migrate dev
npx prisma generate
```

## 3️⃣ Run development server
```bash
npm run dev
```

Open:
👉 http://localhost:3000

---

## 🔁 Email Thread Flow (Important)

```text
Send Quotation
→ Save Message-ID (QT)

Customer replies with PO

Reply to Quotation
→ Send Invoice
→ Use In-Reply-To + References
→ Save Message-ID (IN)

Reply again
→ Send Receipt
→ Same email thread
```

### This ensures:
```text

Gmail / Outlook keep the same conversation

Customers and accounting teams are not confused
```

## 🧠 Key Notes
```text

Email threading depends on:

Same sender

Same recipient

Same subject (with Re:)

Correct Message-ID headers

HTML email uses table-based layout (no flexbox)

React state is async – avoid using state immediately after setState
```

---
## 🚀 Future Improvements
```text

PDF preview before sending

Stepper UI (Upload → Review → Send)

Email history per customer

Payment status tracking

Dashboard & reports
```

## 👨‍💻 Author
```text
SP Automation and Software Engineer Co., Ltd.
📧 sp.automationsoftware.co@gmail.com

📞 097-453-5296
```