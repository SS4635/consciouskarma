// // src/Blog1.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { FormattedMessage, useIntl } from "react-intl";
// import CKNavbar from "./components/CKNavbar";
// import SignupModal from "./SignupModal";
// import LoginModal from "./LoginModal";

// /* ================= API BASE ================= */
// const API_BASE_URL = "http://localhost:4000"; // Production me ise live URL se badal dena

// export default function Blog1() {
//   const intl = useIntl();

//   // --- States ---
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [menuOpen, setMenuOpen] = useState(false);
  
//   // Modals handle karne ke liye states
//   const [showSignup, setShowSignup] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);

//   // --- Fetch Blogs ---
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE_URL}/api/blogs`);
//         if (data.ok) setBlogs(data.data);
//       } catch (err) {
//         console.error("Error fetching blogs:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBlogs();
//   }, []);

//   // Modal close hone par scroll lock hatane ke liye (Agar landing page wala logic chahiye)
//   useEffect(() => {
//     if (showSignup || showLogin || menuOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   }, [showSignup, showLogin, menuOpen]);

//   return (
//     <div className="min-h-screen flex flex-col bg-black text-white font-arsenal overflow-x-hidden">
      
//       {/* NAVBAR */}
//       <div className="fixed top-0 left-0 w-full z-50">
//         <CKNavbar 
//           menuOpen={menuOpen} 
//           setMenuOpen={setMenuOpen} 
//           setShowSignup={setShowSignup} 
//         />
//       </div>

//       {/* Hero Overlay if menu is open */}
//       {menuOpen && (
//         <div 
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
//           onClick={() => setMenuOpen(false)} 
//         />
//       )}

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
//         <h1 className="font-balgin text-center text-[#ff914d] text-4xl md:text-5xl font-bold mb-16 uppercase tracking-wider">
//           BLOGS
//         </h1>

//         {loading ? (
//           <div className="text-center text-[#ff914d] py-20 text-xl animate-pulse">
//             Loading amazing articles...
//           </div>
//         ) : blogs.length === 0 ? (
//           <div className="text-center text-gray-500 py-20 text-lg italic">
//             No blogs published yet. Check back later!
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//             {blogs.map((blog) => (
//               <div 
//                 key={blog._id} 
//                 className="group relative bg-[#111] border border-[#333] rounded-2xl overflow-hidden hover:border-[#ff914d] transition-all duration-300 flex flex-col"
//               >
//                 {/* Blog Image */}
//                 <div className="aspect-[16/9] overflow-hidden">
//                   <img 
//                     src={`${API_BASE_URL}${blog.imageUrl}`} 
//                     alt={blog.title} 
//                     className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500" 
//                   />
//                 </div>

//                 {/* Blog Text Content */}
//                 <div className="p-6 flex flex-col flex-1">
//                   <p className="text-gray-500 text-xs mb-3 font-bold uppercase tracking-widest">
//                     {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
//                   </p>
//                   <h3 className="text-2xl font-semibold mb-6 text-white group-hover:text-[#ff914d] transition-colors leading-tight">
//                     {blog.title}
//                   </h3>
                  
//                   <div className="mt-auto">
//                     <Link 
//                       to={`/blog/${blog.slug}`} 
//                       className="inline-block bg-[#ff914d] text-black px-8 py-2.5 rounded-lg font-balgin font-bold text-sm tracking-wide hover:bg-white transition-colors no-underline"
//                     >
//                       <FormattedMessage id="blogs.readMore" defaultMessage="READ MORE" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* GLOBAL FOOTER (Exactly like Landing Page) */}
//       <footer className="w-full bg-black text-white border-t-2 border-[#ff914d] py-4 mt-auto">
//         <div className="container mx-auto flex flex-col items-center justify-center text-center gap-6">
//           <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-6">
//             <a href="/termsandconditions" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
//               <FormattedMessage id="footer.termsConditions" />
//             </a>
//             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />

//             <a href="/privacy-policy" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
//               <FormattedMessage id="footer.privacyPolicy" />
//             </a>
//             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />

//             <a href="/refund-policy" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
//               <FormattedMessage id="footer.refundPolicy" />
//             </a>
//             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />

//             <a href="/shipping-policy" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
//               <FormattedMessage id="footer.shippingDelivery" />
//             </a>
//             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />

//             <a href="/contact-us" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
//               <FormattedMessage id="footer.contactUs" />
//             </a>
//           </div>
          
//         </div>
//       </footer>

//       {/* SIGNUP / LOGIN MODALS (Triggered from Navbar) */}
//       {(showSignup || showLogin) && (
//         <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
//           {showSignup && (
//             <SignupModal
//               onClose={() => setShowSignup(false)}
//               onSwitch={() => {
//                 setShowSignup(false);
//                 setShowLogin(true);
//               }}
//             />
//           )}

//           {showLogin && (
//             <LoginModal
//               onClose={() => setShowLogin(false)}
//               onSwitch={() => {
//                 setShowLogin(false);
//                 setShowSignup(true);
//               }}
//             />
//           )}
//         </div>
//       )}

//     </div>
//   );
// }

// src/Blog1.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CKNavbar from "./components/CKNavbar";
import { FormattedMessage, useIntl } from "react-intl";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

export default function Blog1() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/blogs`);
        if (data.ok) setBlogs(data.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // 📝 HTML se saaf text nikalne ke liye
  const getExcerpt = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || "";
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-arsenal overflow-x-hidden">
      
      <div className="fixed top-0 left-0 w-full z-50">
        <CKNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setShowSignup={setShowSignup} />
      </div>

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <h1 className="font-balgin text-center text-[#ff914d] text-4xl md:text-5xl font-bold mb-16 uppercase tracking-wider">
          BLOGS
        </h1>

        {loading ? (
          <div className="text-center text-[#ff914d] py-20 text-xl animate-pulse">Loading amazing stories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <div key={blog._id} className="blog-card-container">
                
                {/* 🖼️ Image Section - Borders Removed */}
                <div className="blog-card-image-box">
                  <img 
                    src={`${API_BASE_URL}${blog.imageUrl}`} 
                    alt={blog.title} 
                    className="blog-card-img" 
                  />
                </div>

                {/* 📝 Content Section */}
                <div className="blog-card-content">
                  <h3 className="blog-card-title">{blog.title}</h3>

                  <p className="blog-card-excerpt">
                    {getExcerpt(blog.content)}
                  </p>
                  
                  <Link to={`/blog/${blog.slug}`} className="blog-card-readmore">
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

<footer className="w-full bg-black text-white border-t-2 border-[#ff914d] py-4 mt-auto">
         <div className="container mx-auto flex flex-col items-center justify-center text-center gap-6">
           <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-6">
             <a href="/termsandconditions" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
               <FormattedMessage id="footer.termsConditions" />
             </a>
             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />
             <a href="/privacy-policy" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
               <FormattedMessage id="footer.privacyPolicy" />
             </a>
             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />
             <a href="/refund-policy" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
               <FormattedMessage id="footer.refundPolicy" />
             </a>
             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />

             <a href="/shipping-policy" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
               <FormattedMessage id="footer.shippingDelivery" />
             </a>
             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />

             <a href="/contact-us" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors">
               <FormattedMessage id="footer.contactUs" />
             </a>
           </div>
          
         </div>
       </footer>


      {/* MODALS */}
      {(showSignup || showLogin) && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSwitch={() => { setShowSignup(false); setShowLogin(true); }} />}
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitch={() => { setShowLogin(false); setShowSignup(true); }} />}
        </div>
      )}

      {/* 🔥 CUSTOM CSS FOR CLEAN DESIGN 🔥 */}
      <style>{`
        .blog-card-container {
          background: #000;
          border: 1.5px solid #ff914d;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .blog-card-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 145, 77, 0.2);
        }

        .blog-card-image-box {
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: #000; /* Taaki lines na dikhein */
          border: none !important; /* Forcefully removing borders */
        }

        .blog-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block; /* Essential to remove gap at bottom of image */
          border: none !important;
          outline: none !important;
        }

        .blog-card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .blog-card-title {
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          line-height: 1.3;
          font-family: 'Balgin', sans-serif;
        }

        .blog-card-excerpt {
          color: #ccc;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 24px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: 300;
        }

        .blog-card-readmore {
          color: #ff914d;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          margin-top: auto;
          transition: color 0.2s;
        }

        .blog-card-readmore:hover {
          color: #ffb07c;
        }
      `}</style>
    </div>
  );
}