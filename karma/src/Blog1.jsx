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
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // 🔥 FILTER & PAGINATION STATES
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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

  // 🔥 SEO INJECTION
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
    setCurrentPage(1);
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

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1500px] w-full mx-auto">
        <h1 className="font-balgin text-center text-[#ff914d] text-4xl md:text-5xl font-bold mb-10 lg:mb-12 uppercase tracking-wider">
          BLOGS
        </h1>

        {/* 📱 MOBILE VIEW: ALL PILLS VISIBLE */}
        <div className="block lg:hidden mb-8">
          <div className="flex flex-wrap gap-2 pb-2">
            <button
              onClick={() => { setSelectedCategories([]); setCurrentPage(1); }}
              className={`whitespace-nowrap px-4 py-2 rounded-full transition-all text-sm ${
                selectedCategories.length === 0 
                ? "bg-[#ff914d] text-black font-bold border-none" 
                : "bg-[#111] text-gray-400 hover:text-white border border-[#333]"
              }`}
            >
              All Posts
            </button>

            {dbCategories.map(cat => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-full transition-all text-sm ${
                  selectedCategories.includes(cat.name) 
                  ? "bg-[#ff914d] text-black font-bold border-none" 
                  : "bg-[#111] text-gray-400 hover:text-white border border-[#333]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-[#ff914d] py-20 text-xl animate-pulse">Loading amazing stories...</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* 💻 DESKTOP VIEW: NOTION.COM STYLE CLEAN SIDEBAR */}
            <aside className="hidden lg:block w-[240px] flex-shrink-0 relative">
              <div className="sticky top-32">
                <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-widest pl-3">Categories</h3>
                
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => { setSelectedCategories([]); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-[15px] ${
                      selectedCategories.length === 0 
                      ? "bg-[#1f1f1f] text-[#ff914d] font-semibold" 
                      : "text-gray-400 hover:bg-[#111] hover:text-white"
                    }`}
                  >
                    All Posts
                  </button>
                  
                  {dbCategories.map(cat => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-[15px] ${
                        selectedCategories.includes(cat.name) 
                        ? "bg-[#1f1f1f] text-[#ff914d] font-semibold" 
                        : "text-gray-400 hover:bg-[#111] hover:text-white"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                  
                  {dbCategories.length === 0 && <p className="text-gray-500 text-sm pl-3">No categories</p>}
                </div>
              </div>
            </aside>

            {/* 👉 RIGHT AREA: 3x3 GRID */}
            <div className="w-full flex-1 flex flex-col lg:pl-6">
              {currentBlogs.length === 0 ? (
                <div className="text-center py-20 italic text-gray-500">No blogs found for selected filters.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentBlogs.map((blog) => (
                      <div key={blog._id} className="blog-card-container group">
                        <div className="blog-card-image-box">
                          <img src={`${API_BASE_URL}${blog.imageUrl}`} alt={blog.title} className="blog-card-img" />
                        </div>
                        <div className="blog-card-content">
                          <p className="text-[#ff914d] text-[10px] font-bold uppercase tracking-widest mb-3">
                            {blog.category || "Uncategorized"}
                          </p>
                          <h3 className="blog-card-title">{blog.title}</h3>
                          <p className="blog-card-excerpt">{getExcerpt(blog.content)}</p>
                          <Link to={`/blog/${blog.slug}`} className="blog-card-readmore mt-auto group-hover:text-white transition-colors">
                            Read article →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 🔢 CLEAN PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#222]">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold flex items-center gap-2"
                      >
                        ← Previous
                      </button>
                      
                      <div className="hidden sm:flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                          <button 
                            key={i} 
                            onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${currentPage === i + 1 ? "bg-[#ff914d] text-black" : "text-gray-400 hover:bg-[#222] hover:text-white"}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold flex items-center gap-2"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 🦶 EXACT FOOTER FROM CONSCIOUS KARMA */}
      <footer className="mt-auto w-screen relative left-1/2 -translate-x-1/2 bg-black text-white border-t-2 border-[#ff914d] py-3 sm:py-2 md:py-3" >
        <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
            <a href="/termsandconditions" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">
              <FormattedMessage id="footer.termsConditions" />
            </a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />

            <a href="/privacy-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">
              <FormattedMessage id="footer.privacyPolicy" />
            </a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />

            <a href="/refund-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">
              <FormattedMessage id="footer.refundPolicy" />
            </a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />

            <a href="/shipping-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">
              <FormattedMessage id="footer.shippingDelivery" />
            </a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />

            <a href="/contact-us" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">
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

      <style>{`
        /* Minimalist Blog Cards */
        .blog-card-container {
          background: transparent;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease;
          height: 100%;
        }
        .blog-card-container:hover .blog-card-img {
          transform: scale(1.03);
        }
        
        .blog-card-image-box { width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 8px; margin-bottom: 16px; }
        .blog-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
        
        .blog-card-content { display: flex; flex-direction: column; flex-grow: 1; }
        .blog-card-title { color: #fff; font-size: 20px; font-weight: 700; margin-bottom: 8px; font-family: 'Inter', sans-serif; line-height: 1.3; }
        .blog-card-excerpt { color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-weight: 400; }
        .blog-card-readmore { color: #ff914d; text-decoration: none; font-size: 14px; margin-top: auto; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
      `}</style>
    </div>
  );
}