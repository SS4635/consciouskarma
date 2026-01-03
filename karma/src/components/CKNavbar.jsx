import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export default function CKNavbar({
  menuOpen,
  setMenuOpen,
  setShowSignup,
  hideDrawer = false,
}) {
  const intl = useIntl();

  return (
    <>
      {/* INTERNAL STYLES */}
      <style>{`
        /* HEADER STYLES */
        .ck-header-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #000;
          z-index: 2001;
          display: flex;
          align-items: center;
        }

        .ck-header-inner {
          width: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ck-header-logo {
          height: 56px;
          width: auto;
          object-fit: contain;
        }

        /* HAMBURGER */
        .ck-hamburger {
          width: 40px;
          height: 32px;
          padding: 4px;
          border-radius: 10px;
          border: none;
          background: transparent;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          margin-top: 14px;
        }

        .ck-hamburger span {
          width: 100%;
          height: 2px;
          background: #d1d5db;
          border-radius: 999px;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .ck-hamburger-open span:nth-child(1) {
          transform: translateY(10px) rotate(45deg);
        }
        .ck-hamburger-open span:nth-child(2) {
          opacity: 0;
        }
        .ck-hamburger-open span:nth-child(3) {
          transform: translateY(-10px) rotate(-45deg);
        }

        .menu-link {
          text-decoration: none;
          padding: 12px;
          border: 1px solid #3a3a3a;
          border-radius: 12px;
          background: #141414;
          color: #f9fafb;
          font-family: Balgin, sans-serif;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .menu-link:hover {
          background: #191919;
          border-color: #555;
        }
      `}</style>

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

      {/* BACKDROP */}
      {menuOpen && !hideDrawer && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px] z-20"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* DRAWER */}
      {!hideDrawer && (
        <nav
          className={`ck-navbar-drawer fixed top-0 right-0 h-full w-[min(340px,92vw)]
          bg-[#0f0f0f] border-l border-[#333]
          shadow-[0_20px_60px_rgba(0,0,0,0.5)]
          z-[30] flex flex-col gap-[10px] p-[22px_20px]
          transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="font-balgin font-bold text-white mb-3">
            <FormattedMessage id="menu.title" />
          </div>

          <a
            href="/"
            className="menu-link"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>

          <a
            href="/personalised-report"
            className="menu-link"
            onClick={() => setMenuOpen(false)}
          >
            <FormattedMessage id="menu.personalisedReport" />
          </a>

          <a
            href="/consult"
            className="menu-link"
            onClick={() => setMenuOpen(false)}
          >
            <FormattedMessage id="menu.consult" />
          </a>

          <button
            className="menu-link text-left"
            onClick={() => {
              setMenuOpen(false);
              setShowSignup(true);
            }}
          >
            Signup / Login
          </button>
        </nav>
      )}
    </>
  );
}
