// src/AdminDashboardLayout.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { decryptEmail } from "./utils/emailCrypto";
import Swal from "sweetalert2";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 
import "./DashboardLayout.css"; 

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

// 🔥 THE ULTIMATE FIX: Create an array of ALL sizes from 8px to 100px
const allSizes = [];
for (let i = 8; i <= 100; i++) {
  allSizes.push(`${i}px`);
}

const SizeStyle = Quill.import("attributors/style/size");
SizeStyle.whitelist = allSizes; 
Quill.register(SizeStyle, true);

const FontStyle = Quill.import("attributors/style/font");
FontStyle.whitelist = ["sans-serif", "serif", "monospace", "balgin", "arsenal"];
Quill.register(FontStyle, true);

const toolbarDropdownSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ size: toolbarDropdownSizes }], 
    [{ font: FontStyle.whitelist }],
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

  // 🔥 NEW: Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data States
  const [summaryRange, setSummaryRange] = useState("today"); 
  const [summaryData, setSummaryData] = useState({ instant: 0, personalised: 0, consult: 0, contact: 0, total: 0 });
  const [tableData, setTableData] = useState([]);
  
  // Link / Energy Log States
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState([]); 
  const [historicalLinks, setHistoricalLinks] = useState([]);

  // Category States
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Filters & Pagination
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
  
  // Custom Manual Font Size States
  const quillRef = useRef(null);
  const [customFontSize, setCustomFontSize] = useState("25"); 

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if(adminEmail) {
      fetchCategories();
      fetchAvailableRoutes();
      fetchHistoricalLinks(); 
    }
  }, [adminEmail]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/categories`);
      if (data.ok) setCategories(data.data);
    } catch (err) {}
  };

  const fetchAvailableRoutes = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/available-routes`, { params: { email: adminEmail } });
      if (data.ok) setAvailableRoutes(data.data);
    } catch (err) {}
  };

  const fetchHistoricalLinks = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/historical-links`, { params: { email: adminEmail } });
      if (data.ok) setHistoricalLinks(data.data);
    } catch (err) {}
  };

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

  useEffect(() => {
    const tableTabs = ["instant", "personalised", "consult", "contact"];
    if (tableTabs.includes(activeTab)) {
      if (filterDate === "custom" && (!startDate || !endDate)) return;
      const fetchData = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/admin/data`, {
            params: { email: adminEmail, type: activeTab, search: debouncedSearch, filterDate, startDate, endDate, page, limit: 10 }
          });
          if (data.ok) {
            setTableData(data.data);
            setTotalPages(data.pagination.pages);
          }
        } catch (err) {} finally { setLoading(false); }
      };
      fetchData();
    }
  }, [activeTab, debouncedSearch, filterDate, startDate, endDate, page, adminEmail]);

  useEffect(() => {
    if ((activeTab === "energy-logs" || activeTab === "previous-links") && selectedRoute) {
      if (filterDate === "custom" && (!startDate || !endDate)) return;
      
      const fetchLogs = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/admin/energy-logs`, {
          params: { email: adminEmail, routeHit: selectedRoute, search: debouncedSearch, filterDate, startDate, endDate }
        });
          if (data.ok) setTableData(data.data); 
        } catch (err) {} finally { setLoading(false); }
      };
      fetchLogs();
    }
  }, [activeTab, selectedRoute, adminEmail, debouncedSearch, filterDate, startDate, endDate]);
  
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

// 🔥 NEW: Mark as Completed Handler
  const handleMarkCompleted = async (id, type) => {
    const confirm = await Swal.fire({
      title: 'Mark as Completed?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, complete it!'
    });

    if (confirm.isConfirmed) {
      try {
        const { data } = await axios.put(`${API_BASE_URL}/api/admin/mark-completed`, {
          email: adminEmail,
          id,
          type
        });
        
        if (data.ok) {
          // Update the UI instantly without reloading
          setTableData(prev => prev.map(item => item._id === id ? { ...item, isCompleted: true } : item));
          Swal.fire("Completed!", "Report has been marked as completed.", "success");
        }
      } catch (err) {
        Swal.fire("Error", "Failed to update status", "error");
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return Swal.fire("Warning", "Category name cannot be empty", "warning");
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/admin/category`, { email: adminEmail, name: newCategory });
      if (data.ok) {
        setCategories([data.category, ...categories]);
        setNewCategory("");
        Swal.fire("Added", "Category added successfully", "success");
      }
    } catch (err) { Swal.fire("Error", "Failed to add category", "error"); }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/api/admin/category/${id}`, { data: { email: adminEmail } });
      if (data.ok) setCategories(categories.filter(c => c._id !== id));
    } catch (err) { Swal.fire("Error", "Failed to delete category", "error"); }
  };

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

  const applyCustomFontSize = (e) => {
    e.preventDefault();
    if (!quillRef.current) return;
    
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    
    if (range && range.length > 0) {
      editor.format('size', `${customFontSize}px`);
    } else {
      Swal.fire("Select Text", "Please highlight the text first to apply the font size.", "info");
    }
  };

  const handleBlogSubmit = async (status) => {
    if (!blogTitle.trim()) return Swal.fire("Error", "Blog Title is required!", "error");
    if (!blogContent || blogContent === "<p><br></p>") return Swal.fire("Error", "Blog Content cannot be empty!", "error");
    if (!blogImageFile && !existingImageUrl) return Swal.fire("Error", "Please select a Featured Image!", "error");
    if (status === "published" && (!blogCategory || blogCategory.trim() === "")) return Swal.fire("Missing Info", "Select a Category!", "warning");
    if (status === "published" && (!blogKeywords || blogKeywords.length === 0)) return Swal.fire("Missing Info", "Add Meta Keywords!", "warning");

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

      const payload = { email: adminEmail, title: blogTitle, content: blogContent, imageUrl: finalImageUrl, status: status, category: blogCategory, keywords: blogKeywords };

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

  const exportToExcel = async () => {
    let fullDataForExport = tableData;

    // 🔥 FIX: If it's a paginated table, fetch ALL data based on current filters
    if (["instant", "personalised", "consult", "contact"].includes(activeTab)) {
      Swal.fire({ title: 'Preparing Export...', text: 'Fetching all records, please wait.', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/admin/data`, {
          params: { email: adminEmail, type: activeTab, search: debouncedSearch, filterDate, startDate, endDate, page: 1, limit: 100000 } // Super high limit to get everything
        });
        if (data.ok) fullDataForExport = data.data;
        Swal.close();
      } catch (err) {
        Swal.fire("Error", "Failed to fetch full data for export.", "error");
        return;
      }
    }

    if (!fullDataForExport || fullDataForExport.length === 0) return Swal.fire("Empty", "No data available to export.", "info");
    
    let csvRows = [];
    if (activeTab === "energy-logs" || activeTab === "previous-links") {
      const headers = ["Date", "Time", "Mobile Hit", "Source Link", "API Route Hit", "IP Address"];
      csvRows.push(headers.join(","));
      fullDataForExport.forEach(item => {
        const d = new Date(item.createdAt);
        csvRows.push([d.toLocaleDateString('en-IN'), d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), `"${item.mobileNumber || "-"}"`, `"${item.sourceLink || "-"}"`, `"${item.routeHit || "-"}"`, `"${item.ipAddress || "-"}"`].join(","));
      });
    } else {
      let headers = ["Date", "Time", "Name", "Email", "Mobile"];
      if (activeTab === "instant") headers.push("Payment Mode");
      if (activeTab === "consult") headers.push("Plan Name");
      if (activeTab !== "contact") headers.push("Report Status");
      if (activeTab === "personalised" || activeTab === "consult") headers.push("Completion Status"); // New Column
      if (activeTab === "contact") headers.push("Message");
      csvRows.push(headers.join(","));

      fullDataForExport.forEach(item => {
        const fd = item.formData || {};
        let rawName = item.name || item.firstName || fd.general?.name || fd.name || fd.fullName || fd.firstName || "-";
        let rawEmail = item.email || fd.general?.email || fd.email || fd.emailAddress || "-";
        let rawPhone = item.phone || (fd.primary?.number ? `${fd.primary.isd || ''}${fd.primary.number}` : fd.phone || fd.mobile || "-");
        const d = new Date(item.createdAt);
        let row = [d.toLocaleDateString('en-IN'), d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), `"${rawName.replace(/"/g, '""')}"`, `"${rawEmail}"`, `"${rawPhone}"`];
        
        if (activeTab === "instant") row.push(item.amount === 0 || item.price === 0 ? "Coupon" : "Paid");
        if (activeTab === "consult") row.push(`"${item.planName || item.formData?.planName || "-"}"`);
        if (activeTab !== "contact") row.push(item.instantEmailSent === true || item.emailSent === true ? "True" : "False");
        if (activeTab === "personalised" || activeTab === "consult") row.push(item.isCompleted ? "Completed" : "Pending"); // Export completion status
        if (activeTab === "contact") row.push(`"${(item.message || "").replace(/"/g, '""')}"`);
        csvRows.push(row.join(","));
      });
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `CK_Data_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderPagination = (currentPage, totalPagesObj) => {
    if (totalPagesObj <= 1) return null;
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px", padding: "10px" }}>
        <button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} style={{ padding: "8px 16px", background: currentPage === 1 ? "#333" : "#ff914d", color: currentPage === 1 ? "#666" : "#000", border: "none", borderRadius: "4px", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontWeight: "bold" }}>Prev</button>
        <span style={{ color: "#fff", display: "flex", alignItems: "center" }}>Page {currentPage} of {totalPagesObj}</span>
        <button onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPagesObj} style={{ padding: "8px 16px", background: currentPage === totalPagesObj ? "#333" : "#ff914d", color: currentPage === totalPagesObj ? "#666" : "#000", border: "none", borderRadius: "4px", cursor: currentPage === totalPagesObj ? "not-allowed" : "pointer", fontWeight: "bold" }}>Next</button>
      </div>
    );
  };

  const filteredBlogs = blogList.filter(b => b.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || (b.category && b.category.toLowerCase().includes(debouncedSearch.toLowerCase())));
  const displayedBlogs = filteredBlogs.slice((page - 1) * 10, page * 10);
  const totalBlogPages = Math.ceil(filteredBlogs.length / 10);

  const displayedEnergyLogs = tableData.slice((page - 1) * 10, page * 10);
  const totalEnergyPages = Math.ceil(tableData.length / 10);

  const darkCardStyle = { padding: "24px", background: "linear-gradient(145deg, #1a1a1a 0%, #111111 100%)", border: "1px solid #333", borderRadius: "16px", color: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" };
  const rangeBtnStyle = (range) => ({ padding: "8px 16px", background: summaryRange === range ? "#ff914d" : "transparent", color: summaryRange === range ? "#000" : "#888", border: `1px solid ${summaryRange === range ? "#ff914d" : "#444"}`, borderRadius: "20px", cursor: "pointer", fontWeight: summaryRange === range ? "bold" : "500", transition: "all 0.3s ease", fontSize: "13px" });

  // Helper to close sidebar after navigation on mobile
  const handleNavClick = (tabAction) => {
    tabAction();
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="ck-dashboard" style={{ background: "#000", minHeight: "100vh" }}>
      
      {/* HEADER WITH MOBILE TOGGLE */}
      <header className="ck-navbar" style={{ background: "#111", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
        <div className="ck-navbar-brand">
          <span className="brand-text-top">conscious</span>
          <span className="brand-text-bottom" style={{color: "#ff914d"}}>KARMA (ADMIN)</span>
        </div>
        
        {/* 🔥 Hamburger Button (Visible only on mobile via CSS) */}
        <button 
          className="mobile-sidebar-toggle"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          style={{ background: "transparent", border: "none", color: "#ff914d", fontSize: "28px", cursor: "pointer" }}
        >
          {isMobileSidebarOpen ? "✕" : "☰"}
        </button>
      </header>

      <div className="dashboard-body" style={{ display: "flex", position: "relative" }}>
        
        {/* 🔥 Mobile Overlay: Closes sidebar when clicking outside */}
        {isMobileSidebarOpen && (
          <div 
            className="mobile-overlay"
            onClick={() => setIsMobileSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99, backdropFilter: "blur(4px)" }}
          />
        )}

        {/* SIDEBAR */}
        <aside className={`ck-sidebar ${isMobileSidebarOpen ? "open" : ""}`} style={{ background: "#111", borderRight: "1px solid #333" }}>
          <nav className="ck-nav">
            {["summary", "instant", "personalised", "consult"].map((tab) => (
              <button key={tab} className={`ck-nav-item ${activeTab === tab ? "ck-nav-item--active" : ""}`} onClick={() => handleNavClick(() => { setActiveTab(tab); setPage(1); })} style={{ textTransform: "capitalize", color: activeTab === tab ? "#ff914d" : "#aaa", background: activeTab === tab ? "rgba(255, 145, 77, 0.1)" : "transparent" }}>
                {tab === "summary" ? "📊 Dashboard Overview" : tab === "personalised" ? "Personalised Reports" : `${tab} Data`}
              </button>
            ))}

            <div style={{ marginTop: "5px" }}>
              <button className="ck-nav-item" onClick={() => setIsLinkOpen(!isLinkOpen)} style={{ color: activeTab === "energy-logs" ? "#ff914d" : "#aaa", background: activeTab === "energy-logs" ? "rgba(255, 145, 77, 0.1)" : "transparent", width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
                <span>🔗 Active Links</span><span>{isLinkOpen ? "▾" : "▸"}</span>
              </button>
              {isLinkOpen && (
                <div style={{ paddingLeft: "15px", display: "flex", flexDirection: "column", gap: "5px", marginTop: "5px" }}>
                  {availableRoutes.length > 0 ? (
                    availableRoutes.map(route => (
  <button key={route} title={`/${route}`} onClick={() => handleNavClick(() => { setActiveTab("energy-logs"); setSelectedRoute(route); setPage(1); setSearchQuery(""); setFilterDate("all"); })} style={{ background: selectedRoute === route && activeTab === "energy-logs" ? "#ff914d" : "#222", color: selectedRoute === route && activeTab === "energy-logs" ? "#000" : "#fff", border: "none", padding: "8px", borderRadius: "4px", cursor: "pointer", textAlign: "left", whiteSpace: "nowrap", overflow: "hidden" }}>
    Route: /{route?.length > 4 ? route.substring(0, 4) + '...' : route}
  </button>
))
                  ) : (<span style={{ color: "#666", fontSize: "12px", padding: "8px" }}>No routes found</span>)}
                </div>
              )}
            </div>

            <button className={`ck-nav-item ${activeTab === "previous-links" ? "ck-nav-item--active" : ""}`} onClick={() => handleNavClick(() => { setActiveTab("previous-links"); setSelectedRoute(historicalLinks[0] || ""); setPage(1); setSearchQuery(""); setFilterDate("all"); })} style={{ color: activeTab === "previous-links" ? "#ff914d" : "#aaa", background: activeTab === "previous-links" ? "rgba(255, 145, 77, 0.1)" : "transparent", marginTop: "5px" }}>
              🗃️ Previous Links
            </button>

            <button className={`ck-nav-item ${activeTab === "contact" ? "ck-nav-item--active" : ""}`} onClick={() => handleNavClick(() => { setActiveTab("contact"); setPage(1); })} style={{ color: activeTab === "contact" ? "#ff914d" : "#aaa", background: activeTab === "contact" ? "rgba(255, 145, 77, 0.1)" : "transparent" }}>
              💬 Contact Data
            </button>

            <hr style={{ margin: "15px 0", borderColor: "#333" }} />
            
            <button className={`ck-nav-item ${activeTab === "blog" ? "ck-nav-item--active" : ""}`} onClick={() => handleNavClick(() => { setActiveTab("blog"); setBlogView("list"); setPage(1); })} style={{ color: activeTab === "blog" ? "#ff914d" : "#aaa", background: activeTab === "blog" ? "rgba(255, 145, 77, 0.1)" : "transparent" }}>
              📝 Manage Blogs
            </button>
            <button className={`ck-nav-item ${activeTab === "categories" ? "ck-nav-item--active" : ""}`} onClick={() => handleNavClick(() => {setActiveTab("categories"); setPage(1);})} style={{ color: activeTab === "categories" ? "#ff914d" : "#aaa", background: activeTab === "categories" ? "rgba(255, 145, 77, 0.1)" : "transparent" }}>
              🗂️ Manage Categories
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="ck-main" style={{ background: "#000", flex: 1, width: "100%", overflowX: "hidden" }}>
          <main className="ck-content" style={{ padding: "20px" }}>

            {activeTab === "summary" && (
              <section style={{ padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
                  <div><h2 style={{ margin: 0, fontSize: "28px", fontWeight: "600", color: "#fff" }}>Business Overview</h2></div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                    {[{ id: "today", label: "Today" }, { id: "weekly", label: "7 Days" }, { id: "monthly", label: "30 Days" }, { id: "all", label: "All Time" }].map(r => (
                      <button key={r.id} style={rangeBtnStyle(r.id)} onClick={() => setSummaryRange(r.id)}>{r.label}</button>
                    ))}
                  </div>
                </div>

                {loading ? ( <div style={{ color: "#ff914d", textAlign: "center", padding: "50px" }}>Loading metrics...</div> ) : (
                  <>
                    <div style={{ ...darkCardStyle, borderLeft: "6px solid #ff914d", marginBottom: "24px", flexDirection: "row", alignItems: "center" }}>
                      <div><h3 style={{ color: "#aaa", margin: 0, fontSize: "14px" }}>Total Interactions Volume</h3><p style={{ fontSize: "56px", fontWeight: "900", margin: "5px 0 0", color: "#fff" }}>{summaryData.total}</p></div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
                      <div style={darkCardStyle}><h3 style={{ margin: 0, fontSize: "15px", color: "#aaa" }}>Instant Reports</h3><p style={{ fontSize: "40px", fontWeight: "bold", margin: "15px 0 0", color: "#ff914d" }}>{summaryData.instant}</p></div>
                      <div style={darkCardStyle}><h3 style={{ margin: 0, fontSize: "15px", color: "#aaa" }}>Personalised</h3><p style={{ fontSize: "40px", fontWeight: "bold", margin: "15px 0 0", color: "#ff914d" }}>{summaryData.personalised}</p></div>
                      <div style={darkCardStyle}><h3 style={{ margin: 0, fontSize: "15px", color: "#aaa" }}>Consultations</h3><p style={{ fontSize: "40px", fontWeight: "bold", margin: "15px 0 0", color: "#ff914d" }}>{summaryData.consult}</p></div>
                      <div style={darkCardStyle}><h3 style={{ margin: 0, fontSize: "15px", color: "#aaa" }}>Contacts</h3><p style={{ fontSize: "40px", fontWeight: "bold", margin: "15px 0 0", color: "#ff914d" }}>{summaryData.contact}</p></div>
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
                    <input type="text" placeholder="Search Deep Across Forms..." className="ck-input" style={{ flex: 1, minWidth: "200px", background: "#222", color: "#fff", border: "1px solid #444" }} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} />
                    <select className="ck-input" style={{ width: "150px", background: "#222", color: "#fff", border: "1px solid #444" }} value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}>
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="last7">Last 7 Days</option>
                      <option value="last30">Last 30 Days</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    {filterDate === "custom" && (
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input type="date" className="ck-input" style={{ background: "#222", color: "#fff", border: "1px solid #444" }} value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} />
                        <span style={{color: "#888"}}>to</span>
                        <input type="date" className="ck-input" style={{ background: "#222", color: "#fff", border: "1px solid #444" }} value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} />
                      </div>
                    )}
                  </div>
                  <button className="ck-btn-sm" style={{ background: "#2ecc71", color: "#000", fontWeight: "bold", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "6px" }} onClick={exportToExcel}>📥 Export Excel</button>
                </div>

                {loading ? <div className="ck-empty-state" style={{color: "#ff914d"}}>Loading records...</div> : tableData.length === 0 ? (
                  <div className="ck-empty-state" style={{color: "#888"}}>No records found.</div>
                ) : (
                  <>
                    <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px", overflowX: "auto" }}>
                      <table className="ck-table" style={{ color: "#fff", width: "100%", textAlign: "left", minWidth: "600px" }}>
                        <thead style={{ background: "#222" }}>
                          <tr>
                            <th style={{padding: "12px"}}>Date</th><th style={{padding: "12px"}}>Time</th><th style={{padding: "12px"}}>Name</th><th style={{padding: "12px"}}>Email</th><th style={{padding: "12px"}}>Mobile</th>
                            {activeTab === "instant" && <th style={{padding: "12px"}}>Payment Mode</th>}
                            {activeTab === "consult" && <th style={{padding: "12px"}}>Plan Name</th>}
                            {activeTab !== "contact" && <th style={{padding: "12px"}}>Report Status</th>}
                            {(activeTab === "personalised" || activeTab === "consult") && <th style={{padding: "12px"}}>Task Status</th>}
                            {activeTab === "contact" && <th style={{padding: "12px"}}>Message</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((item) => {
                            const fd = item.formData || {};
                            let name = item.name || item.firstName || fd.general?.name || fd.name || fd.fullName || fd.firstName || "-";
                            let email = item.email || fd.general?.email || fd.email || fd.emailAddress || "-";
                            let phone = item.phone || (fd.primary?.number ? `${fd.primary.isd || ''}${fd.primary.number}` : fd.phone || fd.mobile || "-");
                            const planName = item.planName || item.formData?.planName || "-";
                            const d = new Date(item.createdAt);
                            const isFreeOrCoupon = item.amount === 0 || item.price === 0;
                            const isEmailSent = item.instantEmailSent === true || item.emailSent === true;

                            return (
                              <tr key={item._id} style={{ borderBottom: "1px solid #333" }}>
                                <td style={{padding: "12px"}}>{d.toLocaleDateString('en-IN')}</td>
                                <td style={{padding: "12px", color: "#aaa"}}>{d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                                <td style={{padding: "12px"}}>{name}</td>
                                <td style={{padding: "12px"}}>{email}</td>
                                <td style={{padding: "12px"}}>{phone}</td>
                                {activeTab === "instant" && (<td style={{ padding: "12px", color: isFreeOrCoupon ? "#2ecc71" : "#3498db" }}>{isFreeOrCoupon ? "Coupon" : "Paid"}</td>)}
                                {activeTab === "consult" && <td style={{padding: "12px"}}>{planName}</td>}
                                {activeTab !== "contact" && (<td style={{padding: "12px"}}><span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", background: isEmailSent ? "rgba(46,204,113,0.1)" : "rgba(231,76,60,0.1)", color: isEmailSent ? "#2ecc71" : "#e74c3c", fontWeight: "bold" }}>{isEmailSent ? "True" : "False"}</span></td>)}
                                {(activeTab === "personalised" || activeTab === "consult") && (
  <td style={{padding: "12px"}}>
    {item.isCompleted ? (
      <span style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "14px" }}>Completed ✅</span>
    ) : (
      <button 
        onClick={() => handleMarkCompleted(item._id, activeTab)} 
        style={{ background: "#f39c12", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
        Mark Complete
      </button>
    )}
  </td>
)}
                                {activeTab === "contact" && (<td style={{padding: "12px"}}><button className="ck-btn-sm" style={{background: "#ff914d", border: "none", color: "black", fontWeight: "bold", cursor: "pointer", padding: "6px 12px", borderRadius: "4px"}} onClick={() => viewFullMessage(name, item.message)}>Read</button></td>)}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {renderPagination(page, totalPages)}
                  </>
                )}
              </section>
            )}

            {/* ENERGY LOGS TAB */}
            {(activeTab === "energy-logs" || activeTab === "previous-links") && (
              <section className="ck-panel" style={{ background: "#111", border: "1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
                  <h2 className="ck-panel-title" style={{ color: "#fff", margin: 0 }}>
  {activeTab === "previous-links" 
    ? "Archived Link Data" 
    : `Traffic for Link: /${selectedRoute?.length > 4 ? selectedRoute.substring(0, 4) + '...' : selectedRoute}`
  }
</h2>
                </div>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", marginBottom: "20px" }}>
                  {activeTab === "previous-links" && (
                     <select className="ck-input" style={{ width: "100%", maxWidth: "200px", background: "#222", color: "#fff", border: "1px solid #444" }} value={selectedRoute} onChange={(e) => {setSelectedRoute(e.target.value); setPage(1);}}>
  <option value="" disabled>Select a previous link...</option>
  {historicalLinks.map(link => (
    <option key={link} value={link} title={link}>
      {link?.length > 4 ? link.substring(0, 4) + '...' : link}
    </option>
  ))}
</select>
                  )}
                  <input type="text" placeholder="Search Deep Across Forms..." className="ck-input" style={{ flex: 1, minWidth: "200px", background: "#222", color: "#fff", border: "1px solid #444" }} value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}} />
                </div>

                {loading ? <div className="ck-empty-state" style={{color: "#ff914d"}}>Loading logs...</div> : displayedEnergyLogs.length === 0 ? (
                  <div className="ck-empty-state" style={{color: "#888"}}>No hits recorded yet.</div>
                ) : (
                  <>
                  <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px", overflowX: "auto" }}>
                    <table className="ck-table" style={{ color: "#fff", width: "100%", textAlign: "left", minWidth: "600px" }}>
                      <thead style={{ background: "#222" }}>
                        <tr><th style={{padding: "12px"}}>Date</th><th style={{padding: "12px"}}>Time</th><th style={{padding: "12px"}}>Mobile Hit</th><th style={{padding: "12px"}}>Source Link</th><th style={{padding: "12px"}}>API Used</th><th style={{padding: "12px"}}>IP Address</th></tr>
                      </thead>
                      <tbody>
                        {displayedEnergyLogs.map(log => {
                          const d = new Date(log.createdAt);
                          return (
                            <tr key={log._id} style={{ borderBottom: "1px solid #333" }}>
                              <td style={{padding: "12px"}}>{d.toLocaleDateString('en-IN')}</td>
                              <td style={{padding: "12px", color: "#aaa"}}>{d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                              <td style={{padding: "12px", color: "#ff914d", fontWeight: "bold"}}>{log.mobileNumber}</td>
                              {/* 🔥 Truncated to 4 chars with ... */}
<td style={{padding: "12px", maxWidth: "150px"}} title={log.sourceLink}>
  <span style={{background: "#333", padding: "4px 8px", borderRadius: "4px"}}>
    {log.sourceLink?.length > 4 ? log.sourceLink.substring(0, 4) + '...' : (log.sourceLink || "-")}
  </span>
</td>
<td style={{padding: "12px", color: "#aaa", maxWidth: "150px"}} title={log.routeHit}>
  {log.routeHit?.length > 4 ? log.routeHit.substring(0, 4) + '...' : (log.routeHit || "-")}
</td>
                              <td style={{padding: "12px"}}>{log.ipAddress}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(page, totalEnergyPages)}
                  </>
                )}
              </section>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === "categories" && (
              <section className="ck-panel" style={{ background: "#111", border: "1px solid #333" }}>
                <h2 className="ck-panel-title" style={{ color: "#fff" }}>Blog Categories</h2>
                
                <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
                  <input type="text" className="ck-input" placeholder="New Category Name..." value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ background: "#222", color: "#fff", border: "1px solid #444", padding: "10px", borderRadius: "6px", flex: 1, minWidth: "200px" }}/>
                  <button onClick={handleAddCategory} style={{ background: "#ff914d", color: "#000", fontWeight: "bold", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Add Category</button>
                </div>

                <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px", overflowX: "auto" }}>
                    <table className="ck-table" style={{ color: "#fff", width: "100%", textAlign: "left", minWidth: "400px" }}>
                      <thead style={{ background: "#222" }}>
                        <tr><th style={{padding: "12px"}}>Category Name</th><th style={{padding: "12px", width: "100px"}}>Action</th></tr>
                      </thead>
                      <tbody>
                        {categories.map(cat => (
                          <tr key={cat._id} style={{ borderBottom: "1px solid #333" }}>
                            <td style={{padding: "12px"}}>{cat.name}</td>
                            <td style={{padding: "12px"}}><button onClick={() => handleDeleteCategory(cat._id)} style={{background: "transparent", color: "#e74c3c", border: "none", cursor: "pointer"}}>Delete</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </section>
            )}

            {/* BLOGS TAB */}
            {activeTab === "blog" && (
              <section className="ck-panel" style={{ background: "#111", border: "1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                  <h2 className="ck-panel-title" style={{color: "#fff", margin: 0}}>Manage Blogs</h2>
                  {blogView === "list" ? (
                    <button className="ck-btn-sm" style={{background: "#ff914d", color: "#000", fontWeight: "bold", border: "none", padding: "8px 16px", borderRadius: "4px"}} onClick={handleCreateNewBlog}>+ Create New Blog</button>
                  ) : (
                    <button className="ck-btn-sm" style={{background: "#333", color: "#fff", border: "1px solid #555", padding: "8px 16px", borderRadius: "4px"}} onClick={() => setBlogView("list")}>← Back to List</button>
                  )}
                </div>

                {blogView === "list" && (
                  <>
                  <input type="text" placeholder="Search Title or Category..." className="ck-input" style={{ width: "100%", maxWidth: "300px", background: "#222", color: "#fff", border: "1px solid #444", marginBottom: "20px" }} value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}} />
                  {loading ? <p style={{color: "#ff914d"}}>Loading blogs...</p> : displayedBlogs.length === 0 ? <p style={{color: "#888"}}>No blogs found.</p> : (
                    <>
                    <div className="ck-table-wrapper" style={{ border: "1px solid #333", borderRadius: "8px", overflowX: "auto" }}>
                      <table className="ck-table" style={{ color: "#fff", width: "100%", textAlign: "left", minWidth: "500px" }}>
                        <thead style={{ background: "#222" }}>
                          <tr><th style={{padding: "12px"}}>Title</th><th style={{padding: "12px"}}>Category</th><th style={{padding: "12px"}}>Status</th><th style={{padding: "12px"}}>Actions</th></tr>
                        </thead>
                        <tbody>
                          {displayedBlogs.map(blog => (
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
                    {renderPagination(page, totalBlogPages)}
                    </>
                  )}
                  </>
                )}

                {blogView === "form" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                    <div>
                      <label className="ck-label" style={{color: "#aaa"}}>Blog Title</label>
                      <input type="text" className="ck-input" style={{ background: "#222", color: "#fff", border: "1px solid #444", width: "100%", padding: "10px" }} value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                      <div>
                        <label className="ck-label" style={{color: "#aaa"}}>Select Category</label>
                        <select className="ck-input" style={{ background: "#222", color: "#fff", border: "1px solid #444", width: "100%", padding: "10px" }} value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)}>
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
                      <input type="file" accept="image/*" className="ck-input" style={{ padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", width: "100%" }} onChange={(e) => setBlogImageFile(e.target.files[0])} />
                    </div>

                    <div>
                      <label className="ck-label" style={{color: "#aaa"}}>Blog Content</label>
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px", alignItems: "center", padding: "10px", background: "#222", border: "1px solid #444", borderRadius: "8px" }}>
                         <span style={{color: "#fff", fontSize: "14px", fontWeight: "bold"}}>Manual Size:</span>
                         <input 
                            type="number" 
                            placeholder="25"
                            value={customFontSize}
                            onChange={e => setCustomFontSize(e.target.value)}
                            className="ck-input"
                            style={{ width: "70px", background: "#111", color: "#fff", border: "1px solid #555", padding: "6px", textAlign: "center", borderRadius: "4px" }}
                         />
                         <span style={{color: "#aaa", fontSize: "14px"}}>px</span>
                         <button 
                            onClick={applyCustomFontSize}
                            className="ck-btn-sm" 
                            style={{ background: "#ff914d", color: "#000", border: "none", padding: "6px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", marginLeft: "10px" }}>
                            Apply To Selected Text
                         </button>
                      </div>

                      <div style={{ background: "#000", color: "#fff", minHeight: "400px", borderRadius: "8px", overflow: "hidden", marginTop: "10px" }}>
                        <ReactQuill ref={quillRef} theme="snow" value={blogContent} onChange={setBlogContent} modules={modules} formats={formats} style={{ height: "350px" }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "15px", marginTop: "40px", flexWrap: "wrap" }}>
                      <button className="ck-btn" style={{ background: "#333", color: "#fff", border: "1px solid #555", padding: "12px 24px", borderRadius: "6px" }} onClick={() => handleBlogSubmit("draft")} disabled={loading}>Save as Draft</button>
                      <button className="ck-btn" style={{ background: "#ff914d", color: "#000", fontWeight: "bold", padding: "12px 24px", borderRadius: "6px", border: "none" }} onClick={() => handleBlogSubmit("published")} disabled={loading}>Publish Now</button>
                    </div>
                  </div>
                )}
              </section>
            )}

          </main>
        </div>
      </div>
      
      {/* 🚀 BULLETPROOF CSS OVERRIDES FOR QUILL + MOBILE SIDEBAR */}
      <style>{`
        /* 1️⃣ Hardcoded Fix for ReactQuill "Normal" Issue */
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before { content: "12px" !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before { content: "14px" !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before { content: "16px" !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before { content: "18px" !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before { content: "20px" !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before { content: "24px" !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="30px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before { content: "30px" !important; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before { content: "36px" !important; }

        .ql-snow .ql-picker.ql-size .ql-picker-label:not([data-value])::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item:not([data-value])::before { content: "Normal" !important; }

        /* Fix Font Dropdown */
        .ql-snow .ql-picker.ql-font .ql-picker-label:not([data-value])::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item:not([data-value])::before { content: "Sans Serif" !important; }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before { content: "Serif" !important; font-family: serif; }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before { content: "Monospace" !important; font-family: monospace; }
        
        .ql-picker.ql-font .ql-picker-label[data-value="balgin"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="balgin"]::before { content: "Balgin" !important; font-family: "Balgin", sans-serif; }
        .ql-picker.ql-font .ql-picker-label[data-value="arsenal"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="arsenal"]::before { content: "Arsenal" !important; font-family: "Arsenal", sans-serif; }
        
        .ql-editor [style*="font-family: balgin"] { font-family: "Balgin", sans-serif !important; }
        .ql-editor [style*="font-family: arsenal"] { font-family: "Arsenal", sans-serif !important; }

        /* Generic Admin Editor Styling */
        .ql-toolbar.ql-snow { background-color: #111 !important; border: 1px solid #fff !important; border-bottom: 1px solid #444 !important; border-radius: 8px 8px 0 0; }
        .ql-container.ql-snow { background-color: #000 !important; color: #fff !important; border: 1px solid #fff !important; border-top: none !important; border-radius: 0 0 8px 8px; }
        .ql-snow .ql-stroke { stroke: #fff !important; }
        .ql-snow .ql-fill { fill: #fff !important; }
        .ql-snow .ql-picker { color: #fff !important; }
        .ql-snow .ql-picker-options { background-color: #222 !important; color: #fff !important; border: 1px solid #555 !important; }

        /* 📱 🔥 MOBILE RESPONSIVE SIDEBAR CSS 🔥 📱 */
        .ck-sidebar {
          width: 260px;
          min-height: calc(100vh - 60px);
          transition: transform 0.3s ease-in-out;
          flex-shrink: 0;
        }

        .mobile-sidebar-toggle {
          display: none; /* Hidden on desktop */
        }

        @media (max-width: 850px) {
          .mobile-sidebar-toggle {
            display: block; /* Show hamburger on mobile */
          }
          
          .ck-sidebar {
            position: fixed;
            top: 60px; /* Adjust if your header height differs */
            left: 0;
            height: calc(100vh - 60px);
            z-index: 100;
            background: #111 !important;
            transform: translateX(-100%); /* Hidden by default */
            box-shadow: 4px 0 15px rgba(0,0,0,0.8);
          }

          .ck-sidebar.open {
            transform: translateX(0); /* Slide in when open */
          }
          
          .ck-main {
            width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}