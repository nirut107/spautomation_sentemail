import prisma from "@/lib/prisma";

async function cleanDB() {
  // if (process.env.NODE_ENV === "production") {
  //   throw new Error("❌ Refusing to clean database in production");
  // }

  console.log("🧹 Cleaning database...");

  await prisma.$transaction([
    prisma.quotation.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("✅ Database cleaned successfully");
}

cleanDB()
  .catch((err) => {
    console.error("❌ Failed to clean database:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
