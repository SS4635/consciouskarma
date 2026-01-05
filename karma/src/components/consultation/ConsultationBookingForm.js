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
        <p style={{color: '#fff', fontSize: '16px', marginTop: '10px'}}>Your consultation is booked. We will be in touch soon.</p>
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

  const handleProceed = async () => {
    if (currentStep !== effectiveSteps.length - 1 || isPaying) return;
    setIsPaying(true); 

    for (let i = 0; i < effectiveSteps.length; i++) {
      const err = validateStep(effectiveSteps[i]);
      if (err) {
        setIsPaying(false);
        Swal.fire("Missing Information", err, "warning");
        return;
      }
    }

    const finalFormData = JSON.parse(JSON.stringify(formData));
    if (!finalFormData[1]) finalFormData[1] = {};
    if (!finalFormData[1]["Time of Birth"]) finalFormData[1]["Time of Birth"] = "00:00";
    const finalPrice = getNumericPrice(selectedPlan?.price || currentForm.price);

    try {
      const createRes = await fetch(`${API_BASE}/api/pay/create-consultation-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: finalFormData, planName: selectedPlan?.title || currentForm.title, price: finalPrice }),
      });
      const createData = await createRes.json();
      if (!createData.ok) {
        setIsPaying(false);
        Swal.fire("Error", createData.message || "Order creation failed", "error");
        return;
      }

      const options = {
        key: createData.keyId,
        amount: createData.amount,
        currency: "INR",
        name: "Conscious Karma",
        order_id: createData.orderId,
        handler: async function (rzpRes) {
          setIsPaying(true);
          try {
            const verifyRes = await fetch(`${API_BASE}/api/pay/verify-consultation`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...rzpRes, formData, planName: selectedPlan?.title || currentForm.title, price: finalPrice }),
            });
            const verifyData = await verifyRes.json();
            setIsPaying(false); 
            if (verifyData.ok) setShowSuccess(true);
            else throw new Error(verifyData.message);
          } catch (err) {
            setIsPaying(false);
            Swal.fire("Error", err.message, "error");
          }
        },
        modal: { ondismiss: () => setIsPaying(false) },
        prefill: {
          name: formData[1]?.["Name"],
          email: formData[1]?.["Email-id"],
          contact: `${formData[2]?.["Mobile Number"]?.isd}${formData[2]?.["Mobile Number"]?.mobile}`,
        },
        theme: { color: "#ff914d" },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => setIsPaying(false));
      rzp.open();
    } catch (err) {
      setIsPaying(false);
      Swal.fire("Network Error", "Something went wrong.", "error");
    }
  };

  const outerClass = inModal ? "bg-black text-white h-100" : "min-vh-100 bg-black text-white d-flex align-items-center py-5";

  return (
    <div className={`${outerClass} font-arsenal`}>
      {paymentLoaderPortal}
      {typeof document !== 'undefined' ? ReactDOM.createPortal(successOverlay, document.body) : successOverlay}
      
      <style>{`
        .swal2-popup { background: #111 !important; color: #fff !important; border: 2px solid #fb923c !important; border-radius: 16px !important; }
        .swal2-container { z-index: 9999 !important; }
        
        .form-container { max-width: 450px; margin: 0 auto; font-family: "Arsenal", sans-serif; height: 100%; }
        
        /* 🔥 OUTER BORDER: SIRF ISKO RAKHENGE */
        /* 🔥 COMPLETELY FLATTEN INNER FORMS */
.form-card * {
  box-shadow: none !important;
}

.form-card form,
.form-card .card,
.form-card .card-body,
.form-card .inner-card,
.form-card fieldset,
.form-card .form-section {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}

.form-fields > * {
  margin-bottom: 14px;
}

.form-fields > *:last-child {
  margin-bottom: 0;
}

/* MAKE THE CARD A FLEX COLUMN SO margin-top:auto on footer works */
.form-card {
  display: flex;
  flex-direction: column;
  /* height is controlled inline from component: either containerHeight px or 100% */
  width: 100%;
}

        .ck-modal-header { padding: 22px 20px 6px; text-align: center; display: flex; align-items: center; justify-content: center; }
        .ck-modal-title { font-size: 30px !important; font-weight: 400 !important; line-height: 1.2; color: #fff; text-align: center; }

        .form-cards { padding: 16px 20px 18px; flex: 1; display: flex; flex-direction: column; }
        .ck-nav { display: flex; flex-direction:row; justify-content: space-between; align-items: center; margin-top: 24px; width: 100%; }
        .ck-nav-btn { background: none; border: none; color: #ff914d; font-size: 15px; cursor: pointer; padding: 4px 6px; }
        
        .modal-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #000;
  border-top: 1px solid #ff914d;
  margin-top: auto;   /* 🔥 this will now push footer to the bottom of .form-card */
  width: 100%;
}

        .modal-footer .price-btn, .modal-footer .proceed-btn { 
            width: 100% !important; 
            height: 58px; 
            display: flex; align-items: center; justify-content: center; 
            border: none; background: transparent; color: #fff; font-size: 17px;
            margin: 0; padding: 0;
        }
        .modal-footer .price-btn { border-right: 1px solid #ff914d !important; cursor: default; }
        .modal-footer .proceed-btn { border-left: 0px !important; transition: all 0.3s ease; }
        
        @media (max-width: 576px) { 
            .modal-footer { margin-left: 0; margin-right: 0; } 
            .ck-modal-title { font-size: 26px !important; }
        }
      `}</style>

      <div className="container">
        <div className="form-container" style={{ maxWidth: inModal ? (isMobile ? "100%" : "450px") : "450px" }}>
          <div
  className="form-card"
  style={{
    height: containerHeight !== "auto" ? `${containerHeight}px` : "100%"
  }}
  ref={formContainerRef}
>
  
            <div className="ck-modal-header">
              <span className="ck-modal-title">{currentForm.title}</span>
            </div>

            <div className="form-cards flex-grow-1">
              <div className="form-fields flex-grow-1">
                {currentForm.id === 1 && <GeneralInformationForm data={getStepData(1)} onChange={(f, v) => setFieldValue(1, f, v)} showTitle={false} showDateTimePickers={true} />}
                {currentForm.id === 2 && <PrimaryNumberForm data={getStepData(2)} onChange={(f, v) => setFieldValue(2, f, v)} showTitle={false} />}
                {currentForm.id === 3 && <ParallelNumbersForm numbers={getParallelNumbersData()} onChange={handleParallelNumberChange} onAdd={handleAddParallelNumber} onRemove={handleRemoveParallelNumber} onToggle={handleParallelToggle} maxNumbers={3} showTitle={false} />}
                {currentForm.id === 4 && <PreviousNumbersForm numbers={getPreviousNumbersData()} onChange={handlePreviousNumberChange} onAdd={handleAddPreviousNumber} onRemove={handleRemovePreviousNumber} onToggle={handlePreviousToggle} showTitle={false} />}
                {currentForm.id === 5 && (
                  <CompatibilityNumbersForm
                    primaryData={{ ...(getStepData(5)["Mobile Number"] || {}), relationship: getStepData(5)["Relationship with the user"] }}
                    numbers={dynamicNumbers[5] || []}
                    isExtended={isExtendedCompatibility}
                    onPrimaryChange={(val) => { setFieldValue(5, "Mobile Number", { isd: val.isd, mobile: val.mobile }); setFieldValue(5, "Relationship with the user", val.relationship); }}
                    onAdd={() => handleAddNumber(5)}
                    onRemove={(idx) => handleRemoveNumber(5, idx)}
                    onChange={(idx, field, value) => setDynamicNumberValue(5, idx, field, value)}
                  />
                )}
              </div>

              <div className="ck-nav mt-auto">
                <button className="ck-nav-btn" disabled={currentStep === 0} onClick={handlePrev}>‹‹‹ prev</button>
                <button className="ck-nav-btn" disabled={currentStep === effectiveSteps.length - 1} onClick={handleNext}>next ›››</button>
              </div>
            </div>

            <div className="modal-footer">
              <div className="price-btn">₹ {getNumericPrice(selectedPlan?.price || currentForm.price)}</div>
              <button
                className="proceed-btn"
                style={{
                  backgroundColor: canSubmit ? "#ff914d" : "#1a1a1a",
                  color: canSubmit ? "#000" : "#666",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  fontWeight: canSubmit ? "600" : "400"
                }}
                disabled={!canSubmit || isPaying}
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
