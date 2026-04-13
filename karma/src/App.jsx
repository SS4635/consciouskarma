// // src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./App.css";

// // Import pages
// import Landing from "./landingPage.jsx";
// import PersonalisedReport from "./PersonalisedReport.jsx";
// import Plans from "./plans.jsx";
// import Consult from "./Consult.jsx";
// import TermsAndConditions from "./TermsAndConditions.jsx";
// import PrivacyPolicy from "./PrivacyPolicy.jsx";
// import RefundPolicy from "./RefundPolicy.jsx";
// import ShippingPolicy from "./ShippingPolicy.jsx";
// import ContactUs from "./ContactUs.jsx";
// import Blog from "./Blog.jsx";
// import HowToReadMobileNumberBlog from "./HowToReadMobileNumberBlog.jsx";
// import HowToChooseMobileNumberBlog from "./HowToChooseMobileNumberBlog.jsx";
// import LinkGuard from "./LinkGuard.jsx";
// import LinkPage from "./LinkPage.jsx";
// import NotFound from "./NotFound.jsx";

// // ✅ Import your translations
// import { IntlProvider } from "./i18n/IntlProvider.jsx"; 
// import DashboardLayout from "./DashboardLayout.jsx";
// import SignupModal from "./SignupModal.jsx";
// import LoginModal from "./LoginModal.jsx";
// import AdminDashboardLayout from "./AdminDashboardLayout.jsx";
// import Blog1 from "./Blog1.jsx";
// import SingleBlog from "./SingleBlog.jsx";

// export default function App() {
//   return (
//     <IntlProvider>
      
//       {/* CSS For Background and Animations */}
//       <style>{`
//         html, body, #root { 
//           background-color: #0b0b0b !important; 
//           margin: 0;
//           padding: 0;
//           min-height: 100vh;
//           width: 100%;
//         }

//         /* Makes sections transparent so stars show through */
//         .bg-black, section, footer, #root > div:not(.stars-container) { 
//           background-color: transparent !important; 
//         }

//         .stars-container {
//           position: fixed;
//           top: -5%;
//           left: -5%;
//           width: 110vw;
//           height: 110vh;
//           z-index: 0;
//           pointer-events: none;
//           background-color: #0b0b0b;
//           overflow: hidden;
//         }

//         .content-wrapper {
//           position: relative;
//           z-index: 1; /* Sits on top of stars */
//         }

//         .star {
//           position: absolute;
//           background: white;
//           border-radius: 50%;
//           box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
//           animation: 
//             twinkle var(--duration) infinite ease-in-out,
//             drift var(--move-duration) infinite linear;
//         }

//         @keyframes twinkle {
//           0%, 100% { opacity: 0.3; transform: scale(1); }
//           50% { opacity: 0.9; transform: scale(1.3); }
//         }
// @keyframes drift {
//           0% { transform: translate(0, 0); }
//           100% { transform: translate(200px, -200px); } 
//         }
//       `}</style>

//       {/* 1. Background Layer (Stars) */}
//       <div className="stars-container">
//         {/* Changed Array size from 130 to 33 (approx 25%) */}
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="star"
//             style={{
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               width: `${1 + Math.random() * 2}px`,
//               height: `${1 + Math.random() * 2}px`,
//               "--duration": `${2.5 + Math.random() * 3}s`,
//               "--move-duration": `${18 + Math.random() * 15}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* 2. Content Layer (Routes) */}
//       <div className="content-wrapper">
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Landing />} />
//             <Route path="/signup" element={<SignupModal />} />
//             <Route
//               path="/link"
//               element={
//                 <LinkGuard>
//                   <LinkPage />
//                 </LinkGuard>
//               }
//             />
//             <Route path="/404" element={<NotFound />} />
//             <Route path="*" element={<NotFound />} />

//             <Route path="/login" element={<LoginModal />} />

