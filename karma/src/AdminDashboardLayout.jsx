import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { decryptEmail } from "./utils/emailCrypto";
import Swal from "sweetalert2";
import ReactQuill, { Quill } from "react-quill-new"; // Added Quill for registration
import "react-quill-new/dist/quill.snow.css"; 
import "./DashboardLayout.css"; 

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

// --- QUILL CUSTOMIZATION START ---
// 1. Custom Sizes register karein (Pixel based)
const FontSize = Quill.import("formats/size");
FontSize.whitelist = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"];
Quill.register(FontSize, true);

// 2. Toolbar Configuration
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ size: FontSize.whitelist }], // Custom Sizes
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }], // Font Color & Background Color
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"], // Format Reset (TX icon)
  ],
};

const formats = [
  "header", "size", "font", "bold", "italic", "underline", "strike",
  "color", "background", "script", "align", "list", "bullet", "link", "image", "video"
];
// --- QUILL CUSTOMIZATION END ---

export default function AdminDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const adminEmail = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const enc = params.get("u");
    return enc ? decryptEmail(decodeURIComponent(enc)) : "";
  }, [location.search]);

  useEffect(() => {
    if (!adminEmail) navigate("/");
  }, [adminEmail, navigate]);

  const [activeTab, setActiveTab] = useState("summary"); 
  const [loading, setLoading] = useState(false);

  // Summary State
  const [summaryRange, setSummaryRange] = useState("today"); 
  const [summaryData, setSummaryData] = useState({ instant: 0, personalised: 0, consult: 0, contact: 0, total: 0 });

  // Table States
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterDate, setFilterDate] = useState("all"); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔥 BLOG CMS STATES
  const [blogView, setBlogView] = useState("list"); 
  const [blogList, setBlogList] = useState([]); 
  const [editBlogId, setEditBlogId] = useState(null); 
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImageFile, setBlogImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(""); 

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Summary
  useEffect(() => {
    if (activeTab === "summary") {
      const fetchSummary = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/admin/summary`, {
            params: { email: adminEmail, range: summaryRange }
          });
          if (data.ok) setSummaryData(data.data);
        } catch (err) {} finally { setLoading(false); }
      };
      fetchSummary();
    }
  }, [activeTab, adminEmail, summaryRange]);

  // Fetch Data Tables
  useEffect(() => {
    const tableTabs = ["instant", "personalised", "consult", "contact"];
    if (tableTabs.includes(activeTab)) {
      if (filterDate === "custom" && (!startDate || !endDate)) return;
      const fetchData = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/admin/data`, {
            params: { email: adminEmail, type: activeTab, search: debouncedSearch, filterDate: filterDate, startDate: filterDate === "custom" ? startDate : undefined, endDate: filterDate === "custom" ? endDate : undefined, page: page, limit: 20 }
          });
          if (data.ok) { setTableData(data.data); setTotalPages(data.pagination.pages); }
        } catch (err) {} finally { setLoading(false); }
      };
      fetchData();
    }
  }, [activeTab, debouncedSearch, filterDate, startDate, endDate, page, adminEmail]);

  useEffect(() => {
    if (activeTab === "blog" && blogView === "list") {
      const fetchBlogs = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/admin/blogs`, {
            params: { email: adminEmail }
          });
          if (data.ok) setBlogList(data.data);
        } catch (err) {
          console.error("Failed to fetch blogs", err);
        } finally {
          setLoading(false);
        }
      };
      fetchBlogs();
    }
  }, [activeTab, blogView, adminEmail]);

  const handleEditBlog = (blog) => {
    setEditBlogId(blog._id);
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setExistingImageUrl(blog.imageUrl); 
    setBlogImageFile(null); 
    setBlogView("form");
  };

  const handleCreateNewBlog = () => {
    setEditBlogId(null);
    setBlogTitle("");
    setBlogContent("");
    setExistingImageUrl("");
    setBlogImageFile(null);
    setBlogView("form");
  };

  const handleBlogSubmit = async (status) => {
    if (!blogTitle || !blogContent || (!blogImageFile && !existingImageUrl)) {
      return Swal.fire("Error", "Title, Content and Image are required!", "error");
    }

    setLoading(true);
    try {
      let finalImageUrl = existingImageUrl;

      // 🔄 IMAGE CHANGE LOGIC: Agar naya file select kiya hai toh upload karo
      if (blogImageFile) {
        const formData = new FormData();
        formData.append("image", blogImageFile); 

        const uploadRes = await axios.post(`${API_BASE_URL}/api/admin/upload-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (!uploadRes.data.ok) throw new Error("Image upload failed");
        finalImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        email: adminEmail,
        title: blogTitle,
        content: blogContent,
        imageUrl: finalImageUrl, 
        status: status 
      };

      let blogRes = editBlogId 
        ? await axios.put(`${API_BASE_URL}/api/admin/blog/${editBlogId}`, payload)
        : await axios.post(`${API_BASE_URL}/api/admin/blog`, payload);

      if (blogRes.data.ok) {
        Swal.fire("Success", blogRes.data.message, "success");
        setBlogView("list");
      }
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        const { data } = await axios.delete(`${API_BASE_URL}/api/admin/blog/${id}`, {
          data: { email: adminEmail } 
        });
        if (data.ok) {
          Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
          setBlogList(prev => prev.filter(b => b._id !== id)); 
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  const handleLogout = () => navigate("/");
  const viewFullMessage = (name, message) => {
    Swal.fire({ title: `Message from ${name}`, text: message, icon: 'info', confirmButtonColor: '#ff914d' });
  };

  const darkCardStyle = { padding: "24px", background: "linear-gradient(145deg, #1a1a1a 0%, #111111 100%)", border: "1px solid #333", borderRadius: "16px", color: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" };
  const rangeBtnStyle = (range) => ({ padding: "8px 16px", background: summaryRange === range ? "#ff914d" : "transparent", color: summaryRange === range ? "#000" : "#888", border: `1px solid ${summaryRange === range ? "#ff914d" : "#444"}`, borderRadius: "20px", cursor: "pointer", fontWeight: summaryRange === range ? "bold" : "500", transition: "all 0.3s ease", fontSize: "13px" });

  return (
    <div className="ck-dashboard" style={{ background: "#000", minHeight: "100vh" }}>
      <header className="ck-navbar" style={{ background: "#111", borderBottom: "1px solid #333" }}>
        <div className="ck-navbar-brand">
          <span className="brand-text-top">conscious</span>
          <span className="brand-text-bottom" style={{color: "#ff914d"}}>KARMA (ADMIN)</span>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className="ck-sidebar" style={{ background: "#111", borderRight: "1px solid #333" }}>
          <nav className="ck-nav">
            {["summary", "instant", "personalised", "consult", "contact"].map((tab) => (
              <button 
                key={tab}
                className={`ck-nav-item ${activeTab === tab ? "ck-nav-item--active" : ""}`} 
                onClick={() => { setActiveTab(tab); setPage(1); }}
                style={{ textTransform: "capitalize", color: activeTab === tab ? "#ff914d" : "#aaa", background: activeTab === tab ? "rgba(255, 145, 77, 0.1)" : "transparent" }}
              >
                {tab === "summary" ? "📊 Dashboard Overview" : tab === "personalised" ? "Personalised Reports" : `${tab} Data`}
              </button>
            ))}
            <hr style={{ margin: "15px 0", borderColor: "#333" }} />
            <button 
              className={`ck-nav-item ${activeTab === "blog" ? "ck-nav-item--active" : ""}`} 
              onClick={() => { setActiveTab("blog"); setBlogView("list"); }}
              style={{ color: activeTab === "blog" ? "#ff914d" : "#aaa", background: activeTab === "blog" ? "rgba(255, 145, 77, 0.1)" : "transparent" }}
            >
              📝 Manage Blogs
            </button>
          </nav>
        </aside>

        <div className="ck-main" style={{ background: "#000" }}>
          <main className="ck-content">

            {activeTab === "summary" && (
              <section style={{ padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
                  <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "600", color: "#fff" }}>Business Overview</h2><p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "14px" }}>Monitor your overall interactions and reports.</p></div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                    {[{ id: "today", label: "Today" }, { id: "weekly", label: "7 Days" }, { id: "monthly", label: "30 Days" }, { id: "quarterly", label: "Quarterly" }, { id: "yearly", label: "Yearly" }, { id: "all", label: "All Time" }].map(r => (
                      <button key={r.id} style={rangeBtnStyle(r.id)} onClick={() => setSummaryRange(r.id)}>{r.label}</button>
                    ))}
                  </div>
                </div>

                {loading ? ( <div style={{ color: "#ff914d", fontSize: "18px", textAlign: "center", padding: "50px" }}>Loading metrics...</div> ) : (
                  <>
                    <div style={{ ...darkCardStyle, borderLeft: "6px solid #ff914d", marginBottom: "24px", flexDirection: "row", alignItems: "center" }}>
                      <div><h3 style={{ color: "#aaa", margin: 0, textTransform: "uppercase", letterSpacing: "1.5px", fontSize: "14px" }}>Total Interactions Volume</h3><p style={{ fontSize: "56px", fontWeight: "900", margin: "5px 0 0", color: "#fff" }}>{summaryData.total}</p></div>
                      <div style={{ height: "80px", width: "80px", borderRadius: "50%", background: "rgba(255, 145, 77, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff914d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
                      <div style={darkCardStyle} className="summary-card-hover"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ margin: 0, fontSize: "15px", color: "#aaa", fontWeight: "500" }}>Instant Reports</h3><span style={{ fontSize: "20px" }}>⚡</span></div><p style={{ fontSize: "40px", fontWeight: "bold", margin: "15px 0 0", color: "#ff914d" }}>{summaryData.instant}</p></div>
                      <div style={darkCardStyle} className="summary-card-hover"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ margin: 0, fontSize: "15px", color: "#aaa", fontWeight: "500" }}>Personalised</h3><span style={{ fontSize: "20px" }}>🎯</span></div><p style={{ fontSize: "40px", fontWeight: "bold", margin: "15px 0 0", color: "#ff914d" }}>{summaryData.personalised}</p></div>
                      <div style={darkCardStyle} className="summary-card-hover"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ margin: 0, fontSize: "15px", color: "#aaa", fontWeight: "500" }}>Consultations</h3><span style={{ fontSize: "20px" }}>🗓️</span></div><p style={{ fontSize: "40px", fontWeight: "bold", margin: "15px 0 0", color: "#ff914d" }}>{summaryData.consult}</p></div>
                      <div style={darkCardStyle} className="summary-card-hover"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ margin: 0, fontSize: "15px", color: "#aaa", fontWeight: "500" }}>Contacts</h3><span style={{ fontSize: "20px" }}>💬</span></div><p style={{ fontSize: "40px", fontWeight: "bold", margin: "15px 0 0", color: "#ff914d" }}>{summaryData.contact}</p></div>
                    </div>
                  </>
                )}
              </section>
            )}

            {["instant", "personalised", "consult", "contact"].includes(activeTab) && (
              <section className="ck-panel" style={{ background: "#111", border: "1px solid #333" }}>
                <h2 className="ck-panel-title" style={{ textTransform: "capitalize", color: "#fff" }}>{activeTab} Data</h2>
                <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                  <input type="text" placeholder="Search Name, Email, Phone..." className="ck-input" style={{ flex: 1, minWidth: "200px", background: "#222", color: "#fff", border: "1px solid #444" }} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} />
                  <select className="ck-input" style={{ width: "150px", background: "#222", color: "#fff", border: "1px solid #444" }} value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}>
                    <option value="all">All Time</option><option value="today">Today</option><option value="last7">Last 7 Days</option><option value="last30">Last 30 Days</option><option value="custom">Custom Range</option>
                  </select>
                </div>

                {loading ? <div className="ck-empty-state" style={{color: "#ff914d"}}>Loading records...</div> : tableData.length === 0 ? (
                  <div className="ck-empty-state" style={{color: "#888"}}>No records found.</div>
                ) : (
                  <>
                    <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px" }}>
                      <table className="ck-table" style={{ color: "#fff" }}>
                        <thead style={{ background: "#222" }}>
                          <tr>
                            <th>Date</th><th>Name</th><th>Email</th><th>Phone</th>
                            {activeTab === "consult" && <th>Plan Name</th>}
                            {activeTab === "consult" && <th>Price (₹)</th>}
                            {activeTab === "contact" && <th>Message</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((item) => {
                            const name = item.name || item.firstName || item.formData?.general?.name || "-";
                            const email = item.email || item.formData?.general?.email || "-";
                            const phone = item.phone || item.formData?.primary?.number || "-";
                            return (
                              <tr key={item._id} style={{ borderBottom: "1px solid #333" }}>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td><td>{name}</td><td>{email}</td><td>{phone}</td>
                                {activeTab === "consult" && <td>{item.planName || "-"}</td>}
                                {activeTab === "consult" && <td>{item.price ? `₹${item.price}` : "-"}</td>}
                                {activeTab === "contact" && (
                                  <td><button className="ck-btn-sm" style={{background: "#ff914d", border: "none", color: "black", fontWeight: "bold", cursor: "pointer"}} onClick={() => viewFullMessage(name, item.message)}>Read Message</button></td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* 🔥 MANAGE BLOGS (CMS) */}
            {activeTab === "blog" && (
              <section className="ck-panel" style={{ background: "#111", border: "1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 className="ck-panel-title" style={{color: "#fff", margin: 0}}>Manage Blogs</h2>
                  {blogView === "list" ? (
                    <button className="ck-btn-sm" style={{background: "#ff914d", color: "#000", fontWeight: "bold", border: "none"}} onClick={handleCreateNewBlog}>+ Create New Blog</button>
                  ) : (
                    <button className="ck-btn-sm" style={{background: "#333", color: "#fff", border: "1px solid #555"}} onClick={() => setBlogView("list")}>← Back to List</button>
                  )}
                </div>

                {blogView === "list" && (
                  loading ? <p style={{color: "#ff914d"}}>Loading blogs...</p> : blogList.length === 0 ? <p style={{color: "#888"}}>No blogs found. Create one!</p> : (
                    <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px" }}>
                      <table className="ck-table" style={{ color: "#fff" }}>
                        <thead style={{ background: "#222" }}>
                          <tr><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                          {blogList.map(blog => (
                            <tr key={blog._id} style={{ borderBottom: "1px solid #333" }}>
                              <td>{blog.title}</td>
                              <td><span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", background: blog.status === "published" ? "rgba(46, 204, 113, 0.2)" : "rgba(241, 196, 15, 0.2)", color: blog.status === "published" ? "#2ecc71" : "#f1c40f" }}>{blog.status.toUpperCase()}</span></td>
                              <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                              <td><div style={{display: "flex", gap: "10px"}}><button onClick={() => handleEditBlog(blog)} style={{background: "transparent", color: "#3498db", border: "none", cursor: "pointer"}}>Edit</button><button onClick={() => handleDeleteBlog(blog._id)} style={{background: "transparent", color: "#e74c3c", border: "none", cursor: "pointer"}}>Delete</button></div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {blogView === "form" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                    <div>
                      <label className="ck-label" style={{color: "#aaa"}}>Blog Title</label>
                      <input type="text" className="ck-input" style={{ background: "#222", color: "#fff", border: "1px solid #444" }} placeholder="Enter an SEO friendly title" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
                    </div>

                    <div>
                      <label className="ck-label" style={{color: "#aaa"}}>Featured Image</label>
                      {/* PREVIEW CURRENT IMAGE */}
                      {existingImageUrl && (
                        <div style={{ margin: "10px 0" }}>
                          <p style={{fontSize: "12px", color: "#ff914d"}}>Current Image Preview:</p>
                          <img src={existingImageUrl} alt="Current" style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "2px solid #333" }} />
                        </div>
                      )}
                      <input id="blogImageInput" type="file" accept="image/*" className="ck-input" style={{ padding: "10px", background: "#222", color: "#fff", border: "1px solid #444" }} onChange={(e) => setBlogImageFile(e.target.files[0])} />
                      <p style={{fontSize: "11px", color: "#888", marginTop: "5px"}}>* Select a new file to change the existing image.</p>
                    </div>

<div>
                      <label className="ck-label" style={{color: "#aaa"}}>Blog Content (Rich Text)</label>
                      {/* Wrapper background ko #000 (black) aur color ko #fff (white) kar diya hai */}
                      <div style={{ background: "#000", color: "#fff", minHeight: "400px", borderRadius: "8px", overflow: "hidden", marginTop: "10px" }}>
                        <ReactQuill 
                          theme="snow" 
                          value={blogContent} 
                          onChange={setBlogContent} 
                          modules={modules} 
                          formats={formats}
                          style={{ height: "350px" }} 
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "15px", marginTop: "40px" }}>
                      <button className="ck-btn" style={{ background: "#333", color: "#fff", border: "1px solid #555" }} onClick={() => handleBlogSubmit("draft")} disabled={loading}>{loading ? "Saving..." : "Save as Draft"}</button>
                      <button className="ck-btn" style={{ background: "#ff914d", color: "#000", fontWeight: "bold" }} onClick={() => handleBlogSubmit("published")} disabled={loading}>{loading ? "Publishing..." : "Publish Now"}</button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .summary-card-hover:hover { transform: translateY(-5px); border-color: #ff914d !important; box-shadow: 0 10px 30px rgba(255, 145, 77, 0.15) !important; }
        
        /* Quill Dropdown Fixes */
        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before { content: attr(data-value) !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label:not([data-value])::before { content: "16px" !important; }
        .ql-snow .ql-picker.ql-size { width: 90px !important; }
        
        .ql-toolbar.ql-snow { background: #f0f0f0; border-radius: 4px 4px 0 0; }
        .ql-container.ql-snow { border-radius: 0 0 4px 4px; }
        /* Quill Dropdown Fixes */
        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before { content: attr(data-value) !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label:not([data-value])::before { content: "16px" !important; }
        .ql-snow .ql-picker.ql-size { width: 90px !important; }
        
        /* 🔥 DARK THEME FOR QUILL EDITOR 🔥 */
        /* 1. Toolbar Styling */
        .ql-toolbar.ql-snow { 
          background-color: #111 !important; 
          border: 1px solid #fff !important; 
          border-bottom: 1px solid #444 !important; /* separator */
          border-radius: 8px 8px 0 0; 
        }

        /* 2. Editor Body Styling (Jahan text likhte hain) */
        .ql-container.ql-snow { 
          background-color: #000 !important; 
          color: #fff !important; /* Typing text white */
          border: 1px solid #fff !important; 
          border-top: none !important; 
          border-radius: 0 0 8px 8px; 
        }
        
        /* 3. Toolbar ke Icons ko White karna taaki dark background pe dikhein */
        .ql-snow .ql-stroke { stroke: #fff !important; }
        .ql-snow .ql-fill { fill: #fff !important; }
        .ql-snow .ql-picker { color: #fff !important; }
        
        /* 4. Dropdown menu (Size, Header) ka background dark karna */
        .ql-snow .ql-picker-options { 
          background-color: #222 !important; 
          color: #fff !important; 
          border: 1px solid #555 !important; 
        `}</style>
    </div>
  );
}