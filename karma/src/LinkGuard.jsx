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
    fetch(`${process.env.REACT_APP_API_URL}/api/link/check?key=${key}`)
      .then((res) => res.json())
      .then((data) => {
        setAllowed(data.valid === true);
      })
      .catch(() => {
        setAllowed(false);
      });
  }, [location.search]);

  // ⏳ while checking
  if (allowed === null) {
    return null;
  }

  // ❌ invalid
  if (allowed === false) {
    return <NotFound />;
  }

  // ✅ valid
  return children;
}

// Internal styles object to fix the 'styles is not defined' error
const styles = {
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "100px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "14px solid rgba(255, 255, 255, 0.1)",
    borderTop: "14px solid #FFA500", // Orange color
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};