//             <Route path="/personalized-report" element={<PersonalisedReport />} />
//             <Route path="/plans" element={<Plans />} />
//             <Route path="/consult" element={<Consult />} />
//             <Route path="/termsandconditions" element={<TermsAndConditions />} />
//             <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//             <Route path="/refund-policy" element={<RefundPolicy />} />
//             <Route path="/shipping-policy" element={<ShippingPolicy />} />
//             <Route path="/contact-us" element={<ContactUs />} />
//             <Route path="/admin-dashboard" element={<AdminDashboardLayout />} />
//             <Route path="/blogspage" element={<Blog1 />} /> 
//             <Route path="/blog/:slug" element={<SingleBlog />} />
//             <Route path="/blogs" element={<Blog />} />
//             <Route
//               path="/blog/how-to-read-mobile-number"
//               element={<HowToReadMobileNumberBlog />}
//             />
//             <Route
//               path="/blog/how-to-choose-mobile-number"
//               element={<HowToChooseMobileNumberBlog />}
//             />
//             <Route path="/dashboard" element={<DashboardLayout />} />
//           </Routes>
//         </BrowserRouter>
//       </div>
//     </IntlProvider>
//   );
// }


// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Import pages
import Landing from "./landingPage.jsx";
import PersonalisedReport from "./PersonalisedReport.jsx";
import Plans from "./plans.jsx";
import Consult from "./Consult.jsx";
import TermsAndConditions from "./TermsAndConditions.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import RefundPolicy from "./RefundPolicy.jsx";
import ShippingPolicy from "./ShippingPolicy.jsx";
import ContactUs from "./ContactUs.jsx";
import Blog from "./Blog.jsx";
import HowToReadMobileNumberBlog from "./HowToReadMobileNumberBlog.jsx";
import HowToChooseMobileNumberBlog from "./HowToChooseMobileNumberBlog.jsx";
import LinkGuard from "./LinkGuard.jsx";
import LinkPage from "./LinkPage.jsx";
import NotFound from "./NotFound.jsx";

// ✅ Import your translations
import { IntlProvider } from "./i18n/IntlProvider.jsx";
import DashboardLayout from "./DashboardLayout.jsx";
import SignupModal from "./SignupModal.jsx";
import LoginModal from "./LoginModal.jsx";
import AdminDashboardLayout from "./AdminDashboardLayout.jsx";
import Blog1 from "./Blog1.jsx";
import SingleBlog from "./SingleBlog.jsx";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-4EKZQNSGK0", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

export default function App() {
  return (
    <IntlProvider>
      {/* CSS For Background and Animations */}
      <style>{`
        html, body, #root { 
          background-color: #0b0b0b !important; 
          margin: 0;
          padding: 0;
          min-height: 100vh;
          width: 100%;
        }

        /* Makes sections transparent so stars show through */
        .bg-black, section, footer, #root > div:not(.stars-container) { 
          background-color: transparent !important; 
        }

        .stars-container {
          position: fixed;
          top: -5%;
          left: -5%;
          width: 110vw;
          height: 110vh;
          z-index: 0;
          pointer-events: none;
          background-color: #0b0b0b;
          overflow: hidden;
        }

        .content-wrapper {
          position: relative;
          z-index: 1; /* Sits on top of stars */
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
          animation: 
            twinkle var(--duration) infinite ease-in-out,
            drift var(--move-duration) infinite linear;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }

        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(200px, -200px); } 
        }
      `}</style>

      {/* 1. Background Layer (Stars) */}
      <div className="stars-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              "--duration": `${2.5 + Math.random() * 3}s`,
              "--move-duration": `${18 + Math.random() * 15}s`,
            }}
          />
        ))}
      </div>

      {/* 2. Content Layer (Routes) */}
      <div className="content-wrapper">
        <BrowserRouter>
          <AnalyticsTracker />

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignupModal />} />
            <Route
              path="/link"
              element={
                <LinkGuard>
                  <LinkPage />
                </LinkGuard>
              }
            />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />

            <Route path="/login" element={<LoginModal />} />

            <Route
              path="/personalized-report"
              element={<PersonalisedReport />}
            />
            <Route path="/plans" element={<Plans />} />
            <Route path="/consult" element={<Consult />} />
            <Route
              path="/termsandconditions"
              element={<TermsAndConditions />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route
              path="/admin-dashboard"
              element={<AdminDashboardLayout />}
            />
            <Route path="/blogspage" element={<Blog1 />} />
            <Route path="/blog/:slug" element={<SingleBlog />} />
            <Route path="/blogs" element={<Blog />} />
            <Route
              path="/blog/how-to-read-mobile-number"
              element={<HowToReadMobileNumberBlog />}
            />
            <Route
              path="/blog/how-to-choose-mobile-number"
              element={<HowToChooseMobileNumberBlog />}
            />
            <Route path="/dashboard" element={<DashboardLayout />} />
          </Routes>
        </BrowserRouter>
      </div>
    </IntlProvider>
  );
}