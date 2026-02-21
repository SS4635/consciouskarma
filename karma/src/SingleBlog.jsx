// src/SingleBlog.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import CKNavbar from "./components/CKNavbar";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { FormattedMessage, useIntl } from "react-intl";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

export default function SingleBlog() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/blogs/${slug}`);
        if (data.ok) setBlog(data.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (showSignup || showLogin || menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showSignup, showLogin, menuOpen]);

  if (loading) {
    return (
      <div className="h-screen bg-black text-[#ff914d] flex items-center justify-center text-xl font-balgin animate-pulse">
        Loading amazing story...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center font-arsenal">
        <h2 className="text-2xl mb-4">Blog not found</h2>
        <Link to="/blogspage" className="text-[#ff914d] font-bold border-b border-[#ff914d] pb-1">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-arsenal overflow-x-hidden selection:bg-[#ff914d] selection:text-black">
      
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <CKNavbar 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
          setShowSignup={setShowSignup} 
        />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMenuOpen(false)} />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8 max-w-3xl mx-auto w-full">
        
        {/* Back Button */}
        <Link to="/blogspage" className="group text-[#ff914d] no-underline text-xs font-bold mb-12 inline-flex items-center hover:opacity-100 transition-all tracking-[0.2em] uppercase">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to all blogs
        </Link>

        {/* Title Section */}
        <header className="mb-12">
            <h1 className="text-4xl md:text-6xl text-[#ff914d] font-balgin font-bold mb-6 leading-[1.1] tracking-tight" style={{ wordBreak: 'break-word' }}>
            {blog.title}
            </h1>
            <div className="flex items-center gap-4">
                <div className="h-[1px] w-100 bg-[#ff914d]/40"></div>
            </div>
        </header>

        {/* COVER IMAGE */}
        {/* <div className="w-full bg-zinc-900 mb-16 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src={`${API_BASE_URL}${blog.imageUrl}`} 
            alt={blog.title} 
            className="w-full h-auto block object-cover max-h-[600px] hover:scale-[1.02] transition-transform duration-700" 
          />
        </div> */}

        {/* RICH CONTENT */}
        <div 
          className="blog-rich-content text-gray-300 leading-relaxed text-lg md:text-xl w-full"
          dangerouslySetInnerHTML={{ __html: blog.content }} 
        />
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSwitch={() => { setShowSignup(false); setShowLogin(true); }} />}
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitch={() => { setShowLogin(false); setShowSignup(true); }} />}
        </div>
      )}

      {/* 🔥 CSS FIXES FOR BACKEND CONTENT 🔥 */}
      <style>{`
        .blog-rich-content {
          font-family: 'Arsenal', sans-serif;
          width: 100%;
          overflow-wrap: break-word; 
          word-wrap: break-word;
          max-width: 100%;
        }
        
        /* CRITICAL FIX: Forces text to wrap and removes inline widths from backend */
        .blog-rich-content * {
          background-color: transparent !important;
          max-width: 100% !important;
          white-space: normal !important; 
          word-break: break-word !important; 
          box-sizing: border-box !important;
        }

        /* Heading Styles */
        .blog-rich-content h1, .blog-rich-content h2, .blog-rich-content h3 { 
          color: #ff914d !important; 
          margin: 60px 0 28px; 
          font-family: 'Balgin', sans-serif;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .blog-rich-content h2 { font-size: 1.8rem; }

        /* Text Clarity */
        .blog-rich-content p { 
          margin-bottom: 32px; 
          color: #d1d1d1; 
          line-height: 1.85;
        }

        .blog-rich-content strong, .blog-rich-content b {
          color: #fff !important;
          font-weight: 700;
        }

        /* Lists & Quotes */
        .blog-rich-content ul, .blog-rich-content ol {
          margin-bottom: 32px;
          padding-left: 20px;
          color: #d1d1d1;
        }
        
        .blog-rich-content li { 
          margin-bottom: 14px; 
        }

        .blog-rich-content blockquote {
          border-left: 3px solid #ff914d;
          padding: 10px 0 10px 30px;
          margin: 50px 0;
          font-style: italic;
          color: #fff;
          font-size: 1.4rem;
          line-height: 1.6;
          background: linear-gradient(90deg, rgba(255,145,77,0.05) 0%, transparent 100%) !important;
        }

        /* Images inside content */
        .blog-rich-content img {
          border-radius: 12px;
          margin: 40px 0;
          border: 1px solid rgba(255,255,255,0.1);
          height: auto !important; /* ensures image aspect ratio is maintained */
        }

        /* Responsive typography */
        @media (max-width: 768px) {
          .blog-rich-content h2 { font-size: 1.5rem; }
          .blog-rich-content { font-size: 1.1rem; }
          .blog-rich-content blockquote { font-size: 1.2rem; margin: 30px 0; }
        }
      `}</style>
    </div>
  );
}