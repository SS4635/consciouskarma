// src/Blog1.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CKNavbar from "./components/CKNavbar";
import { FormattedMessage } from "react-intl";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

export default function Blog1() {
  const [blogs, setBlogs] = useState([]);
  const [dbCategories, setDbCategories] = useState([]); // 🔥 Backend categories
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // 🔥 FILTER & PAGINATION STATES
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9; // 3x3 grid ke liye 9 best hai

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Dono APIs ek saath call ho rahi hain
        const [blogsRes, catsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/blogs`),
          axios.get(`${API_BASE_URL}/api/categories`)
        ]);
        
        if (blogsRes.data.ok) setBlogs(blogsRes.data.data);
        if (catsRes.data.ok) setDbCategories(catsRes.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔥 SEO INJECTION: Head mein keywords daalna (User ko nahi dikhega)
  useEffect(() => {
    if (blogs.length > 0) {
      const allKws = blogs.flatMap(b => b.keywords || []);
      const uniqueKws = [...new Set(allKws)].join(", ");
      
      let meta = document.querySelector('meta[name="keywords"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = "keywords";
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      meta.content = uniqueKws;
    }
  }, [blogs]);

  const getExcerpt = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || "";
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  };

  // 🔄 Filter Logic
  const handleCategoryChange = (catName) => {
    setSelectedCategories((prev) => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
    setCurrentPage(1); // Page reset on filter
  };

  // 📄 Pagination Logic
  const filteredBlogs = useMemo(() => {
    if (selectedCategories.length === 0) return blogs;
    return blogs.filter(b => selectedCategories.includes(b.category));
  }, [blogs, selectedCategories]);

  const currentBlogs = filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-arsenal overflow-x-hidden">
      
      <div className="fixed top-0 left-0 w-full z-50">
        <CKNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setShowSignup={setShowSignup} />
      </div>

      {/* Main Container Adjusted for Sidebar */}
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1500px] w-full mx-auto">
        <h1 className="font-balgin text-center text-[#ff914d] text-4xl md:text-5xl font-bold mb-16 uppercase tracking-wider">
          BLOGS
        </h1>

        {loading ? (
          <div className="text-center text-[#ff914d] py-20 text-xl animate-pulse">Loading amazing stories...</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* 👈 LEFT SIDEBAR: CATEGORIES */}
            <aside className="w-full lg:w-[280px] flex-shrink-0 relative">
              <div className="sticky top-32 bg-[#111] rounded-xl p-6 lg:border-r border-[#333] lg:rounded-r-none h-full min-h-[400px]">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-[#333] pb-2">Categories</h3>
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pt-2">
                  {dbCategories.map(cat => (
                    <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => handleCategoryChange(cat.name)}
                        className="ck-checkbox"
                      />
                      <span className={`text-[15px] transition-colors ${selectedCategories.includes(cat.name) ? "text-[#ff914d] font-bold" : "text-gray-300 group-hover:text-white"}`}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                  {dbCategories.length === 0 && <p className="text-gray-500 text-sm">No categories</p>}
                </div>
              </div>
            </aside>

            {/* 👉 RIGHT AREA: 3x3 GRID */}
            <div className="w-full flex-1 flex flex-col pl-0 lg:pl-6">
              {currentBlogs.length === 0 ? (
                <div className="text-center py-20 italic text-gray-500">No blogs found for selected filters.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentBlogs.map((blog) => (
                      <div key={blog._id} className="blog-card-container">
                        <div className="blog-card-image-box">
                          <img src={`${API_BASE_URL}${blog.imageUrl}`} alt={blog.title} className="blog-card-img" />
                        </div>
                        <div className="blog-card-content">
                          <p className="text-[#ff914d] text-[11px] font-bold uppercase tracking-widest mb-3">
                            {blog.category || "Uncategorized"}
                          </p>
                          <h3 className="blog-card-title">{blog.title}</h3>
                          <p className="blog-card-excerpt">{getExcerpt(blog.content)}</p>
                          <Link to={`/blog/${blog.slug}`} className="blog-card-readmore mt-auto">
                            Read more →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 🔢 PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-[#333]">
                      {[...Array(totalPages)].map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                          className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="w-full bg-black text-white border-t-2 border-[#ff914d] py-4 mt-auto">
         <div className="container mx-auto flex flex-col items-center justify-center text-center gap-6">
           <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-6">
             <a href="/termsandconditions" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors"><FormattedMessage id="footer.termsConditions" /></a>
             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />
             <a href="/privacy-policy" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors"><FormattedMessage id="footer.privacyPolicy" /></a>
             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />
             <a href="/refund-policy" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors"><FormattedMessage id="footer.refundPolicy" /></a>
             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />
             <a href="/shipping-policy" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors"><FormattedMessage id="footer.shippingDelivery" /></a>
             <div className="hidden sm:block w-[1px] h-[15px] bg-white opacity-50" />
             <a href="/contact-us" className="text-white font-bold text-xs sm:text-sm no-underline hover:text-[#ff914d] transition-colors"><FormattedMessage id="footer.contactUs" /></a>
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

      <style>{`
        .blog-card-container {
          background: #000;
          border: 1.5px solid #ff914d;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          height: 100%;
        }
        .blog-card-container:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(255, 145, 77, 0.2); }
        
        /* 🎨 Added Padding configuration to card images */
        .blog-card-image-box { width: 100%; height: 250px; overflow: hidden; border: none !important; padding: 14px; box-sizing: border-box; }
        .blog-card-img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 8px; border: none !important; }
        
        /* Balanced content padding to match the image spacing */
        .blog-card-content { padding: 0 24px 24px 24px; display: flex; flex-direction: column; flex-grow: 1; }
        .blog-card-title { color: #fff; font-size: 24px; font-weight: 700; margin-bottom: 12px; font-family: 'Balgin', sans-serif; }
        .blog-card-excerpt { color: #ccc; font-size: 15px; line-height: 1.6; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-weight: 300; }
        .blog-card-readmore { color: #ff914d; text-decoration: none; font-weight: 600; font-size: 16px; margin-top: auto; }
        
        .ck-checkbox { appearance: none; width: 20px; height: 20px; border: 2px solid #555; border-radius: 5px; cursor: pointer; position: relative; background: #222; vertical-align: middle; }
        .ck-checkbox:checked { background: #ff914d; border-color: #ff914d; }
        .ck-checkbox:checked::after { content: '✓'; position: absolute; color: black; font-size: 14px; font-weight: 900; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        
        .page-btn { background: #111; color: #fff; border: 1px solid #333; padding: 8px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .page-btn.active { background: #ff914d; color: #000; border-color: #ff914d; }
        .page-btn:hover:not(.active) { border-color: #ff914d; color: #ff914d; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
      `}</style>
    </div>
  );
}