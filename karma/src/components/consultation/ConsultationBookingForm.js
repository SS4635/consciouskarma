// src/components/consultation/ConsultationBookingForm.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import GeneralInformationForm from "./forms/GeneralInformationForm1";
import PrimaryNumberForm from "./forms/PrimaryNumberForm";
import ParallelNumbersForm from "./forms/ParallelNumbersForm";
import PreviousNumbersForm from "./forms/PreviousNumbersForm";
import CompatibilityNumbersForm from "./forms/CompatibilityNumbersForm";

export default function ConsultationBookingForm({
  maxSteps = 5,
  selectedPlan = null,
  inModal = false,
  onClose,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUsageType, setSelectedUsageType] = useState({});
  const [formData, setFormData] = useState({});
  const [dynamicNumbers, setDynamicNumbers] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [containerHeight, setContainerHeight] = useState("auto");
  const [isParallelExpanded, setIsParallelExpanded] = useState(false);
  const [isPreviousExpanded, setIsPreviousExpanded] = useState(false);
  const formContainerRef = useRef(null);

  // 🔥 PAYMENT LOADER STATES
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || "https://server.consciouskarma.co";

  const primaryNumberUsageType = formData[2]?.["Usage type"] || "";
  const isExtendedCompatibility = !!selectedPlan?.isExtended;

  const getNumericPrice = (p) => {
    const str = String(p || "");
    return Number(str.replace(/[^0-9.]/g, ""));
  };

  const updateContainerHeight = useCallback(() => {
    if (formContainerRef.current) {
      setContainerHeight("auto");
      setTimeout(() => {
        if (formContainerRef.current) {
          const contentHeight = formContainerRef.current.scrollHeight;
          const hasExpandedParallel = currentStep === 2 && isParallelExpanded;
          const hasExpandedPrevious = currentStep === 3 && isPreviousExpanded;

          const hasWorkFieldsFromState = Object.keys(selectedUsageType).some(
            (key) => {
              const usageType = selectedUsageType[key];
              return usageType === "Work" || usageType === "Both";
            }
          );

          const hasWorkFieldsFromData =
            primaryNumberUsageType === "Work" ||
            primaryNumberUsageType === "Both";

          const hasWorkFields = hasWorkFieldsFromState || hasWorkFieldsFromData;

          const minHeight =
            hasExpandedParallel || hasExpandedPrevious
              ? 700
              : hasWorkFields
              ? 580
              : 500;
          setContainerHeight(Math.max(minHeight, contentHeight));
        }
      }, 0);
    }
  }, [
    currentStep,
    isParallelExpanded,
    isPreviousExpanded,
    selectedUsageType,
    primaryNumberUsageType,
  ]);

  // 🔥 FULL SCREEN BLACK SCREEN LOADER PORTAL
  const paymentLoaderPortal = isPaying && typeof document !== "undefined" ? ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.98)", 
        zIndex: 9999999, 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arsenal, sans-serif",
      }}
    >
      <div
        style={{
          width: 65,
          height: 65,
          border: "6px solid #222",
          borderTop: "6px solid #ff914d", 
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: 20,
        }}
      />
      <div style={{ color: "#fff", fontSize: 20, letterSpacing: '0.5px' }}>
        Processing payment…
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  ) : null;

  const successOverlay = showSuccess ? (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onClick={() => {
        setShowSuccess(false);
        window.location.href = "/consult";
      }}
    >
      <div
        style={{
          animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#000',
          border: '2px solid #ff914d',
          borderRadius: '16px',
          padding: '32px 28px',
          width: '90%',
          maxWidth: '420px',
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '20px'}}>
          <circle cx="12" cy="12" r="11" stroke="#ff914d" strokeWidth="2" fill="transparent"/>
          <path d="M7 12L10 15L17 8" stroke="#ff914d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 style={{color: '#fff', fontSize: '24px', fontFamily: 'Arsenal, sans-serif', fontWeight: 'bold', textAlign: 'center'}}>Success</h2>
        <p style={{color: '#fff', fontSize: '16px', marginTop: '10px'}}>Your consultation is booked. <br/> We will be in touch soon.</p>
        <button
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: '#ff914d',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            fontSize: 20,
            cursor: 'pointer',
          }}
          onClick={() => {
            setShowSuccess(false);
            window.location.href = "/consult";
          }}
          aria-label="Close"
        >×</button>
      </div>
      <style>{`
            @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  ) : null;

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 576);
      updateContainerHeight();
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateContainerHeight]);

  useEffect(() => {
    updateContainerHeight();
  }, [currentStep, dynamicNumbers, selectedUsageType, updateContainerHeight]);

  useEffect(() => {
    if (primaryNumberUsageType) {
      updateContainerHeight();
    }
  }, [primaryNumberUsageType, updateContainerHeight]);

  useEffect(() => {
    if (currentStep !== 2) setIsParallelExpanded(false);
    if (currentStep !== 3) setIsPreviousExpanded(false);
  }, [currentStep]);

  const setFieldValue = (stepId, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: { ...(prev[stepId] || {}), [key]: value },
    }));
  };

  const getStepData = (stepId) => formData[stepId] || {};

  const handleAddNumber = (stepId) => {
    const base =
      stepId === 3
        ? { isd: "+91", mobile: "", since: ["", ""], usageType: "", lineOfWork: "", role: "" }
        : stepId === 4
        ? { isd: "+91", mobile: "", usedSince: ["", ""], usedTill: ["", ""], usageType: "", lineOfWork: "", role: "" }
        : { isd: "", mobile: "" };

    setDynamicNumbers((prev) => {
      const arr = prev[stepId] || [];
      if ((stepId === 3 || stepId === 4) && arr.length >= 3) return prev;
      return { ...prev, [stepId]: [...arr, base] };
    });

    setFormData((prev) => {
      const arr = prev[stepId]?.dynamicNumbers || [];
      if ((stepId === 3 || stepId === 4) && arr.length >= 3) return prev;
      return {
        ...prev,
        [stepId]: { ...(prev[stepId] || {}), dynamicNumbers: [...arr, base] },
      };
    });
  };

  const setDynamicNumberValue = (stepId, idx, field, value) => {
    setDynamicNumbers((prev) => {
      const arr = prev[stepId] ? [...prev[stepId]] : [];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [stepId]: arr };
    });
    setFormData((prev) => {
      const arr = prev[stepId]?.dynamicNumbers ? [...prev[stepId].dynamicNumbers] : [];
      arr[idx] = { ...arr[idx], [field]: value };
      return {
        ...prev,
        [stepId]: { ...(prev[stepId] || {}), dynamicNumbers: arr },
      };
    });
  };

  const handleRemoveNumber = (stepId, idx) => {
    setDynamicNumbers((prev) => {
      const arr = prev[stepId] ? [...prev[stepId]] : [];
      arr.splice(idx, 1);
      return { ...prev, [stepId]: arr };
    });
    setFormData((prev) => {
      const arr = prev[stepId]?.dynamicNumbers ? [...prev[stepId].dynamicNumbers] : [];
      arr.splice(idx, 1);
      return {
        ...prev,
        [stepId]: { ...(prev[stepId] || {}), dynamicNumbers: arr },
      };
    });
  };

  const getParallelNumbersData = () => {
    const parallelData = dynamicNumbers[3] || [];
    return parallelData.map((num) => ({
      isd: num.isd,
      number: num.mobile,
      sinceMonth: num.since?.[0] || "",
      sinceYear: num.since?.[1] || "",
      usageType: num.usageType,
      lineOfWork: num.lineOfWork,
      role: num.role,
    }));
  };

  const handleParallelNumberChange = (index, field, value) => {
    if (field === "number") setDynamicNumberValue(3, index, "mobile", value);
    else if (field === "sinceMonth") {
      const currentNum = dynamicNumbers[3]?.[index] || {};
      const since = currentNum.since || ["", ""];
      setDynamicNumberValue(3, index, "since", [value, since[1]]);
    } else if (field === "sinceYear") {
      const currentNum = dynamicNumbers[3]?.[index] || {};
      const since = currentNum.since || ["", ""];
      setDynamicNumberValue(3, index, "since", [since[0], value]);
    } else {
      setDynamicNumberValue(3, index, field, value);
    }
  };

  const handleAddParallelNumber = () => handleAddNumber(3);
  const handleRemoveParallelNumber = (index) => {
    handleRemoveNumber(3, index);
    const remaining = (dynamicNumbers[3] || []).length - 1;
    if (remaining === 0) setIsParallelExpanded(false);
  };
  const handleParallelToggle = (isExpanded) => setIsParallelExpanded(isExpanded);
  const handlePreviousToggle = (isExpanded) => setIsPreviousExpanded(isExpanded);

  const getPreviousNumbersData = () => {
    const previousData = dynamicNumbers[4] || [];
    return previousData.map((num) => ({
      isd: num.isd,
      number: num.mobile,
      usedSinceMonth: num.usedSince?.[0] || "",
      usedSinceYear: num.usedSince?.[1] || "",
      usedTillMonth: num.usedTill?.[0] || "",
      usedTillYear: num.usedTill?.[1] || "",
      usageType: num.usageType,
      lineOfWork: num.lineOfWork,
      role: num.role,
    }));
  };

  const handlePreviousNumberChange = (index, field, value) => {
    if (field === "number") setDynamicNumberValue(4, index, "mobile", value);
    else if (field === "usedSinceMonth") {
      const currentNum = dynamicNumbers[4]?.[index] || {};
      const usedSince = currentNum.usedSince || ["", ""];
      setDynamicNumberValue(4, index, "usedSince", [value, usedSince[1]]);
    } else if (field === "usedSinceYear") {
      const currentNum = dynamicNumbers[4]?.[index] || {};
      const usedSince = currentNum.usedSince || ["", ""];
      setDynamicNumberValue(4, index, "usedSince", [usedSince[0], value]);
    } else if (field === "usedTillMonth") {
      const currentNum = dynamicNumbers[4]?.[index] || {};
      const usedTill = currentNum.usedTill || ["", ""];
      setDynamicNumberValue(4, index, "usedTill", [value, usedTill[1]]);
    } else if (field === "usedTillYear") {
      const currentNum = dynamicNumbers[4]?.[index] || {};
      const usedTill = currentNum.usedTill || ["", ""];
      setDynamicNumberValue(4, index, "usedTill", [usedTill[0], value]);
    } else {
      setDynamicNumberValue(4, index, field, value);
    }
  };

  const handleAddPreviousNumber = () => handleAddNumber(4);
  const handleRemovePreviousNumber = (index) => {
    handleRemoveNumber(4, index);
    const remaining = (dynamicNumbers[4] || []).length - 1;
    if (remaining === 0) setIsPreviousExpanded(false);
  };

  const formSteps = [
    {
      id: 1,
      title: "General Information",
      price: process.env.REACT_APP_PLAN_1_PRICE || " ₹2000",
      fields: [],
    },
    {
      id: 2,
      title: "Primary Number",
      price: process.env.REACT_APP_PLAN_1_PRICE || " ₹2000",
      fields: [],
    },
    {
      id: 3,
      title: "Parallel Number",
      price: process.env.REACT_APP_PLAN_1_PRICE || " ₹2000",
      fields: [],
    },
    {
      id: 4,
      title: "Previous Number",
      price: process.env.REACT_APP_PLAN_1_PRICE || " ₹2000",
      fields: [],
    },
    {
      id: 5,
      title: "Compatibility Numbers",
      price: selectedPlan?.price || process.env.REACT_APP_PLAN_2_PRICE || " ₹2500",
      fields: [],
    },
  ];

  const effectiveSteps = formSteps.slice(0, maxSteps);
  const currentForm = effectiveSteps[currentStep];
  const isLastStep = currentStep === effectiveSteps.length - 1;

  const validateStep = (step) => {
    const data = getStepData(step.id);
    const requireField = (key, label) => {
      const v = data[key];
      if (v == null || v === "" || (Array.isArray(v) && v.some((x) => !x))) {
        return `Please fill "${label}".`;
      }
      return null;
    };

    switch (step.id) {
      case 1: {
        let err =
          requireField("Name", "Name") ||
          requireField("Gender", "Gender") ||
          requireField("Place of Birth", "Place of Birth") ||
          requireField("Email-id", "Email-id");
        if (err) return err;
        if (!data["Date of Birth"]) return "Please fill Date of Birth.";
        return null;
      }
      case 2: {
        const m = data["Mobile Number"] || {};
        const isd = m.isd || "+91";
        if (!isd || !m.mobile) return "Please fill ISD and Mobile Number in Primary Number.";
        const since = data["Using this number since"] || [];
        if (!since[0] || !since[1]) return "Please select Month and Year for 'Using this number since'.";
        if (!data["Usage type"]) return "Please select Usage type.";
        if (
          (data["Usage type"] === "Work" || data["Usage type"] === "Both") &&
          !String(data["Line of Work"] || "").trim()
        )
          return "Please fill Line of Work.";
        if (!String(data["Role"] || "").trim()) return "Please fill Role.";
        return null;
      }
      case 3: {
        const dyn = data.dynamicNumbers || [];
        for (let i = 0; i < dyn.length; i++) {
          const d = dyn[i];
          if (!d.isd || !d.mobile) return `Please fill ISD and Mobile for Parallel Number #${i + 1}.`;
          const s = d.since || [];
          if (!s[0] || !s[1]) return `Please select Month and Year for Parallel Number #${i + 1}.`;
          if (!d.usageType) return `Please select Usage type for Parallel Number #${i + 1}.`;
          if (
            (d.usageType === "Work" || d.usageType === "Both") &&
            !String(d.lineOfWork || "").trim()
          )
            return `Please fill Line of Work for Parallel Number #${i + 1}.`;
          if (!String(d.role || "").trim()) return `Please fill Role for Parallel Number #${i + 1}.`;
        }
        return null;
      }
      case 4: {
        const dyn = data.dynamicNumbers || [];
        for (let i = 0; i < dyn.length; i++) {
          const d = dyn[i];
          if (!d.isd || !d.mobile) return `Please fill ISD and Mobile for Previous Number #${i + 1}.`;
          const us = d.usedSince || [];
          const ut = d.usedTill || [];
          if (!us[0] || !us[1]) return `Please select Used Since for Previous Number #${i + 1}.`;
          if (!ut[0] || !ut[1]) return `Please select Used Till for Previous Number #${i + 1}.`;
          if (!d.usageType) return `Please select Usage type for Previous Number #${i + 1}.`;
          if (
            (d.usageType === "Work" || d.usageType === "Both") &&
            !String(d.lineOfWork || "").trim()
          )
            return `Please fill Line of Work for Previous Number #${i + 1}.`;
          if (!String(d.role || "").trim()) return `Please fill Role for Previous Number #${i + 1}.`;
        }
        return null;
      }
      case 5: {
        const m = data["Mobile Number"] || {};
        const isd = m.isd || "+91";
        if (!isd || !m.mobile) return "Please fill Compatibility Mobile Number.";
        if (!String(data["Relationship with the user"] || "").trim())
          return "Please fill Relationship with the user.";
        if (isExtendedCompatibility) {
          const dyn = data.dynamicNumbers || [];
          for (let i = 0; i < dyn.length; i++) {
            const d = dyn[i];
            if (!d.isd || !d.mobile) return `Please fill ISD and Mobile for extra Compatibility Number #${i + 1}.`;
          }
        }
        return null;
      }
      default:
        return null;
    }
  };

  const checkAllStepsValid = () => {
    for (let i = 0; i < effectiveSteps.length; i++) {
      if (validateStep(effectiveSteps[i])) return false; 
    }
    return true; 
  };

  const isFormValid = checkAllStepsValid();
  const canSubmit = isLastStep && isFormValid;

  const handleNext = () => {
    if (currentStep >= effectiveSteps.length - 1) return;
    setCurrentStep((s) => s + 1);
  };
  const handlePrev = () => {
    if (currentStep === 0) return;
    setCurrentStep((s) => s - 1);
  };
