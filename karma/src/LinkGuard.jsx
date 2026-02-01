// src/LinkGuard.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NotFound from "./NotFound";

export default function LinkGuard({ children }) {
  const location = useLocation();
  const [allowed, setAllowed] = useState(null); // null | true | false

  useEffect(() => {
    // ❌ /link or /link?
    if (!location.search || location.search === "?") {
      setAllowed(false);
      return;
    }

    const key = location.search.slice(1); // abc

    if (!key) {
      setAllowed(false);
      return;
    }

    // ✅ backend simple check API
    fetch(
      `${process.env.REACT_APP_API_URL}/api/link/check?key=${key}`
    )
      .then(res => res.json())
      .then(data => {
        setAllowed(data.valid === true);
      })
      .catch(() => {
        setAllowed(false);
      });
  }, [location.search]);

  // ⏳ while checking
  if (allowed === null) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: 100 }}>
        Checking link…
      </div>
    );
  }

  // ❌ invalid
  if (allowed === false) {
    return <NotFound />;
  }

  // ✅ valid
  return children;
}
