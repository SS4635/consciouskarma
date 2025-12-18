import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export default function MainNavbar({
  menuOpen,
  setMenuOpen,
  onAuthOpen,
}) {
  const intl = useIntl();

  return (
    <>
      {/* HEADER */}
      <header className="ck-header-bar pb-3 md:pt-1 md:pb-0">
        <div className="ck-header-inner">
          <a
            href="/"
            className="ck-header-logo-link"
            aria-label={intl.formatMessage({ id: "app.aria.home" })}
          >
            <img
              src="/Logomy-cropped.svg"
              alt={intl.formatMessage({ id: "app.title" })}
              className="ck-header-logo mt-4"
              draggable={false}
            />
          </a>

          <button
            className={
              "ck-hamburger" + (menuOpen ? " ck-hamburger-open" : "")
            }
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={intl.formatMessage({ id: "app.aria.toggleMenu" })}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* BLUR OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px] z-20"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* DRAWER */}
      <nav
        className={`fixed top-0 right-0 h-full w-[min(340px,92vw)]
        bg-[#0f0f0f] border-l border-[#333]
        shadow-[0_20px_60px_rgba(0,0,0,0.5)]
        z-[30] flex flex-col gap-[10px]
        p-[22px_20px]
        transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="font-balgin font-bold text-white mb-3">
          <FormattedMessage id="menu.title" />
        </div>

        <a
          href="/"
          className="no-underline p-3 border border-[#3a3a3a] rounded-[12px]
          bg-[#141414] hover:bg-[#191919] hover:border-[#555]
          transition text-gray-50 font-balgin font-bold"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </a>

        <a
          href="/personalised-report"
          className="no-underline p-3 border border-[#3a3a3a] rounded-[12px]
          bg-[#141414] hover:bg-[#191919] hover:border-[#555]
          transition text-gray-50 font-balgin font-bold"
          onClick={() => setMenuOpen(false)}
        >
          <FormattedMessage id="menu.personalisedReport" />
        </a>

        <a
          href="/consult"
          className="no-underline p-3 border border-[#3a3a3a] rounded-[12px]
          bg-[#141414] hover:bg-[#191919] hover:border-[#555]
          transition text-gray-50 font-balgin font-bold"
          onClick={() => setMenuOpen(false)}
        >
          <FormattedMessage id="menu.consult" />
        </a>

        <button
          className="text-left p-3 border border-[#3a3a3a] rounded-[12px]
          bg-[#141414] hover:bg-[#191919] hover:border-[#555]
          transition text-gray-50 font-balgin font-bold"
          onClick={() => {
            setMenuOpen(false);
            onAuthOpen();
          }}
        >
          Signup / Login
        </button>
      </nav>
    </>
  );
}