// --- Naye States add karein ---
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- Error Overlay Design ---
  const errorOverlay = showError ? (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={() => setShowError(false)}
    >
      <div
        style={{
          animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#000',
          border: '2px solid #ff914d', // Error ke liye Red color use kiya hai
          borderRadius: '16px',
          padding: '32px 28px',
          width: '90%',
          maxWidth: '420px',
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Error (Cross) Icon */}
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '20px'}}>
          <circle cx="12" cy="12" r="11" stroke="#ff914d" strokeWidth="2" fill="transparent"/>
          <path d="M15 9L9 15M9 9L15 15" stroke="#ff914d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 style={{color: '#fff', fontSize: '24px', fontFamily: 'Arsenal, sans-serif', fontWeight: 'bold'}}>Missing Information</h2>
        <p style={{color: '#ccc', fontSize: '16px', marginTop: '10px', fontFamily: 'Arsenal, sans-serif'}}>{errorMsg}</p>
        <button
          style={{
            marginTop: '20px',
            background: '#ff914d',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 25px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onClick={() => setShowError(false)}
        >
          Got it
        </button>
      </div>
    </div>
  ) : null;
  const handleProceed = async () => {
    if (isPaying) return; 

    // 1. Sabhi steps ka validation loop (Ye hamesha Step 1 se check karega)
    for (let i = 0; i < effectiveSteps.length; i++) {
      const err = validateStep(effectiveSteps[i]);
      if (err) {
        setErrorMsg(err);
        setShowError(true);
        
        // Galti wale page par automatic move ho jayega
        setCurrentStep(i); 
        
        setIsPaying(false); 
        return; 
      }
    }
    // 3. DATA PREPARATION (Agar validation pass ho gayi)
    setIsPaying(true); 

    const finalFormData = JSON.parse(JSON.stringify(formData));
    // Default values for missing optional fields
    if (!finalFormData[1]) finalFormData[1] = {};
    if (!finalFormData[1]["Time of Birth"]) finalFormData[1]["Time of Birth"] = "00:00";
    
    const finalPrice = getNumericPrice(selectedPlan?.price || currentForm.price);

    try {
      // 4. CREATE ORDER API CALL
      const createRes = await fetch(`${API_BASE}/api/pay/create-consultation-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          formData: finalFormData, 
          planName: selectedPlan?.title || currentForm.title, 
          price: finalPrice 
        }),
      });
      
      const createData = await createRes.json();
      
      if (!createData.ok) {
        setIsPaying(false);
        setErrorMsg(createData.message || "Order creation failed. Please try again.");
        setShowError(true);
        return;
      }

      // 5. RAZORPAY CONFIGURATION
      const options = {
        key: createData.keyId,
        amount: createData.amount,
        currency: "INR",
        name: "Conscious Karma",
        description: "Consultation Booking",
        order_id: createData.orderId,
        
        handler: async function (rzpRes) {
          // Jab payment gateway success response de
          setIsPaying(true); 
          try {
            // VERIFY PAYMENT API CALL
            const verifyRes = await fetch(`${API_BASE}/api/pay/verify-consultation`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                ...rzpRes, 
                formData: finalFormData, 
                planName: selectedPlan?.title || currentForm.title, 
                price: finalPrice 
              }),
            });
            
            const verifyData = await verifyRes.json();
            setIsPaying(false); 
            
            if (verifyData.ok) {
              // Success Popup trigger
              setShowSuccess(true);
            } else {
              throw new Error(verifyData.message || "Payment verification failed");
            }
          } catch (err) {
            setIsPaying(false);
            Swal.fire("Payment Verification Failed", err.message, "error");
          }
        },
        
        modal: { 
          ondismiss: () => setIsPaying(false) 
        },
        
        prefill: {
          name: finalFormData[1]?.["Name"],
          email: finalFormData[1]?.["Email-id"],
          contact: `${finalFormData[2]?.["Mobile Number"]?.isd}${finalFormData[2]?.["Mobile Number"]?.mobile}`,
        },
        
        theme: { color: "#ff914d" },
      };

      // 6. OPEN RAZORPAY
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setIsPaying(false);
        Swal.fire("Payment Failed", "Transaction could not be completed.", "error");
      });
      rzp.open();

    } catch (err) {
      setIsPaying(false);
      setErrorMsg("Network Error: Could not connect to the server.");
      setShowError(true);
    }
  };
  const outerClass = inModal ? "bg-black text-white h-100" : "min-vh-100 bg-black text-white d-flex align-items-center py-5";

  return (
    <div className={`${outerClass} font-arsenal`}>
      {paymentLoaderPortal}
      {typeof document !== 'undefined' ? ReactDOM.createPortal(successOverlay, document.body) : successOverlay}
      {typeof document !== 'undefined' && ReactDOM.createPortal(errorOverlay, document.body)}
      <style>{`
        .container{
          padding: 0;
        }
        .swal2-popup { background: #111 !important; color: #fff !important; border: 2px solid #fb923c !important; border-radius: 16px !important; }
        .swal2-container { z-index: 9999 !important; }
        
        .form-container { max-width: 450px; margin: 0 auto; font-family: "Arsenal", sans-serif; height: 100%; }
        
        .form-card {
  max-height: 35rem;                 /* ✅ fills modal height */
  display: flex;
  flex-direction: column;
  border: 1px solid #ff914d;
  border-radius: 16px;
  overflow: hidden;             /* ✅ clips footer/header correctly */
  background: #000;
  height: 34rem;
}

.ck-modal-header {
  flex: 0 0 auto;
  padding: 22px 20px 1px;
  text-align: center;
}

.ck-modal-title {
  font-size: 30px !important;
  font-weight: 400 !important;
  color: #fff;
}

.ck-scroll-body {
  flex: 1 1 auto;
  min-height: 0;                /* ✅ REQUIRED for flex scroll */
  overflow-y: scroll;           /* ✅ “scroll by default” */
  padding: 16px 20px 1px;
  scrollbar-gutter: stable;     /* prevents layout shift when scrollbar appears */
}

/* Optional: thin orange scrollbar */
.ck-scroll-body {
  scrollbar-width: thin;
  scrollbar-color: #ff914d #000;
}
.ck-scroll-body::-webkit-scrollbar { width: 4px; }
.ck-scroll-body::-webkit-scrollbar-track { background: #000; }
.ck-scroll-body::-webkit-scrollbar-thumb { background: #ff914d; border-radius: 4px; }

.ck-nav {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 7px 20px;

  background: #000;
}

.ck-nav-btn {
  background: none;
  border: none;
  color: #ff914d;
  font-size: 15px;
  cursor: pointer;
  padding: 4px 6px;
}
.ck-nav-btn:disabled {
  color: #666;
  cursor: not-allowed;
}

.modal-footer {
  flex: 0 0 58px;               /* ✅ fixed footer height */
  display: flex;
  border-top: 2px solid #ff914d;
  background: #000;
}

.modal-footer .price-btn,
.modal-footer .proceed-btn {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 25px;
}

.modal-footer .price-btn {
  border-right: 1px solid #ff914d;
  color: #fff;
}

.modal-footer .proceed-btn {
  border: none;
}

.proceed-btn {
  background-color: #000;      /* black bg */
  color: #fff;              /* orange text */
  cursor: pointer;
  font-weight: 500;
  font-size: 25px;
  border: 2px solid #ff914d;
  transition: all 0.25s ease;
}

.proceed-btn:hover:not(:disabled) {
  background-color: #ff914d;   /* orange bg on hover */
  color: #000;                 /* black text on hover */
}

.proceed-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


      `}</style>

      <div className="container">
        <div className="form-container" style={{ maxWidth: inModal ? (isMobile ? "100%" : "450px") : "450px" }}>
          
         <div className="form-card" ref={formContainerRef}>
  {/* Header (fixed) */}
  <div className="ck-modal-header">
    <span className="ck-modal-title">{currentForm.title}</span>
  </div>

  {/* Scrollable body ONLY */}
  <div className="ck-scroll-body">
    <div className="form-fields">
      {currentForm.id === 1 && (
        <GeneralInformationForm
          data={getStepData(1)}
          onChange={(f, v) => setFieldValue(1, f, v)}
          showTitle={false}
          showDateTimePickers={true}
        />
      )}

      {currentForm.id === 2 && (
        <PrimaryNumberForm
          data={getStepData(2)}
          onChange={(f, v) => setFieldValue(2, f, v)}
          showTitle={false}
        />
      )}

      {currentForm.id === 3 && (
        <ParallelNumbersForm
          numbers={getParallelNumbersData()}
          onChange={handleParallelNumberChange}
          onAdd={handleAddParallelNumber}
          onRemove={handleRemoveParallelNumber}
          onToggle={handleParallelToggle}
          maxNumbers={3}
          showTitle={false}
        />
      )}

      {currentForm.id === 4 && (
        <PreviousNumbersForm
          numbers={getPreviousNumbersData()}
          onChange={handlePreviousNumberChange}
          onAdd={handleAddPreviousNumber}
          onRemove={handleRemovePreviousNumber}
          onToggle={handlePreviousToggle}
          showTitle={false}
        />
      )}

      {currentForm.id === 5 && (
        <CompatibilityNumbersForm
          primaryData={{
            ...(getStepData(5)["Mobile Number"] || {}),
            relationship: getStepData(5)["Relationship with the user"],
          }}
          numbers={dynamicNumbers[5] || []}
          isExtended={isExtendedCompatibility}
          onPrimaryChange={(val) => {
            setFieldValue(5, "Mobile Number", { isd: val.isd, mobile: val.mobile });
            setFieldValue(5, "Relationship with the user", val.relationship);
          }}
          onAdd={() => handleAddNumber(5)}
          onRemove={(idx) => handleRemoveNumber(5, idx)}
          onChange={(idx, field, value) => setDynamicNumberValue(5, idx, field, value)}
        />
      )}
    </div>
  </div>

  {/* Prev / Next (fixed) */}
  <div className="ck-nav">
    <button className="ck-nav-btn" disabled={currentStep === 0} onClick={handlePrev}>
      ‹‹‹ prev
    </button>
    <button
      className="ck-nav-btn"
      disabled={currentStep === effectiveSteps.length - 1}
      onClick={handleNext}
    >
      next ›››
    </button>
  </div>

  {/* Footer (fixed) */}
  <div className="modal-footer">
        <div className="price-btn">₹ {getNumericPrice(selectedPlan?.price || currentForm.price)}</div>
<button
  className="proceed-btn"
  disabled={isPaying}
  onClick={handleProceed}
>
  {isPaying ? "Processing..." : "Proceed"}
</button>

      </div>
    </div>
        </div>
      </div>
    </div>
  );
}