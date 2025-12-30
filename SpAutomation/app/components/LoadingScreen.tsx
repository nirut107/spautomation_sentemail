"use client";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="SP Automation"
        className="w-20 h-20 animate-spin-slow"
      />

      {/* Text */}
      <p className="mt-6 text-sm text-gray-500">Processing, please wait…</p>
    </div>
  );
}
