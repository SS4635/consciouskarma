import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { decryptEmail } from "./utils/emailCrypto";
import Swal from "sweetalert2";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 
import "./DashboardLayout.css"; 

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

const FontSize = Quill.import("formats/size");
FontSize.whitelist = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"];
Quill.register(FontSize, true);

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ size: FontSize.whitelist }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }], 
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"], 
  ],
};

const formats = [
  "header", "size", "font", "bold", "italic", "underline", "strike",
  "color", "background", "script", "align", "list", "bullet", "link", "image", "video"
];

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

  // Core Data States
  const [summaryRange, setSummaryRange] = useState("today"); 
  const [summaryData, setSummaryData] = useState({ instant: 0, personalised: 0, consult: 0, contact: 0, total: 0 });
  const [tableData, setTableData] = useState([]);
  
  // Link / Energy Log States
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState([]); 

  // Category States
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterDate, setFilterDate] = useState("all"); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Blog CMS States
  const [blogView, setBlogView] = useState("list"); 
  const [blogList, setBlogList] = useState([]); 
  const [editBlogId, setEditBlogId] = useState(null); 
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImageFile, setBlogImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(""); 
  const [blogCategory, setBlogCategory] = useState("");
  const [blogKeywords, setBlogKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Categories AND Routes Initially
  useEffect(() => {
    if(adminEmail) {
      fetchCategories();
      fetchAvailableRoutes();
    }
  }, [adminEmail]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/categories`);
      if (data.ok) setCategories(data.data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchAvailableRoutes = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/available-routes`, { params: { email: adminEmail } });
      if (data.ok) setAvailableRoutes(data.data);
    } catch (err) {}
  };

  // Fetch Summary
  useEffect(() => {
    if (activeTab === "summary") {
      const fetchSummary = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/admin/summary`, { params: { email: adminEmail, range: summaryRange } });
          if (data.ok) setSummaryData(data.data);
        } catch (err) {} finally { setLoading(false); }
      };
      fetchSummary();
    }
  }, [activeTab, adminEmail, summaryRange]);

  // Fetch Core Data Tables
  useEffect(() => {
    const tableTabs = ["instant", "personalised", "consult", "contact"];
    if (tableTabs.includes(activeTab)) {
      if (filterDate === "custom" && (!startDate || !endDate)) return;
      const fetchData = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/admin/data`, {
            params: { email: adminEmail, type: activeTab, search: debouncedSearch, filterDate, startDate, endDate, page, limit: 20 }
          });
          if (data.ok) setTableData(data.data);
        } catch (err) {} finally { setLoading(false); }
      };
      fetchData();
    }
  }, [activeTab, debouncedSearch, filterDate, startDate, endDate, page, adminEmail]);

  // Fetch Energy Logs
  useEffect(() => {
    if (activeTab === "energy-logs" && selectedRoute) {
      const fetchLogs = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/admin/energy-logs`, {
            params: { email: adminEmail, routeHit: selectedRoute }
          });
          if (data.ok) setTableData(data.data);
        } catch (err) {} finally { setLoading(false); }
      };
      fetchLogs();
    }
  }, [activeTab, selectedRoute, adminEmail]);
  
  // Fetch Blogs
  useEffect(() => {
    if (activeTab === "blog" && blogView === "list") {
      const fetchBlogs = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/admin/blogs`, { params: { email: adminEmail } });
          if (data.ok) setBlogList(data.data);
        } catch (err) {} finally { setLoading(false); }
      };
      fetchBlogs();
    }
  }, [activeTab, blogView, adminEmail]);

  // --- Category Actions (FIXED) ---
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      return Swal.fire("Warning", "Category name cannot be empty", "warning");
    }
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/admin/category`, { email: adminEmail, name: newCategory });
      if (data.ok) {
        setCategories([data.category, ...categories]);
        setNewCategory("");
        Swal.fire("Added", "Category added successfully", "success");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to add category";
      Swal.fire("Error", errMsg, "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/api/admin/category/${id}`, { data: { email: adminEmail } });
      if (data.ok) {
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (err) {
      Swal.fire("Error", "Failed to delete category", "error");
    }
  };

  // --- Blog Actions ---
  const handleEditBlog = (blog) => {
    setEditBlogId(blog._id);
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setExistingImageUrl(blog.imageUrl); 
    setBlogImageFile(null); 
    setBlogCategory(blog.category || "");
    setBlogKeywords(blog.keywords || []);
    setBlogView("form");
  };

  const handleCreateNewBlog = () => {
    setEditBlogId(null);
    setBlogTitle("");
    setBlogContent("");
    setExistingImageUrl("");
    setBlogImageFile(null);
    setBlogCategory("");
    setBlogKeywords([]);
    setKeywordInput("");
    setBlogView("form");
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = keywordInput.trim();
      if (val && !blogKeywords.includes(val)) {
        setBlogKeywords([...blogKeywords, val]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw) => {
    setBlogKeywords(blogKeywords.filter(k => k !== kw));
  };

  const handleBlogSubmit = async (status) => {
    // 1. Basic Validations (Title, Content, Image)
    if (!blogTitle.trim()) return Swal.fire("Error", "Blog Title is required!", "error");
    if (!blogContent || blogContent === "<p><br></p>") return Swal.fire("Error", "Blog Content cannot be empty!", "error");
    if (!blogImageFile && !existingImageUrl) return Swal.fire("Error", "Please select a Featured Image!", "error");

    // 🔥 2. STRICT PUBLISH VALIDATION (Naya Code)
    if (status === "published") {
      if (!blogCategory || blogCategory.trim() === "") {
        return Swal.fire("Missing Info", "Please select a Category before publishing!", "warning");
      }
      if (!blogKeywords || blogKeywords.length === 0) {
        return Swal.fire("Missing Info", "Please add at least one Meta Keyword before publishing!", "warning");
      }
    }

    setLoading(true);
    try {
      let finalImageUrl = existingImageUrl;
      if (blogImageFile) {
        const formData = new FormData();
        formData.append("image", blogImageFile); 
        const uploadRes = await axios.post(`${API_BASE_URL}/api/admin/upload-image`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        if (!uploadRes.data.ok) throw new Error("Image upload failed");
        finalImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        email: adminEmail,
        title: blogTitle,
        content: blogContent,
        imageUrl: finalImageUrl, 
        status: status,
        category: blogCategory,
        keywords: blogKeywords
      };

      let blogRes = editBlogId 
        ? await axios.put(`${API_BASE_URL}/api/admin/blog/${editBlogId}`, payload)
        : await axios.post(`${API_BASE_URL}/api/admin/blog`, payload);

      if (blogRes.data.ok) {
        Swal.fire("Success", blogRes.data.message, "success");
        setBlogView("list");
      }
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Failed to save blog.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    const confirm = await Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' });
    if (confirm.isConfirmed) {
      try {
        const { data } = await axios.delete(`${API_BASE_URL}/api/admin/blog/${id}`, { data: { email: adminEmail } });
        if (data.ok) setBlogList(prev => prev.filter(b => b._id !== id)); 
      } catch (err) {}
    }
  };

  const viewFullMessage = (name, message) => {
    Swal.fire({ title: `Message from ${name}`, text: message, icon: 'info', confirmButtonColor: '#ff914d' });
  };

  // 🔥 EXPORT EXCEL FUNCTION (UPDATED TO HANDLE LOGS TOO)
  const exportToExcel = () => {
    if (!tableData || tableData.length === 0) {
      return Swal.fire("Empty", "No data available to export.", "info");
    }

    let csvRows = [];

    // Logics for 'energy-logs' Tab Export
    if (activeTab === "energy-logs") {
      const headers = ["Date", "Time", "Mobile Hit", "IP Address"];
      csvRows.push(headers.join(","));

      tableData.forEach(item => {
        const d = new Date(item.createdAt);
        const dateStr = d.toLocaleDateString('en-IN');
        const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const mobile = `"${item.mobileNumber || "-"}"`;
        const ip = `"${item.ipAddress || "-"}"`;
        csvRows.push([dateStr, timeStr, mobile, ip].join(","));
      });
    } 
    // Logic for other Core Tabs Export
    else {
      let headers = ["Date", "Time", "Name", "Email", "Mobile"];
      if (activeTab === "instant") headers.push("Payment Mode");
      if (activeTab === "consult") headers.push("Plan Name");
      if (activeTab !== "contact") headers.push("Report Status");
      if (activeTab === "contact") headers.push("Message");

      csvRows.push(headers.join(","));

      tableData.forEach(item => {
        const fd = item.formData || {};
        
        let rawName = item.name || item.firstName || fd.general?.name || fd.name || fd.fullName || fd.firstName || "-";
        let rawEmail = item.email || fd.general?.email || fd.email || fd.emailAddress || "-";
        
        let rawPhone = item.phone;
        if (!rawPhone || rawPhone.trim() === "") {
           if (fd.primary?.number) {
               rawPhone = `${fd.primary.isd || ''}${fd.primary.number}`;
           } else {
               rawPhone = fd.phone || fd.mobile || fd.mobileNumber || fd.contact || "-";
           }
        }

        if (rawName.trim() === "") rawName = "-";
        if (rawEmail.trim() === "") rawEmail = "-";
        if (rawPhone.trim() === "") rawPhone = "-";

        const name = `"${rawName.replace(/"/g, '""')}"`;
        const email = `"${rawEmail}"`;
        const phone = `"${rawPhone}"`;
        
        const d = new Date(item.createdAt);
        const dateStr = d.toLocaleDateString('en-IN');
        const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        let row = [dateStr, timeStr, name, email, phone];

        if (activeTab === "instant") {
          const isFree = item.amount === 0 || item.price === 0;
          row.push(isFree ? "Coupon" : "Paid");
        }
        if (activeTab === "consult") {
          row.push(`"${item.planName || item.formData?.planName || "-"}"`);
        }
        if (activeTab !== "contact") {
          const isEmailSent = item.instantEmailSent === true || item.emailSent === true;
          row.push(isEmailSent ? "True" : "False");
        }
        if (activeTab === "contact") {
          row.push(`"${(item.message || "").replace(/"/g, '""')}"`);
        }

        csvRows.push(row.join(","));
      });
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `CK_Data_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            {["summary", "instant", "personalised", "consult"].map((tab) => (
              <button 
                key={tab}
                className={`ck-nav-item ${activeTab === tab ? "ck-nav-item--active" : ""}`} 
                onClick={() => { setActiveTab(tab); setPage(1); }}
                style={{ textTransform: "capitalize", color: activeTab === tab ? "#ff914d" : "#aaa", background: activeTab === tab ? "rgba(255, 145, 77, 0.1)" : "transparent" }}
              >
                {tab === "summary" ? "📊 Dashboard Overview" : tab === "personalised" ? "Personalised Reports" : `${tab} Data`}
              </button>
            ))}

            {/* LINK DROPDOWN (DYNAMIC FROM .ENV) */}
            <div style={{ marginTop: "5px" }}>
              <button 
                className="ck-nav-item" 
                onClick={() => setIsLinkOpen(!isLinkOpen)}
                style={{ color: activeTab === "energy-logs" ? "#ff914d" : "#aaa", background: activeTab === "energy-logs" ? "rgba(255, 145, 77, 0.1)" : "transparent", width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between" }}
              >
                <span>🔗 Link Actions</span>
                <span>{isLinkOpen ? "▾" : "▸"}</span>
              </button>
              {isLinkOpen && (
                <div style={{ paddingLeft: "15px", display: "flex", flexDirection: "column", gap: "5px", marginTop: "5px" }}>
                  {availableRoutes.length > 0 ? (
                    availableRoutes.map(route => (
                      <button 
                        key={route} 
                        onClick={() => { setActiveTab("energy-logs"); setSelectedRoute(route); }}
                        style={{ background: selectedRoute === route ? "#ff914d" : "#222", color: selectedRoute === route ? "#000" : "#fff", border: "none", padding: "8px", borderRadius: "4px", cursor: "pointer", textAlign: "left" }}
                      >
                        Route: /{route}
                      </button>
                    ))
                  ) : (
                    <span style={{ color: "#666", fontSize: "12px", padding: "8px" }}>No routes found in .env</span>
                  )}
                </div>
              )}
            </div>

            <button 
              className={`ck-nav-item ${activeTab === "contact" ? "ck-nav-item--active" : ""}`} 
              onClick={() => { setActiveTab("contact"); setPage(1); }}
              style={{ color: activeTab === "contact" ? "#ff914d" : "#aaa", background: activeTab === "contact" ? "rgba(255, 145, 77, 0.1)" : "transparent" }}
            >
              💬 Contact Data
            </button>

            <hr style={{ margin: "15px 0", borderColor: "#333" }} />
            
            <button 
              className={`ck-nav-item ${activeTab === "blog" ? "ck-nav-item--active" : ""}`} 
              onClick={() => { setActiveTab("blog"); setBlogView("list"); }}
              style={{ color: activeTab === "blog" ? "#ff914d" : "#aaa", background: activeTab === "blog" ? "rgba(255, 145, 77, 0.1)" : "transparent" }}
            >
              📝 Manage Blogs
            </button>
            <button 
              className={`ck-nav-item ${activeTab === "categories" ? "ck-nav-item--active" : ""}`} 
              onClick={() => setActiveTab("categories")}
              style={{ color: activeTab === "categories" ? "#ff914d" : "#aaa", background: activeTab === "categories" ? "rgba(255, 145, 77, 0.1)" : "transparent" }}
            >
              🗂️ Manage Categories
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

            {/* TABLES FOR INSTANT, PERSONALISED, CONSULT, CONTACT */}
            {["instant", "personalised", "consult", "contact"].includes(activeTab) && (
              <section className="ck-panel" style={{ background: "#111", border: "1px solid #333" }}>
                <h2 className="ck-panel-title" style={{ textTransform: "capitalize", color: "#fff" }}>{activeTab} Data</h2>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
                  <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", flex: 1 }}>
                    <input type="text" placeholder="Search Name, Email, Phone..." className="ck-input" style={{ flex: 1, minWidth: "200px", background: "#222", color: "#fff", border: "1px solid #444" }} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} />
                    
                    <select className="ck-input" style={{ width: "150px", background: "#222", color: "#fff", border: "1px solid #444" }} value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}>
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="last7">Last 7 Days</option>
                      <option value="last30">Last 30 Days</option>
                      <option value="custom">Custom Range</option>
                    </select>

                    {filterDate === "custom" && (
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input type="date" className="ck-input" style={{ background: "#222", color: "#fff", border: "1px solid #444" }} value={startDate} max={endDate || undefined} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} />
                        <span style={{color: "#888"}}>to</span>
                        <input type="date" className="ck-input" style={{ background: "#222", color: "#fff", border: "1px solid #444" }} value={endDate} min={startDate || undefined} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} />
                      </div>
                    )}
                  </div>

                  <button className="ck-btn-sm" style={{ background: "#2ecc71", color: "#000", fontWeight: "bold", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "6px" }} onClick={exportToExcel}>
                    📥 Export Excel
                  </button>
                </div>

                {loading ? <div className="ck-empty-state" style={{color: "#ff914d"}}>Loading records...</div> : tableData.length === 0 ? (
                  <div className="ck-empty-state" style={{color: "#888"}}>No records found.</div>
                ) : (
                  <>
                    <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px" }}>
                      <table className="ck-table" style={{ color: "#fff", width: "100%", textAlign: "left" }}>
                        <thead style={{ background: "#222" }}>
                          <tr>
                            <th style={{padding: "12px"}}>Date</th>
                            <th style={{padding: "12px"}}>Time</th>
                            <th style={{padding: "12px"}}>Name</th>
                            <th style={{padding: "12px"}}>Email</th>
                            <th style={{padding: "12px"}}>Mobile</th>
                            
                            {activeTab === "instant" && <th style={{padding: "12px"}}>Payment Mode</th>}
                            {activeTab === "consult" && <th style={{padding: "12px"}}>Plan Name</th>}
                            {activeTab !== "contact" && <th style={{padding: "12px"}}>Report Status</th>}
                            {activeTab === "contact" && <th style={{padding: "12px"}}>Message</th>}
                          </tr>
                        </thead>
                        
                        <tbody>
                          {tableData.map((item) => {
                            const fd = item.formData || {};
                            
                            let name = item.name || item.firstName || fd.general?.name || fd.name || fd.fullName || fd.firstName || "-";
                            let email = item.email || fd.general?.email || fd.email || fd.emailAddress || "-";
                            
                            let phone = item.phone;
                            if (!phone || phone.trim() === "") {
                               if (fd.primary?.number) {
                                   phone = `${fd.primary.isd || ''}${fd.primary.number}`;
                               } else {
                                   phone = fd.phone || fd.mobile || fd.mobileNumber || fd.contact || "-";
                               }
                            }

                            if (name.trim() === "") name = "-";
                            if (email.trim() === "") email = "-";
                            if (phone.trim() === "") phone = "-";

                            const planName = item.planName || item.formData?.planName || "-";
                            
                            const d = new Date(item.createdAt);
                            const dateStr = d.toLocaleDateString('en-IN');
                            const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

                            const isFreeOrCoupon = item.amount === 0 || item.price === 0;
                            const isEmailSent = item.instantEmailSent === true || item.emailSent === true;

                            return (
                              <tr key={item._id} style={{ borderBottom: "1px solid #333" }}>
                                <td style={{padding: "12px"}}>{dateStr}</td>
                                <td style={{padding: "12px", color: "#aaa"}}>{timeStr}</td>
                                <td style={{padding: "12px"}}>{name}</td>
                                <td style={{padding: "12px"}}>{email}</td>
                                <td style={{padding: "12px"}}>{phone}</td>
                                
                                {activeTab === "instant" && (
                                  <td style={{ padding: "12px", color: isFreeOrCoupon ? "#2ecc71" : "#3498db" }}>
                                    {isFreeOrCoupon ? "Coupon" : "Paid"}
                                  </td>
                                )}

                                {activeTab === "consult" && <td style={{padding: "12px"}}>{planName}</td>}

                                {activeTab !== "contact" && (
                                  <td style={{padding: "12px"}}>
                                    <span style={{
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      fontSize: "12px",
                                      background: isEmailSent ? "rgba(46,204,113,0.1)" : "rgba(231,76,60,0.1)",
                                      color: isEmailSent ? "#2ecc71" : "#e74c3c",
                                      fontWeight: "bold"
                                    }}>
                                      {isEmailSent ? "True" : "False"}
                                    </span>
                                  </td>
                                )}

                                {activeTab === "contact" && (
                                  <td style={{padding: "12px"}}>
                                    <button className="ck-btn-sm" style={{background: "#ff914d", border: "none", color: "black", fontWeight: "bold", cursor: "pointer", padding: "6px 12px", borderRadius: "4px"}} onClick={() => viewFullMessage(name, item.message)}>Read Message</button>
                                  </td>
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

            {/* 🔥 NEW: ENERGY LOGS VIEW (WITH EXPORT BUTTON) */}
            {activeTab === "energy-logs" && (
              <section className="ck-panel" style={{ background: "#111", border: "1px solid #333" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 className="ck-panel-title" style={{ color: "#fff", margin: 0 }}>Logs for Route: /{selectedRoute}</h2>
                  <button className="ck-btn-sm" style={{ background: "#2ecc71", color: "#000", fontWeight: "bold", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "6px" }} onClick={exportToExcel}>
                    📥 Export Excel
                  </button>
                </div>

                {loading ? <div className="ck-empty-state" style={{color: "#ff914d"}}>Loading logs...</div> : tableData.length === 0 ? (
                  <div className="ck-empty-state" style={{color: "#888"}}>No hits recorded for this route yet.</div>
                ) : (
                  <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px" }}>
                    <table className="ck-table" style={{ color: "#fff", width: "100%", textAlign: "left" }}>
                      <thead style={{ background: "#222" }}>
                        <tr><th style={{padding: "12px"}}>Date</th><th style={{padding: "12px"}}>Time</th><th style={{padding: "12px"}}>Mobile Hit</th><th style={{padding: "12px"}}>IP Address</th></tr>
                      </thead>
                      <tbody>
                        {tableData.map(log => {
                          const d = new Date(log.createdAt);
                          return (
                            <tr key={log._id} style={{ borderBottom: "1px solid #333" }}>
                              <td style={{padding: "12px"}}>{d.toLocaleDateString('en-IN')}</td>
                              <td style={{padding: "12px", color: "#aaa"}}>{d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                              <td style={{padding: "12px", color: "#ff914d", fontWeight: "bold"}}>{log.mobileNumber}</td>
                              <td style={{padding: "12px"}}>{log.ipAddress}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* 🔥 MANAGE CATEGORIES VIEW */}
            {activeTab === "categories" && (
              <section className="ck-panel" style={{ background: "#111", border: "1px solid #333" }}>
                <h2 className="ck-panel-title" style={{ color: "#fff" }}>Blog Categories</h2>
                
                <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                  <input type="text" className="ck-input" placeholder="New Category Name..." value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ background: "#222", color: "#fff", border: "1px solid #444", padding: "10px", borderRadius: "6px" }}/>
                  <button onClick={handleAddCategory} style={{ background: "#ff914d", color: "#000", fontWeight: "bold", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Add Category</button>
                </div>

                <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px" }}>
                    <table className="ck-table" style={{ color: "#fff", width: "100%", textAlign: "left" }}>
                      <thead style={{ background: "#222" }}>
                        <tr><th style={{padding: "12px"}}>Category Name</th><th style={{padding: "12px", width: "100px"}}>Action</th></tr>
                      </thead>
                      <tbody>
                        {categories.map(cat => (
                          <tr key={cat._id} style={{ borderBottom: "1px solid #333" }}>
                            <td style={{padding: "12px"}}>{cat.name}</td>
                            <td style={{padding: "12px"}}>
                              <button onClick={() => handleDeleteCategory(cat._id)} style={{background: "transparent", color: "#e74c3c", border: "none", cursor: "pointer"}}>Delete</button>
                            </td>
                          </tr>
                        ))}
                        {categories.length === 0 && <tr><td colSpan="2" style={{padding: "12px", textAlign: "center", color: "#888"}}>No categories created yet</td></tr>}
                      </tbody>
                    </table>
                </div>
              </section>
            )}

            {/* 🔥 EXISTING BLOGS TAB */}
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
                  loading ? <p style={{color: "#ff914d"}}>Loading blogs...</p> : blogList.length === 0 ? <p style={{color: "#888"}}>No blogs found.</p> : (
                    <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px" }}>
                      <table className="ck-table" style={{ color: "#fff", width: "100%", textAlign: "left" }}>
                        <thead style={{ background: "#222" }}>
                          <tr><th style={{padding: "12px"}}>Title</th><th style={{padding: "12px"}}>Category</th><th style={{padding: "12px"}}>Status</th><th style={{padding: "12px"}}>Actions</th></tr>
                        </thead>
                        <tbody>
                          {blogList.map(blog => (
                            <tr key={blog._id} style={{ borderBottom: "1px solid #333" }}>
                              <td style={{padding: "12px"}}>{blog.title}</td>
                              <td style={{padding: "12px", color: "#aaa"}}>{blog.category || "Uncategorized"}</td>
                              <td style={{padding: "12px"}}><span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", background: blog.status === "published" ? "rgba(46, 204, 113, 0.2)" : "rgba(241, 196, 15, 0.2)", color: blog.status === "published" ? "#2ecc71" : "#f1c40f" }}>{blog.status.toUpperCase()}</span></td>
                              <td style={{padding: "12px"}}><div style={{display: "flex", gap: "10px"}}><button onClick={() => handleEditBlog(blog)} style={{background: "transparent", color: "#3498db", border: "none", cursor: "pointer"}}>Edit</button><button onClick={() => handleDeleteBlog(blog._id)} style={{background: "transparent", color: "#e74c3c", border: "none", cursor: "pointer"}}>Delete</button></div></td>
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
                      <input type="text" className="ck-input" style={{ background: "#222", color: "#fff", border: "1px solid #444" }} value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                      <div>
                        <label className="ck-label" style={{color: "#aaa"}}>Select Category</label>
                        <select className="ck-input" style={{ background: "#222", color: "#fff", border: "1px solid #444", width: "100%" }} value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)}>
                          <option value="">-- Choose Category --</option>
                          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="ck-label" style={{color: "#aaa"}}>Meta Keywords (Press Enter)</label>
                        <div style={{ background: "#222", border: "1px solid #444", borderRadius: "6px", padding: "5px", display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center" }}>
                          {blogKeywords.map(kw => (
                            <span key={kw} style={{ background: "#ff914d", color: "#000", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold" }}>
                              {kw} <button type="button" onClick={() => removeKeyword(kw)} style={{ background: "transparent", border: "none", color: "#000", cursor: "pointer", fontSize: "14px", lineHeight: 1 }}>×</button>
                            </span>
                          ))}
                          <input type="text" placeholder="Type and press enter..." value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={handleKeywordKeyDown} style={{ background: "transparent", border: "none", color: "#fff", flex: 1, minWidth: "120px", outline: "none", padding: "5px" }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="ck-label" style={{color: "#aaa"}}>Featured Image</label>
                      {existingImageUrl && <img src={existingImageUrl} alt="Current" style={{ display: "block", width: "150px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "2px solid #333", margin: "10px 0" }} />}
                      <input type="file" accept="image/*" className="ck-input" style={{ padding: "10px", background: "#222", color: "#fff", border: "1px solid #444" }} onChange={(e) => setBlogImageFile(e.target.files[0])} />
                    </div>

                    <div>
                      <label className="ck-label" style={{color: "#aaa"}}>Blog Content</label>
                      <div style={{ background: "#000", color: "#fff", minHeight: "400px", borderRadius: "8px", overflow: "hidden", marginTop: "10px" }}>
                        <ReactQuill theme="snow" value={blogContent} onChange={setBlogContent} modules={modules} formats={formats} style={{ height: "350px" }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "15px", marginTop: "40px" }}>
                      <button className="ck-btn" style={{ background: "#333", color: "#fff", border: "1px solid #555" }} onClick={() => handleBlogSubmit("draft")} disabled={loading}>Save as Draft</button>
                      <button className="ck-btn" style={{ background: "#ff914d", color: "#000", fontWeight: "bold" }} onClick={() => handleBlogSubmit("published")} disabled={loading}>Publish Now</button>
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
        
        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before { content: attr(data-value) !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label:not([data-value])::before { content: "16px" !important; }
        .ql-snow .ql-picker.ql-size { width: 90px !important; }
        
        .ql-toolbar.ql-snow { background: #f0f0f0; border-radius: 4px 4px 0 0; }
        .ql-container.ql-snow { border-radius: 0 0 4px 4px; }
        
        .ql-toolbar.ql-snow { background-color: #111 !important; border: 1px solid #fff !important; border-bottom: 1px solid #444 !important; border-radius: 8px 8px 0 0; }
        .ql-container.ql-snow { background-color: #000 !important; color: #fff !important; border: 1px solid #fff !important; border-top: none !important; border-radius: 0 0 8px 8px; }
        .ql-snow .ql-stroke { stroke: #fff !important; }
        .ql-snow .ql-fill { fill: #fff !important; }
        .ql-snow .ql-picker { color: #fff !important; }
        .ql-snow .ql-picker-options { background-color: #222 !important; color: #fff !important; border: 1px solid #555 !important; }
      `}</style>
    </div>
  );
}