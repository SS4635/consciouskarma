import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-[#f59255] mb-4">Error 404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <a
        href="/"
        className="text-[#f59255] hover:opacity-80 underline"
      >
        Go back
      </a>
    </div>
  );
}
