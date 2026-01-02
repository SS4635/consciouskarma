// src/ConsultationBookingForm.js
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

export default function ConsultationBookingForm({
  maxSteps = 6,
  selectedPlan = null,
  inModal = false,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUsageType, setSelectedUsageType] = useState({});
  const [formData, setFormData] = useState({});
  const [dynamicNumbers, setDynamicNumbers] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [containerHeight, setContainerHeight] = useState("auto");
  const formContainerRef = useRef(null);

  const API_BASE = "https://server.consciouskarma.co";

  // months & years for dropdowns
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 40 }, (_, i) => 2000 + i);

  // detect mobile width and update container height
  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 576);
      updateContainerHeight();
    };
    
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Update container height when step changes or dynamic numbers change
  useEffect(() => {
    updateContainerHeight();
  }, [currentStep, dynamicNumbers]);

  const updateContainerHeight = () => {
    if (formContainerRef.current) {
      const contentHeight = formContainerRef.current.scrollHeight;
      // Set minimum height based on first slide, otherwise use content height
      const minHeight = 500; // Adjust this value based on your first slide height
      setContainerHeight(Math.max(minHeight, contentHeight));
    }
  };

  const setFieldValue = (stepId, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        [key]: value,
      },
    }));
  };

  const getStepData = (stepId) => formData[stepId] || {};

  // Add a new number input for a step
  const handleAddNumber = (stepId) => {
    // Different base object for Parallel (3) / Previous (4) vs others
    const base =
      stepId === 3
        ? {
            isd: "+91",
            mobile: "",
            since: ["", ""], // [month, year]
            usageType: "",
            lineOfWork: "",
            role: "",
          }
        : stepId === 4
        ? {
            isd: "+91",
            mobile: "",
            usedSince: ["", ""], // [month, year]
            usedTill: ["", ""], // [month, year]
            usageType: "",
            lineOfWork: "",
            role: "",
          }
        : {
            isd: "",
            mobile: "",
          };

    setDynamicNumbers((prev) => {
      const arr = prev[stepId] || [];
      if (arr.length >= 3) return prev;
      return { ...prev, [stepId]: [...arr, base] };
    });

    setFormData((prev) => {
      const arr = prev[stepId]?.dynamicNumbers || [];
      if (arr.length >= 3) return prev;
      return {
        ...prev,
        [stepId]: {
          ...(prev[stepId] || {}),
          dynamicNumbers: [...arr, base],
        },
      };
    });
  };

  const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [otpVerified, setOtpVerified] = useState(false);

  // Update a dynamic number input
  const setDynamicNumberValue = (stepId, idx, field, value) => {
    setDynamicNumbers((prev) => {
      const arr = prev[stepId] ? [...prev[stepId]] : [];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [stepId]: arr };
    });
    setFormData((prev) => {
      const arr = prev[stepId]?.dynamicNumbers
        ? [...prev[stepId].dynamicNumbers]
        : [];
      arr[idx] = { ...arr[idx], [field]: value };
      return {
        ...prev,
        [stepId]: {
          ...(prev[stepId] || {}),
          dynamicNumbers: arr,
        },
      };
    });
  };

  // Remove a dynamic number input
  const handleRemoveNumber = (stepId, idx) => {
    setDynamicNumbers((prev) => {
      const arr = prev[stepId] ? [...prev[stepId]] : [];
      arr.splice(idx, 1);
      return { ...prev, [stepId]: arr };
    });
    setFormData((prev) => {
      const arr = prev[stepId]?.dynamicNumbers
        ? [...prev[stepId].dynamicNumbers]
        : [];
      arr.splice(idx, 1);
      return {
        ...prev,
        [stepId]: {
          ...(prev[stepId] || {}),
          dynamicNumbers: arr,
        },
      };
    });
  };

  const formSteps = [
    {
      id: 1,
      title: "General Information",
      price: " ₹2000",
      fields: [
        { label: "Name", type: "text", placeholder: "ABCXYZ" },
        {
          label: "Gender",
          type: "button-group",
          options: ["Female", "Male", "Other"],
        },
        {
          label: "Age",
          type: "double-input",
          placeholders: ["Years+", "Months+"],
        },
        {
          label: "Email-id",
          type: "email",
          placeholder: "abc@gmail.com",
          additionalText: "Create account",
        },
      ],
    },
    {
      id: 2,
      title: "Primary Number",
      price: " ₹2000",
      fields: [
        {
          label: "Mobile Number",
          type: "isd-mobile",
          placeholders: ["ISD", "Mobile Number"],
        },
        {
          label: "Using this number since",
          type: "double-input",
          placeholders: ["Month", "Year"],
        },
        {
          label: "Usage type",
          type: "button-group",
          options: ["Personal", "Work", "Both"],
        },
        {
          label: "Line of Work",
          type: "text",
          placeholder: "IT, Finance, Marketing, Public-relations, etc.",
        },
        {
          label: "Role",
          type: "text",
          placeholder: "Student, Shop Keeper, Accountant, etc.",
        },
      ],
    },
    {
      id: 3,
      title: "Parallel Number",
      price: " ₹2000",
      fields: [
        {
          label: "Add Number",
          type: "button",
          placeholder: "Add Number",
          additionalText: "If any",
        },
      ],
    },
    {
      id: 4,
      title: "Previous Number",
      price: " ₹2000",
      fields: [
        {
          label: "Add Number",
          type: "button",
          placeholder: "Add Number",
          additionalText: "If any",
        },
      ],
    },
    {
      id: 5,
      title: "Compatibility Numbers",
      price: " ₹2500",
      fields: [
        {
          label: "Mobile Number",
          type: "isd-mobile",
          placeholders: ["ISD", "mobile number"],
        },
        {
          label: "Relationship with the user",
          type: "text",
          placeholder: "spouse, partner",
        },
      ],
    },
    {
      id: 6,
      title: "Compatibility Numbers",
      price: " ₹3000",
      fields: [
        {
          label: "Mobile Number",
          type: "isd-mobile",
          placeholders: ["ISD", "mobile number"],
        },
        {
          label: "Relationship with the user",
          type: "text",
          placeholder: "spouse, partner",
        },
        {
          label: "Add Number",
          type: "button",
          placeholder: "Add Number",
          additionalText: "If any",
        },
        {
          label: "Add Number",
          type: "button",
          placeholder: "Add Number",
          additionalText: "If any",
        },
        {
          label: "Add Number",
          type: "button",
          placeholder: "Add Number",
          additionalText: "If any",
        },
      ],
    },
  ];

  const effectiveSteps = formSteps.slice(0, maxSteps);
  const currentForm = effectiveSteps[currentStep];

  // ---------- VALIDATION PER STEP ----------
  const validateStep = (step) => {
    const data = getStepData(step.id);

    const requireField = (key, label) => {
      const v = data[key];
      if (
        v == null ||
        v === "" ||
        (Array.isArray(v) && v.some((x) => !x))
      ) {
        return `Please fill "${label}".`;
      }
      return null;
    };

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    switch (step.id) {
      case 1: {
        let err =
          requireField("Name", "Name") ||
          requireField("Gender", "Gender") ||
          requireField("Age", "Age (Years and Months)") ||
          requireField("Email-id", "Email-id");
        if (err) return err;
        if (!emailRegex.test(String(data["Email-id"] || "").trim())) {
          return "Please enter a valid Email-id.";
        }
        return null;
      }

      case 2: {
        const m = data["Mobile Number"] || {};
        const isd = m.isd || "+91";
        if (!isd || !m.mobile) {
          return "Please fill ISD and Mobile Number in Primary Number.";
        }
        const since = data["Using this number since"] || [];
        if (!since[0] || !since[1]) {
          return "Please select Month and Year for 'Using this number since'.";
        }
        if (!data["Usage type"]) {
          return "Please select Usage type.";
        }
        if (
          (data["Usage type"] === "Work" ||
            data["Usage type"] === "Both") &&
          !String(data["Line of Work"] || "").trim()
        ) {
          return "Please fill Line of Work.";
        }
        if (!String(data["Role"] || "").trim()) {
          return "Please fill Role.";
        }
        return null;
      }

      case 3: {
        const dyn = data.dynamicNumbers || [];
        if (dyn.length === 0) {
          // Parallel optional; if no numbers added, it's fine
          return null;
        }
        for (let i = 0; i < dyn.length; i++) {
          const d = dyn[i];
          if (!d.isd || !d.mobile) {
            return `Please fill ISD and Mobile Number for Parallel Number #${i + 1}.`;
          }
          const s = d.since || [];
          if (!s[0] || !s[1]) {
            return `Please select Month and Year for 'Using this number since' for Parallel Number #${i + 1}.`;
          }
          if (!d.usageType) {
            return `Please select Usage type for Parallel Number #${i + 1}.`;
          }
          if (
            (d.usageType === "Work" || d.usageType === "Both") &&
            !String(d.lineOfWork || "").trim()
          ) {
            return `Please fill Line of Work for Parallel Number #${i + 1}.`;
          }
          if (!String(d.role || "").trim()) {
            return `Please fill Role for Parallel Number #${i + 1}.`;
          }
        }
        return null;
      }

      case 4: {
        const dyn = data.dynamicNumbers || [];
        if (dyn.length === 0) {
          // Previous numbers optional
          return null;
        }
        for (let i = 0; i < dyn.length; i++) {
          const d = dyn[i];
          if (!d.isd || !d.mobile) {
            return `Please fill ISD and Mobile Number for Previous Number #${i + 1}.`;
          }
          const us = d.usedSince || [];
          const ut = d.usedTill || [];
          if (!us[0] || !us[1]) {
            return `Please select Month and Year for 'Used since' for Previous Number #${i + 1}.`;
          }
          if (!ut[0] || !ut[1]) {
            return `Please select Month and Year for 'Used till' for Previous Number #${i + 1}.`;
          }
          if (!d.usageType) {
            return `Please select Usage type for Previous Number #${i + 1}.`;
          }
          if (
            (d.usageType === "Work" || d.usageType === "Both") &&
            !String(d.lineOfWork || "").trim()
          ) {
            return `Please fill Line of Work for Previous Number #${i + 1}.`;
          }
          if (!String(d.role || "").trim()) {
            return `Please fill Role for Previous Number #${i + 1}.`;
          }
        }
        return null;
      }

      case 5: {
        const m = data["Mobile Number"] || {};
        const isd = m.isd || "+91";
        if (!isd || !m.mobile) {
          return "Please fill Mobile Number.";
        }
        if (!String(data["Relationship with the user"] || "").trim()) {
          return "Please fill Relationship with the user.";
        }
        return null;
      }

      case 6: {
        const m = data["Mobile Number"] || {};
        const isd = m.isd || "+91";
        if (!isd || !m.mobile) {
          return "Please fill Mobile Number.";
        }
        if (!String(data["Relationship with the user"] || "").trim()) {
          return "Please fill Relationship with the user.";
        }
        const dyn = data.dynamicNumbers || [];
        for (let i = 0; i < dyn.length; i++) {
          const d = dyn[i];
          if (!d.isd || !d.mobile) {
            return `Please fill ISD and Mobile for extra Compatibility Number #${i + 1}.`;
          }
        }
        return null;
      }

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep >= effectiveSteps.length - 1) return;
    const err = validateStep(currentForm);
    if (err) {
      Swal.fire({
        title: "Missing Information",
        text: err,
        icon: "warning",
      });
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (currentStep === 0) return;
    setCurrentStep((s) => s - 1);
  };

  const handleProceed = async () => {
  const err = validateStep(currentForm);
  if (err) {
    Swal.fire("Missing Information", err, "warning");
    return;
  }

  if (currentStep !== effectiveSteps.length - 1) return;

  try {
    // 🌟 1️⃣ CREATE ORDER (NO Razorpay IDs yet)
    const createRes = await fetch(`${API_BASE}/api/pay/create-consultation-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formData,
        planName: selectedPlan?.title || currentForm.title,
        price: Number((selectedPlan?.price || currentForm.price).replace(/[^\d]/g, ""))

      }),
    });

    const createData = await createRes.json();

    if (!createData.ok) {
      Swal.fire("Error", createData.message || "Order creation failed", "error");
      return;
    }

    const { keyId, orderId, amount } = createData;

    // 🌟 2️⃣ OPEN RAZORPAY POPUP
    const options = {
      key: keyId,
      amount,
      currency: "INR",
      name: "Conscious Karma",
      description: "Consultation Booking",
      order_id: orderId,

      handler: async function (rzpRes) {
        // 🌟 3️⃣ VERIFY PAYMENT (NOW Razorpay IDs available)
        const verifyRes = await fetch(`${API_BASE}/api/pay/verify-consultation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: rzpRes.razorpay_order_id,
            razorpay_payment_id: rzpRes.razorpay_payment_id,
            razorpay_signature: rzpRes.razorpay_signature,

            // extra data to save with consultation
            formData,
            planName: selectedPlan?.title || currentForm.title,
            price: selectedPlan?.price || currentForm.price,
          }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.ok) {
          Swal.fire("Payment Error", verifyData.message || "Verification failed", "error");
          return;
        }

        Swal.fire(
          "Success",
          "Success! Your consultation is booked. We will be in touch soon.",
          "success"
        );
      },

      prefill: {
        name: formData[1]?.["Name"],
        email: formData[1]?.["Email-id"],
        contact:
          `${formData[2]?.["Mobile Number"]?.isd}${formData[2]?.["Mobile Number"]?.mobile}`,
      },

      theme: { color: "#ff6b35" },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    console.error(err);
    Swal.fire("Network Error", "Something went wrong.", "error");
  }
};


  const outerClass = inModal
    ? "bg-black text-white"
    : "min-vh-100 bg-black text-white d-flex align-items-center py-5";

  return (
    <div className={outerClass}>
      <style>{`
        /* SweetAlert always above modal / form */
        /* SweetAlert2 Custom Styles */
        .swal2-popup {
          background: #111 !important;
          color: #fff !important;
          border: 2px solid #ff914d !important;
          border-radius: 16px !important;
        }
        .swal2-title,
        .swal2-html-container {
          color: #fff !important;
        }
        .swal2-success-circular-line-left,
        .swal2-success-circular-line-right,
        .swal2-success-fix {
          background: none !important;
        }
        .swal2-success {
          border-color: #ff914d !important;
        }
        .swal2-success .swal2-success-ring {
          border: 4px solid #ff914d !important;
        }
        .swal2-success .swal2-success-line-tip,
        .swal2-success .swal2-success-line-long {
          background-color: #ff914d !important;
        }
        .swal2-styled.swal2-confirm {
          background-color: #ff914d !important;
          color: #fff !important;
          border: 2px solid #ff914d !important;
          border-radius: 8px !important;
        }
        .swal2-styled.swal2-confirm:focus {
          box-shadow: 0 0 0 2px #ff914d55 !important;
        }
        .swal2-container {
          z-index: 9999 !important;
        }

        .form-container {
          max-width: 450px;
          margin: 0 auto;
          font-family: "Arsenal", sans-serif;
        }
        .form-container * {
          font-family: "Arsenal", sans-serif;
        }
        
        .form-card {
          background: transparent;
          border: 2px solid #ff6b35;
          border-radius: 15px;
          min-height: 500px; /* Minimum height for first slide */
          height: auto;
          transition: height 0.3s ease;
        }
        .form-cards {
          padding: 2.6rem 2rem 2rem; /* extra padding above title */
        }
        
        .form-title {
          font-size: 28px;
          font-weight: 300;
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 300;
          margin-bottom: 2.5rem;
          text-align: start;
        }
        
        .field-label {
          font-size: 17.6px;
          font-weight: 300;
          margin-bottom: 0.35rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .required-star {
          color: #ffffff;
          margin-left: 4px;
        }
        
        .additional-text {
          font-size: 0.95rem;
          color: #e0e0e0;
        }
        
        .form-input {
          width: 100%;
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          height: 37px !important; /* Fixed height for all inputs */
        }
        
        .form-input:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
        }
        
        .form-input::placeholder {
          color: #999;
        }

        .select-input {
          background-color: #000;
          color: #fff;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          height: 37px !important; /* Fixed height for selects */
        }
        .select-input option {
          background-color: #000;
          color: #fff;
        }
        
        .btn-option {
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 8px;
          padding: 0 0.2rem;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          cursor: pointer;
          height: 37px !important; /* Fixed height for buttons */
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1; /* equal width in row */
        }
        
        .btn-option:hover {
          border-color: #ff6b35;
        }
        
        .btn-option.active {
          background: #ff6b35;
          border-color: #ff6b35;
        }
        
        .isd-input {
          width: 80px;
          background: #000;
          border: 1.5px solid #666;
          border-radius: 8px;
          padding: 0.25rem 0.5rem;
          color: white;
          font-size: 0.95rem;
          text-align: center;
          height: 37px !important; /* Fixed height for ISD inputs */
        }
        
        .isd-input:focus {
          outline: none;
          border-color: #ff6b35;
        }
        
        .mobile-input {
          flex: 1;
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          color: white;
          font-size: 0.95rem;
          height: 37px !important; /* Fixed height for mobile inputs */
        }
        
        .mobile-input:focus {
          outline: none;
          border-color: #ff6b35;
        }
        
        .navigation-text {
          color: #ff6b35;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .navigation-text:hover {
          color: #ff8c5a;
        }
        
        .navigation-text.disabled {
          color: #666;
          cursor: not-allowed;
        }
        
        .price-btn {
          background: transparent;
          border: 2px solid #ff6b35;
          border-radius: 8px;
          padding: 0;
          color: white;
          font-size: 1.3rem;
          font-weight: 400;
        }
        
        .proceed-btn {
          background: #333;
          border: 2px solid #666;
          border-radius: 8px;
          padding: 0;
          color: white;
          font-size: 1.3rem;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .proceed-btn:hover {
          background: #444;
          border-color: #777;
        }

        /* Modal bottom bar layout */
        .modal-footer {
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          background: #000;
          padding: 0;
          margin-top: -8px;
          margin-left: -40px;
          margin-right: -40px;
          z-index: 2;
        }

        .modal-footer .price-btn,
        .modal-footer .proceed-btn {
          width: 100%;
          border-radius: 0;
          margin: 0;
          height: 56px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: none;
        }

        .modal-footer .price-btn {
          background: transparent;
          color: #ffffff;
          border: 2px solid #ff6b35;
          border-right-width: 1px;
          border-bottom-left-radius: 10px;
          justify-content: center;
          padding-left: 0;
          text-align: center;
        }

        .modal-footer .proceed-btn {
          background: #222;
          color: #cfcfcf;
          border: 2px solid #444;
          border-left-width: 1px;
          border-bottom-right-radius: 10px;
        }

        @media (max-width: 576px) {
          .modal-footer {
            margin-left: -16px;
            margin-right: -16px;
          }
          .modal-footer .price-btn,
          .modal-footer .proceed-btn {
            height: 52px;
            font-size: 1rem;
            padding: 0.6rem 1rem;
          }
        }
        
        @media (max-width: 576px) {
          .section-title {
            font-size: 1.6rem;
          }
          
          .form-title {
            font-size: 1.3rem;
          }
          
          .btn-option {
            padding: 0.5rem 0.8rem;
            font-size: 0.85rem;
          }
          
          .isd-input {
            width: 70px;
          }
          
          .price-btn,
          .proceed-btn {
            font-size: 1rem;
            padding: 0.5rem 1.2rem;
            text: center;
          }
        }
      `}</style>

      <div className="container">
        <div
          className="form-container"
          style={{
            maxWidth: inModal ? (isMobile ? "100%" : "450px") : undefined,
          }}
        >
          <div
            className="form-card"
            style={{
              border: inModal ? "none" : undefined,
              borderRadius: inModal ? "8px" : undefined,
              height: containerHeight !== "auto" ? `${containerHeight}px` : "auto",
            }}
            ref={formContainerRef}
          >
            <div
              className="form-cards"
              style={{ padding: inModal ? "1.2rem 1.2rem 1.5rem" : undefined }}
            >
              <h1
                className="form-title text-center"
                style={{ fontSize: inModal ? "28px" : undefined }}
              >
                {currentForm.title}
              </h1>

              {currentForm.fields.map((field, index) => {
                const stepData = getStepData(currentForm.id);
                const usageValue = stepData["Usage type"]; // for Primary & Compatibility if ever used
                const isDateDropdown =
                  field.label === "Using this number since" ||
                  field.label === "Used since";

                // hide Line of Work when Usage type is Personal / not selected (for primary & any others)
                if (
                  field.label === "Line of Work" &&
                  !(usageValue === "Work" || usageValue === "Both")
                ) {
                  return null;
                }

                // ---------- TEXT FIELD ----------
                if (field.type === "text") {
                  return (
                    <div key={index} className="mb-3">
                      <div className="field-label">
                        <span>
                          {field.label}
                          <span className="required-star">*</span>
                        </span>
                        {field.additionalText && (
                          <span className="additional-text">
                            {field.additionalText}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        className="form-input fw-light"
                        placeholder={field.placeholder}
                        onChange={(e) =>
                          setFieldValue(
                            currentForm.id,
                            field.label,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  );
                }

                // ---------- EMAIL ----------
                if (field.type === "email") {
                  return (
                    <div key={index} className="mb-3">
                      <div className="field-label">
                        <span>
                          {field.label}
                          <span className="required-star">*</span>
                        </span>
                        {field.additionalText && (
                          <span className="additional-text">
                            {field.additionalText}
                          </span>
                        )}
                      </div>
                      <input
                        type="email"
                        className="form-input"
                        placeholder={field.placeholder}
                        onChange={(e) =>
                          setFieldValue(
                            currentForm.id,
                            field.label,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  );
                }

                // ---------- BUTTON GROUP (Gender / Usage type) ----------
                if (field.type === "button-group") {
                  return (
                    <div key={index} className="mb-3">
                      <div className="field-label">
                        <span>
                          {field.label}
                          <span className="required-star">*</span>
                        </span>
                      </div>
                      <div className="d-flex gap-2 flex-wrap w-100">
                        {field.options.map((option, idx) => (
                          <button
                            key={idx}
                            className={`btn-option ${
                              selectedUsageType[`${currentStep}-${index}`] ===
                              option
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedUsageType({
                                ...selectedUsageType,
                                [`${currentStep}-${index}`]: option,
                              });
                              setFieldValue(
                                currentForm.id,
                                field.label,
                                option
                              );
                            }}
                            type="button"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                // ---------- DOUBLE INPUT (Age OR date dropdowns) ----------
                if (field.type === "double-input") {
                  return (
                    <div key={index} className="mb-3">
                      <div className="field-label">
                        <span>
                          {field.label}
                          <span className="required-star">*</span>
                        </span>
                      </div>
                      <div className="d-flex gap-2 mb-3">
                        {isDateDropdown ? (
                          <>
                            {/* Month select */}
                            <select
                              className="form-input select-input"
                              style={{ flex: 1 }}
                              value={(stepData[field.label] || [])[0] || ""}
                              onChange={(e) =>
                                setFieldValue(currentForm.id, field.label, [
                                  e.target.value,
                                  (stepData[field.label] || [])[1] || "",
                                ])
                              }
                            >
                              <option value="">Month</option>
                              {months.map((m) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>

                            {/* Year select */}
                            <select
                              className="form-input select-input"
                              style={{ flex: 1 }}
                              value={(stepData[field.label] || [])[1] || ""}
                              onChange={(e) =>
                                setFieldValue(currentForm.id, field.label, [
                                  (stepData[field.label] || [])[0] || "",
                                  e.target.value,
                                ])
                              }
                            >
                              <option value="">Year</option>
                              {years.map((yr) => (
                                <option key={yr} value={yr}>
                                  {yr}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <>
                            {/* normal (Age) */}
                            <input
                              type="text"
                              className="form-input"
                              placeholder={field.placeholders[0]}
                              style={{ flex: 1 }}
                              onChange={(e) =>
                                setFieldValue(currentForm.id, field.label, [
                                  e.target.value,
                                  (stepData[field.label] || [])[1] || "",
                                ])
                              }
                            />
                            <input
                              type="text"
                              className="form-input"
                              placeholder={field.placeholders[1]}
                              style={{ flex: 1 }}
                              onChange={(e) =>
                                setFieldValue(currentForm.id, field.label, [
                                  (stepData[field.label] || [])[0] || "",
                                  e.target.value,
                                ])
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                  );
                }

                // ---------- ISD + MOBILE ----------
                if (field.type === "isd-mobile") {
                  return (
                    <div key={index} className="mb-3">
                      <div className="field-label">
                        <span>
                          {field.label}
                          <span className="required-star">*</span>
                        </span>
                      </div>
                      <div className="d-flex gap-2">
                        <select
                          className="isd-input select-input"
                          value={
                            (stepData[field.label] || {}).isd || "+91"
                          }
                          onChange={(e) =>
                            setFieldValue(currentForm.id, field.label, {
                              ...(stepData[field.label] || {}),
                              isd: e.target.value,
                            })
                          }
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+61">+61</option>
                          <option value="+81">+81</option>
                          <option value="+971">+971</option>
                          <option value="+49">+49</option>
                          <option value="+33">+33</option>
                        </select>
                        <input
                          type="text"
                          className="mobile-input"
                          placeholder={field.placeholders[1]}
                          onChange={(e) =>
                            setFieldValue(currentForm.id, field.label, {
                              ...(stepData[field.label] || {}),
                              mobile: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  );
                }

                // ---------- ADD NUMBER BUTTONS ----------
                if (field.type === "button") {
                  // SPECIAL: Parallel (3) & Previous (4) – form opens only after Add Number
                  if (currentForm.id === 3 || currentForm.id === 4) {
                    const dyn = dynamicNumbers[currentForm.id] || [];
                    return (
                      <div key={index} className="mb-3">
                        {/* UPDATED TOP ROW: only small button + "If any" (no label) */}
                        <div className="d-flex gap-2 align-items-center mt-2">
                          <button
                            className="btn-option"
                            style={{
                              flex: "0 0 130px", // smaller width
                              height: "34px",
                              fontSize: "0.85rem",
                              padding: 0,
                            }}
                            type="button"
                            onClick={() => handleAddNumber(currentForm.id)}
                          >
                            {field.placeholder}
                          </button>
                          {field.additionalText && (
                            <span className="additional-text">
                              {field.additionalText}
                            </span>
                          )}
                        </div>

                        {/* Dynamic blocks – each number form */}
                        {dyn.map((num, idx) => (
                          <div
                            key={idx}
                            className="mt-3"
                            style={{
                              borderTop: "1px solid #444",
                              paddingTop: "0.6rem",
                              paddingLeft: "0.6rem",
                              paddingRight: "0.6rem",
                              maxWidth: "92%",
                              margin: "0 auto",
                            }}
                          >
                            {/* Only Remove button on top-right (no Parallel #1 label) */}
                            <div className="d-flex justify-content-end mb-2 gap-2">
                              <button
                                type="button"
                                className="btn-option"
                                style={{
                                  flex: "0 0 auto",
                                  maxWidth: "90px",
                                  background: "#ff6b35",
                                  border: "none",
                                  height: "36px",
                                  fontSize: "20px",
                                  fontWeight:"heavy",
                                  width: "36px",
                                  backgroundColor:"black",
                                  color:"#FF6B35",
                                  boxSizing: "border-box",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
                                }}
                                onClick={() =>
                                  handleRemoveNumber(currentForm.id, idx)
                                }
                              >
                                -
                              </button>
                              <button
                                type="button"
                                className="btn-option"
                                style={{
                                  flex: "0 0 auto",
                                  maxWidth: "90px",
                                  background: "#ff6b35",
                                  border: "none",
                                  height: "38.6px",
                                  fontSize: "14px",
                                  fontWeight:"heavy",
                                  width: "76.95px",
                                  backgroundColor:"black",
                                  color:"#FF6B35",
                                  boxSizing: "border-box",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
                                }}
                                onClick={() =>
                                  handleRemoveNumber(currentForm.id, idx)
                                }
                              >
                                Remove
                              </button>
                            </div>

                            {/* Mobile Number */}
                            <div className="mb-2">
                              <div className="field-label" style={{ marginBottom: "0.3rem" }}>
                                <span>
                                  Mobile Number
                                  <span className="required-star">*</span>
                                </span>
                              </div>
                              <div className="d-flex gap-2">
                                <select
                                  className="isd-input select-input"
                                  value={num.isd || "+91"}
                                  onChange={(e) =>
                                    setDynamicNumberValue(
                                      currentForm.id,
                                      idx,
                                      "isd",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="+91">+91</option>
                                  <option value="+1">+1</option>
                                  <option value="+44">+44</option>
                                  <option value="+61">+61</option>
                                  <option value="+81">+81</option>
                                  <option value="+971">+971</option>
                                  <option value="+49">+49</option>
                                  <option value="+33">+33</option>
                                </select>
                                <input
                                  type="text"
                                  className="mobile-input"
                                  placeholder="Mobile Number"
                                  value={num.mobile}
                                  onChange={(e) =>
                                    setDynamicNumberValue(
                                      currentForm.id,
                                      idx,
                                      "mobile",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* Used / Using Since & Till */}
                            {currentForm.id === 3 ? (
                              // Parallel: "Using this number since"
                              <div className="mb-2">
                                <div className="field-label" style={{ marginBottom: "0.3rem" }}>
                                  <span>
                                    Using this number since
                                    <span className="required-star">*</span>
                                  </span>
                                </div>
                                <div className="d-flex gap-2">
                                  <select
                                    className="form-input select-input"
                                    style={{ flex: 1 }}
                                    value={num.since?.[0] || ""}
                                    onChange={(e) =>
                                      setDynamicNumberValue(
                                        currentForm.id,
                                        idx,
                                        "since",
                                        [e.target.value, num.since?.[1] || ""]
                                      )
                                    }
                                  >
                                    <option value="">Month</option>
                                    {months.map((m) => (
                                      <option key={m} value={m}>
                                        {m}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    className="form-input select-input"
                                    style={{ flex: 1 }}
                                    value={num.since?.[1] || ""}
                                    onChange={(e) =>
                                      setDynamicNumberValue(
                                        currentForm.id,
                                        idx,
                                        "since",
                                        [num.since?.[0] || "", e.target.value]
                                      )
                                    }
                                  >
                                    <option value="">Year</option>
                                    {years.map((yr) => (
                                      <option key={yr} value={yr}>
                                        {yr}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ) : (
                              // Previous: Used since + Used till
                              <>
                                <div className="mb-2">
                                  <div className="field-label" style={{ marginBottom: "0.3rem" }}>
                                    <span>
                                      Used since
                                      <span className="required-star">*</span>
                                    </span>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <select
                                      className="form-input select-input"
                                      style={{ flex: 1 }}
                                      value={num.usedSince?.[0] || ""}
                                      onChange={(e) =>
                                        setDynamicNumberValue(
                                          currentForm.id,
                                          idx,
                                          "usedSince",
                                          [
                                            e.target.value,
                                            num.usedSince?.[1] || "",
                                          ]
                                        )
                                      }
                                    >
                                      <option value="">Month</option>
                                      {months.map((m) => (
                                        <option key={m} value={m}>
                                          {m}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      className="form-input select-input"
                                      style={{ flex: 1 }}
                                      value={num.usedSince?.[1] || ""}
                                      onChange={(e) =>
                                        setDynamicNumberValue(
                                          currentForm.id,
                                          idx,
                                          "usedSince",
                                          [
                                            num.usedSince?.[0] || "",
                                            e.target.value,
                                          ]
                                        )
                                      }
                                    >
                                      <option value="">Year</option>
                                      {years.map((yr) => (
                                        <option key={yr} value={yr}>
                                          {yr}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="mb-2">
                                  <div className="field-label" style={{ marginBottom: "0.3rem" }}>
                                    <span>
                                      Used till
                                      <span className="required-star">*</span>
                                    </span>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <select
                                      className="form-input select-input"
                                      style={{ flex: 1 }}
                                      value={num.usedTill?.[0] || ""}
                                      onChange={(e) =>
                                        setDynamicNumberValue(
                                          currentForm.id,
                                          idx,
                                          "usedTill",
                                          [
                                            e.target.value,
                                            num.usedTill?.[1] || "",
                                          ]
                                        )
                                      }
                                    >
                                      <option value="">Month</option>
                                      {months.map((m) => (
                                        <option key={m} value={m}>
                                          {m}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      className="form-input select-input"
                                      style={{ flex: 1 }}
                                      value={num.usedTill?.[1] || ""}
                                      onChange={(e) =>
                                        setDynamicNumberValue(
                                          currentForm.id,
                                          idx,
                                          "usedTill",
                                          [
                                            num.usedTill?.[0] || "",
                                            e.target.value,
                                          ]
                                        )
                                      }
                                    >
                                      <option value="">Year</option>
                                      {years.map((yr) => (
                                        <option key={yr} value={yr}>
                                          {yr}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Usage type */}
                            <div className="mb-2">
                              <div className="field-label" style={{ marginBottom: "0.3rem" }}>
                                <span>
                                  Usage type
                                  <span className="required-star">*</span>
                                </span>
                              </div>
                              <div className="d-flex gap-2 flex-wrap w-100">
                                {["Personal", "Work", "Both"].map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    className={`btn-option ${
                                      num.usageType === opt ? "active" : ""
                                    }`}
                                    style={{ flex: 1, height: "32px", fontSize: "0.85rem" }}
                                    onClick={() =>
                                      setDynamicNumberValue(
                                        currentForm.id,
                                        idx,
                                        "usageType",
                                        opt
                                      )
                                    }
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Line of Work – only when Work / Both */}
                            {(num.usageType === "Work" ||
                              num.usageType === "Both") && (
                              <div className="mb-2">
                                <div className="field-label" style={{ marginBottom: "0.3rem" }}>
                                  <span>
                                    Line of Work
                                    <span className="required-star">*</span>
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="IT, Finance, Marketing, Public-relations, etc."
                                  style={{ height: "34px" }}
                                  value={num.lineOfWork}
                                  onChange={(e) =>
                                    setDynamicNumberValue(
                                      currentForm.id,
                                      idx,
                                      "lineOfWork",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}

                            {/* Role */}
                            <div className="mb-2">
                              <div className="field-label" style={{ marginBottom: "0.3rem" }}>
                                <span>
                                  Role
                                  <span className="required-star">*</span>
                                </span>
                              </div>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Student, Shop Keeper, Accountant, etc."
                                style={{ height: "34px" }}
                                value={num.role}
                                onChange={(e) =>
                                  setDynamicNumberValue(
                                    currentForm.id,
                                    idx,
                                    "role",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  // Default behavior for other steps (Compatibility etc.) – extra simple numbers
                  return (
                    <div key={index} className="mb-3">
                      {(dynamicNumbers[currentForm.id] || []).map(
                        (num, idx) => (
                          <div
                            key={idx}
                            className="d-flex gap-2 align-items-center mt-2"
                          >
                            <select
                              className="isd-input select-input"
                              value={num.isd}
                              onChange={(e) =>
                                setDynamicNumberValue(
                                  currentForm.id,
                                  idx,
                                  "isd",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">ISD</option>
                              <option value="+91">+91</option>
                              <option value="+1">+1</option>
                              <option value="+44">+44</option>
                              <option value="+61">+61</option>
                              <option value="+81">+81</option>
                              <option value="+971">+971</option>
                            </select>
                            <input
                              type="text"
                              className="mobile-input"
                              placeholder="Mobile Number"
                              value={num.mobile}
                              onChange={(e) =>
                                setDynamicNumberValue(
                                  currentForm.id,
                                  idx,
                                  "mobile",
                                  e.target.value
                                )
                              }
                            />
                            <button
                              className="btn-option"
                              style={{
                                background: "#ff6b35",
                                color: "#fff",
                                border: "none",
                                flex: "0 0 auto",
                                padding: "0 12px",
                              }}
                              type="button"
                              onClick={() =>
                                handleRemoveNumber(currentForm.id, idx)
                              }
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}

                      {(dynamicNumbers[currentForm.id]?.length || 0) < 3 && (
                        <>
                          <div className="field-label">
                            <span>{field.label}</span>
                            {field.additionalText && (
                              <span className="additional-text">
                                {field.additionalText}
                              </span>
                            )}
                          </div>
                          <div className="d-flex gap-2 align-items-center mt-2">
                            <button
                              className="btn-option"
                              style={{ flex: 1 }}
                              type="button"
                              onClick={() => handleAddNumber(currentForm.id)}
                            >
                              {field.placeholder}
                            </button>
                            {field.additionalText && (
                              <span className="additional-text">
                                {field.additionalText}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                }

                return null;
              })}

              {/* Navigation */}
              <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                <span
                  className={`navigation-text ${
                    currentStep === 0 ? "disabled" : ""
                  }`}
                  onClick={handlePrev}
                >
                  &#60;&#60;&#60; prev
                </span>
                <span
                  className={`navigation-text ${
                    currentStep === effectiveSteps.length - 1 ? "disabled" : ""
                  }`}
                  onClick={handleNext}
                >
                  next &#62;&#62;&#62;
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className={inModal ? "modal-footer" : "d-flex gap-5"}>
              <button
                className="price-btn"
                style={{
                  flex: inModal ? undefined : 1,
                  padding: inModal ? "0.75rem 1rem" : undefined,
                  fontSize: inModal ? "1rem" : undefined,
                  height: inModal ? 48 : undefined,
                }}
              >
                {selectedPlan?.price ?? currentForm.price}
              </button>
              <button
                className="proceed-btn"
                style={{
                  flex: inModal ? undefined : 1,
                  padding: inModal ? "0.75rem 1rem" : undefined,
                  fontSize: inModal ? "1rem" : undefined,
                  height: inModal ? 48 : undefined,
                  opacity:
                    currentStep === effectiveSteps.length - 1 ? 1 : 0.6,
                  cursor:
                    currentStep === effectiveSteps.length - 1
                      ? "pointer"
                      : "not-allowed",
                }}
                disabled={currentStep !== effectiveSteps.length - 1}
                onClick={handleProceed}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}