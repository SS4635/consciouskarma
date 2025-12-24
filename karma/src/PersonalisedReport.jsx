// src/ConsciousKarmaPage.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom"; // ✅ Added for Portal
import Swal from "sweetalert2";
import "./PersonalizedReport.css";
import { useIntl, FormattedMessage } from "react-intl";

import ElectricBorder from "./ElectricBorder";
import GeneralInformationForm from "./components/consultation/forms/GeneralInformationForm";
import PrimaryNumberForm from "./components/consultation/forms/PrimaryNumberForm";
import ParallelNumbersForm from "./components/consultation/forms/ParallelNumbersForm";
import PreviousNumbersForm from "./components/consultation/forms/PreviousNumbersForm";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import CKNavbar from "./components/CKNavbar";

// ✅ 1. Import Country Codes for Validation
import { COUNTRY_CODES } from "./components/constants/countryCodes"; 

// =======================
// ENV CONFIG (CRA ONLY)
// =======================
const API_BASE = process.env.REACT_APP_API_URL || "https://server.consciouskarma.co";

const BASE_PRICE_RAW = Number(process.env.REACT_APP_REPORT_BASE_PRICE ?? 1);
const BASE_PRICE = Number.isFinite(BASE_PRICE_RAW) ? BASE_PRICE_RAW : 1;

const MAX_PARALLEL_RAW = Number(process.env.REACT_APP_MAX_PARALLEL_NUMBERS ?? 3);
const MAX_PARALLEL_NUMBERS = Number.isFinite(MAX_PARALLEL_RAW) ? MAX_PARALLEL_RAW : 3;

const ConsciousKarmaPage = () => {
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // ✅ New State for Report Generation Loader
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [general, setGeneral] = useState({
    name: "",
    gender: "",
    ageYears: "",
    ageMonths: "",
    email: "",
  });

  const intl = useIntl();

  const features = [
    ["Speech", "Appearance", "Emotions"],
    ["Money Patterns", "Work-style"],
    ["Social life", "Opportunities & Obstacles"],
  ];

  // ----- PRIMARY NUMBER (always paid) -----
  const [primary, setPrimary] = useState({
    isd: "+91",
    number: "",
    sinceMonth: "",
    sinceYear: "",
    usageType: "",
    lineOfWork: "",
    role: "",
  });

  // ----- PARALLEL NUMBERS (max 3, each paid) -----
  const [parallels, setParallels] = useState([]);

  // ----- PREVIOUS NUMBERS (any, no price impact) -----
  const [previousNumbers, setPreviousNumbers] = useState([]);

  // ----- FAQ STATE -----
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // ----- OTP STATE -----
  const [otpPrimary, setOtpPrimary] = useState({
    sent: false,
    code: "",
    verified: false,
    cooldown: 0,
    verificationId: null,
  });

  const [otpParallels, setOtpParallels] = useState([]);

  // ----- PRICE -----
  const paidCount = 1 + parallels.length; // primary + each parallel
  const totalPrice = BASE_PRICE * paidCount;
  const priceText = `₹ ${BASE_PRICE} x ${paidCount} = ₹ ${totalPrice}`;

  // ----- STEP NAV -----
  const goNext = () => setStep((s) => (s < 4 ? s + 1 : s));
  const goPrev = () => setStep((s) => (s > 0 ? s - 1 : s));

  // ----- HELPER: VALIDATE MOBILE NUMBER -----
  const validatePhoneNumber = (isd, number) => {
    if (!number) return false;
    const cleanNum = number.replace(/\D/g, ""); // Remove non-digits
    const country = COUNTRY_CODES.find((c) => c.dial_code === (isd || "+91"));

    if (country && country.max_length) {
      return cleanNum.length === country.max_length;
    }
    return cleanNum.length >= 7 && cleanNum.length <= 15;
  };

  // ----- ADAPTER FUNCTIONS FOR REUSABLE COMPONENTS -----
  const getGeneralFormData = () => ({
    Name: general.name,
    Gender: general.gender,
    AgeYears: general.ageYears,
    AgeMonths: general.ageMonths,
    "Email-id": general.email,
  });

  const handleGeneralFormChange = (field, value) => {
    switch (field) {
      case "Name": setGeneral((g) => ({ ...g, name: value })); break;
      case "Gender": setGeneral((g) => ({ ...g, gender: value })); break;
      case "AgeYears": setGeneral((g) => ({ ...g, ageYears: value })); break;
      case "AgeMonths": setGeneral((g) => ({ ...g, ageMonths: value })); break;
      case "Email-id": setGeneral((g) => ({ ...g, email: value })); break;
      default: break;
    }
  };

  const getPrimaryFormData = () => ({
    "Mobile Number": { isd: primary.isd, mobile: primary.number },
    "Using this number since": [primary.sinceMonth, primary.sinceYear],
    "Usage type": primary.usageType,
    "Line of Work": primary.lineOfWork,
    Role: primary.role,
  });

  const handlePrimaryFormChange = (field, value) => {
    switch (field) {
      case "Mobile Number":
        setPrimary((p) => ({ ...p, isd: value.isd, number: value.mobile }));
        break;
      case "Using this number since":
        setPrimary((p) => ({ ...p, sinceMonth: value[0], sinceYear: value[1] }));
        break;
      case "Usage type": setPrimary((p) => ({ ...p, usageType: value })); break;
      case "Line of Work": setPrimary((p) => ({ ...p, lineOfWork: value })); break;
      case "Role": setPrimary((p) => ({ ...p, role: value })); break;
      default: break;
    }
  };

  // ----- PARALLEL NUMBERS -----
  const addParallel = () => {
    if (parallels.length >= MAX_PARALLEL_NUMBERS) return;
    setParallels((list) => [
      ...list,
      { isd: "+91", number: "", sinceMonth: "", sinceYear: "", usageType: "", lineOfWork: "", role: "" },
    ]);
    setOtpParallels((list) => [
      ...list,
      { sent: false, code: "", verified: false, cooldown: 0, verificationId: null },
    ]);
  };

  const updateParallel = (index, field, value) => {
    setParallels((list) =>
      list.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const toggleRemoveParallel = (index) => {
    setParallels((list) => list.filter((_, i) => i !== index));
    setOtpParallels((list) => list.filter((_, i) => i !== index));
  };

  // ----- PREVIOUS NUMBERS -----
  const addPrevious = () => {
    setPreviousNumbers((list) => [
      ...list,
      { isd: "+91", number: "", usedSinceMonth: "", usedSinceYear: "", usedTillMonth: "", usedTillYear: "", usageType: "", role: "" },
    ]);
  };

  const updatePrevious = (index, field, value) => {
    setPreviousNumbers((list) =>
      list.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removePrevious = (index) => {
    setPreviousNumbers((list) => list.filter((_, i) => i !== index));
  };

  // ----- FAQ -----
  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    { question: "1 - What happens after I submit the form?", answer: "A - Once your details are submitted, the analysis begins. Each number is studied individually, and your personalised report is prepared within 5–7 working days. You'll receive it directly on your registered email." },
    { question: "2 - Why do I need to verify my mobile number with an OTP?", answer: "A - OTP verification confirms that the number is active and genuinely belongs to you." },
    { question: "3 - Can I include more than one number in a single report?", answer: "A – Yes. You can include more than one number in the same report. This gives insights into each number on its own, and also how they interact together. (Each additional number is charged.)" },
    { question: "4 – How many secondary numbers can I add?", answer: "A - You can include up to three secondary numbers along with your primary number. If you're using more than four numbers, we recommend booking a consultation." },
    { question: "5 - What if I've changed my number in the past?", answer: "A - You can add your previous number(s) in the form. They help us understand how your mobile number energy has shifted over time and provide context for your current number's influence." },
    { question: "6 - Why do you ask for my age, gender, and work details?", answer: "A - These details help in understanding how your number's energy interacts with your stage of life and the environment you function in. Each number expresses differently depending on who uses it and for what purpose." },
    { question: "7 - What if I enter the wrong number in the form?", answer: "A - If an incorrect number is verified or submitted, it will produce a report for that number. Please double-check all digits before submission, as each number sequence is unique." },
  ];

  // ========== OTP COOLDOWN HELPERS ==========
  const startPrimaryCooldown = () => {
    setOtpPrimary((prev) => ({ ...prev, cooldown: 15 }));
    const id = setInterval(() => {
      setOtpPrimary((prev) => {
        if (!prev.cooldown || prev.cooldown <= 1) {
          clearInterval(id);
          return { ...prev, cooldown: 0 };
        }
        return { ...prev, cooldown: prev.cooldown - 1 };
      });
    }, 1000);
  };

  const startParallelCooldown = (index) => {
    setOtpParallels((list) =>
      list.map((o, i) => (i === index ? { ...o, cooldown: 15 } : o))
    );
    const id = setInterval(() => {
      setOtpParallels((list) => {
        let stop = false;
        const next = list.map((o, i) => {
          if (i !== index) return o;
          if (!o.cooldown || o.cooldown <= 1) {
            stop = true;
            return { ...o, cooldown: 0 };
          }
          return { ...o, cooldown: o.cooldown - 1 };
        });
        if (stop) clearInterval(id);
        return next;
      });
    }, 1000);
  };

  // ========== OTP API CALLS ==========
  const sendOtpPrimary = async () => {
    if (!validatePhoneNumber(primary.isd, primary.number)) {
      return Swal.fire("Incorrect number", "Please enter correct number.", "warning");
    }

    if (otpPrimary.cooldown > 0 || otpPrimary.verified) return;

    try {
      const res = await fetch(`${API_BASE}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: primary.number }),
      });

      const data = await res.json();
      if (data.ok && data.verificationId) {
        setOtpPrimary((o) => ({
          ...o,
          sent: true,
          verificationId: data.verificationId,
        }));
        startPrimaryCooldown();

        Swal.fire({
          icon: "success",
          title: "OTP sent!",
          text: "Primary OTP is valid for 60 seconds.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not send OTP. Please try again.", "error");
    }
  };

  const sendOtpParallel = async (index) => {
    const p = parallels[index];
    const o = otpParallels[index];

    if (!validatePhoneNumber(p.isd, p.number)) {
      return Swal.fire("Incorrect number", `Please enter correct number for Parallel #${index + 1}.`, "warning");
    }

    if (!p || (o && (o.cooldown > 0 || o.verified))) return;

    try {
      const res = await fetch(`${API_BASE}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: p.number }),
      });

      const data = await res.json();

      if (data.ok && data.verificationId) {
        setOtpParallels((list) =>
          list.map((x, i) =>
            i === index ? { ...x, sent: true, verificationId: data.verificationId } : x
          )
        );

        startParallelCooldown(index);

        Swal.fire({
          icon: "success",
          title: `OTP sent for Parallel #${index + 1}`,
          text: "OTP is valid for 60 seconds.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not send OTP.", "error");
    }
  };

  const verifyOtpPrimary = async () => {
    if (!otpPrimary.code || otpPrimary.verified || !otpPrimary.verificationId) return;

    try {
      const res = await fetch(`${API_BASE}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId: otpPrimary.verificationId,
          code: otpPrimary.code,
        }),
      });

      const data = await res.json();

      if (data.ok && data.verified) {
        setOtpPrimary((o) => ({ ...o, verified: true, cooldown: 0 }));
        Swal.fire({
          icon: "success",
          title: "Verified",
          text: "Primary number OTP verified.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Invalid OTP", "Please check and try again.", "warning");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not verify OTP.", "error");
    }
  };

  const verifyOtpParallel = async (index) => {
    const o = otpParallels[index];
    if (!o || !o.code || o.verified || !o.verificationId) return;

    try {
      const res = await fetch(`${API_BASE}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId: o.verificationId,
          code: o.code,
        }),
      });

      const data = await res.json();

      if (data.ok && data.verified) {
        setOtpParallels((list) =>
          list.map((x, i) => (i === index ? { ...x, verified: true, cooldown: 0 } : x))
        );

        Swal.fire({
          icon: "success",
          title: `Parallel number #${index + 1} verified.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Invalid OTP", "Please check and try again.", "warning");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not verify OTP.", "error");
    }
  };

  // ========== OTP COMPLETE CHECKS ==========
  const allParallelOtpsVerified =
    parallels.length === 0 ||
    (otpParallels.length === parallels.length &&
      otpParallels.every((x, i) => (parallels[i]?.number ? x.verified : true)));

  const allOtpsVerified = otpPrimary.verified && allParallelOtpsVerified;

  // ========== VALIDATION ==========
  const validateGeneralInfo = () => {
    const { name, gender, ageYears, ageMonths, email } = general;

    if (!String(name).trim()) return "Please enter your name.";
    if (!String(gender).trim()) return "Please select gender.";
    if (!String(ageYears).trim()) return "Please enter age in years.";
    if (!String(ageMonths).trim()) return "Please enter age in months.";

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email)))
      return "Enter a valid email ID.";

    return null;
  };

  const validatePrimary = () => {
    const { number, sinceMonth, sinceYear, usageType, role } = primary;

    if (!String(number).trim()) return "Please enter your primary number.";
    if (!String(sinceMonth).trim()) return "Select month since you’re using this number.";
    if (!String(sinceYear).trim()) return "Select year since you’re using this number.";
    if (!String(usageType).trim()) return "Please select usage type.";
    if (!String(role).trim()) return "Please enter your role.";

    if ((usageType === "Work" || usageType === "Both") && !String(primary.lineOfWork).trim()) {
      return "Please enter your line of work.";
    }

    return null;
  };

  const validateParallels = () => {
    for (let i = 0; i < parallels.length; i++) {
      const p = parallels[i];

      if (!String(p.number).trim()) return `Please enter parallel number #${i + 1}.`;
      if (!String(p.sinceMonth).trim()) return `Select month for parallel number #${i + 1}.`;
      if (!String(p.sinceYear).trim()) return `Select year for parallel number #${i + 1}.`;
      if (!String(p.usageType).trim()) return `Select usage type for parallel number #${i + 1}.`;
      if (!String(p.role).trim()) return `Enter role for parallel number #${i + 1}.`;

      if ((p.usageType === "Work" || p.usageType === "Both") && !String(p.lineOfWork || "").trim()) {
        return `Enter line of work for parallel number #${i + 1}.`;
      }
    }
    return null;
  };

  const validatePreviousNumbers = () => {
    for (let i = 0; i < previousNumbers.length; i++) {
      const p = previousNumbers[i];

      if (!String(p.number).trim()) return `Please enter previous number #${i + 1}.`;
      if (!String(p.usedSinceMonth).trim()) return `Select 'Used Since Month' for previous number #${i + 1}.`;
      if (!String(p.usedSinceYear).trim()) return `Select 'Used Since Year' for previous number #${i + 1}.`;
      if (!String(p.usedTillMonth).trim()) return `Select 'Used Till Month' for previous number #${i + 1}.`;
      if (!String(p.usedTillYear).trim()) return `Select 'Used Till Year' for previous number #${i + 1}.`;
      if (!String(p.usageType).trim()) return `Select usage type for previous number #${i + 1}.`;
      if (!String(p.role).trim()) return `Enter role for previous number #${i + 1}.`;
    }
    return null;
  };

  const isFormComplete = () => {
    if (
      !general.name?.trim() ||
      !general.gender?.trim() ||
      !general.ageYears?.trim() ||
      !general.ageMonths?.trim() ||
      !general.email?.trim()
    ) {
      return false;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(general.email))) {
      return false;
    }

    if (
      !primary.number?.trim() ||
      !primary.sinceMonth?.trim() ||
      !primary.sinceYear?.trim() ||
      !primary.usageType?.trim() ||
      !primary.role?.trim()
    ) {
      return false;
    }

    if ((primary.usageType === "Work" || primary.usageType === "Both") && !primary.lineOfWork?.trim()) {
      return false;
    }

    for (let p of parallels) {
      if (
        !p.number?.trim() ||
        !p.sinceMonth?.trim() ||
        !p.sinceYear?.trim() ||
        !p.usageType?.trim() ||
        !p.role?.trim()
      ) {
        return false;
      }
      if ((p.usageType === "Work" || p.usageType === "Both") && !p.lineOfWork?.trim()) {
        return false;
      }
    }

    for (let p of previousNumbers) {
      if (
        !p.number?.trim() ||
        !p.usedSinceMonth?.trim() ||
        !p.usedSinceYear?.trim() ||
        !p.usedTillMonth?.trim() ||
        !p.usedTillYear?.trim() ||
        !p.usageType?.trim() ||
        !p.role?.trim()
      ) {
        return false;
      }
    }

    return true;
  };

  const proceedEnabled = step === 4 && isFormComplete() && allOtpsVerified;

  const openRazorpayCheckout = ({ key, orderId, amount, onSuccess, onFailure }) => {
    if (!window.Razorpay) {
      Swal.fire("Error", "Razorpay SDK not loaded.", "error");
      return;
    }

    const options = {
      key,
      amount,
      currency: "INR",
      name: "Conscious Karma",
      description: "Personalized Mobile Number Report",
      order_id: orderId,
      handler: (response) => {
        onSuccess && onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          onFailure && onFailure();
        },
      },
      prefill: {
        name: general.name,
        email: general.email,
        contact: `${primary.isd}${primary.number}`,
      },
      theme: { color: "#ff8a2b" },
    };

    new window.Razorpay(options).open();
  };

  const handleProceed = async () => {
    let err = null;

    err = validateGeneralInfo();
    if (err) return Swal.fire("Missing Information", err, "warning");

    err = validatePrimary();
    if (err) return Swal.fire("Missing Information", err, "warning");

    err = validateParallels();
    if (err) return Swal.fire("Missing Information", err, "warning");

    err = validatePreviousNumbers();
    if (err) return Swal.fire("Missing Information", err, "warning");

    if (!allOtpsVerified) {
      return Swal.fire("OTP pending", "Please verify all OTPs before proceeding to payment.", "warning");
    }

    try {
      const createRes = await fetch(`${API_BASE}/api/pay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          general,
          primary,
          parallels,
          previousNumbers,
          price: totalPrice,
        }),
      });
      const createData = await createRes.json();
      if (!createData.ok) throw new Error(createData.message || "Failed to create order");

      const localOrderId = createData.orderId;

      if (createData.free || !createData.order) {
        // Free report flow - Start Loading
        setIsGeneratingReport(true);
        
        try {
            const startRes = await fetch(`${API_BASE}/api/report/start`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: localOrderId }),
            });
            const startData = await startRes.json();
            if (!startData.ok) throw new Error(startData.message || "Failed to trigger report");

            setIsGeneratingReport(false); // Stop loading before success message

            return Swal.fire({
              icon: "success",
              title: "All set!",
              text: "OTP verified. Your request is confirmed. Your report will be sent within 3–5 days.",
            });
        } catch(freeErr) {
            setIsGeneratingReport(false);
            throw freeErr;
        }
      }

      const { keyId, order } = createData;

      openRazorpayCheckout({
        key: keyId,
        orderId: order.id,
        amount: order.amount,
        onSuccess: async (rzpRes) => {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/pay/verify-report`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: localOrderId,
                razorpay_order_id: rzpRes.razorpay_order_id,
                razorpay_payment_id: rzpRes.razorpay_payment_id,
                razorpay_signature: rzpRes.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.ok) throw new Error(verifyData.message || "Payment verification failed");

            // ✅ PAYMENT VERIFIED: START LOADING HERE
            setIsGeneratingReport(true);

            const submitRes = await fetch(`${API_BASE}/api/report/submit`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: localOrderId }),
            });
            const submitData = await submitRes.json();
            
            // ✅ EMAIL TRIGGERED: STOP LOADING HERE
            setIsGeneratingReport(false);

            if (!submitData.ok) throw new Error(submitData.message || "Failed to trigger report/mails");

            Swal.fire({
              icon: "success",
              title: "Verified & Confirmed",
              text: "OTP verified and payment successful. Your personalized report will be emailed within 3–5 days.",
            });
          } catch (err) {
            setIsGeneratingReport(false); // Ensure loading stops on error
            console.error(err);
            Swal.fire("Error", err.message || "Something went wrong after payment.", "error");
          }
        },
        onFailure: () => {
          Swal.fire("Payment cancelled", "You can try again anytime.", "info");
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Something went wrong.", "error");
    }
  };

  // ✅ LOADING COMPONENT (Overlay)
  const loadingOverlay = isGeneratingReport ? (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 999999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="spinner" style={{
        width: '50px', height: '50px', border: '5px solid #333',
        borderTop: '5px solid #ff6b35', borderRadius: '50%',
        animation: 'spin 1s linear infinite', marginBottom: '20px'
      }}></div>
      <h2 style={{color: '#fff', fontSize: '24px', fontFamily: 'Arsenal'}}>Generating Your Report...</h2>
      <p style={{color: '#ccc', marginTop: '10px'}}>Please wait, do not close this window.</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  ) : null;

  return (
    <div className="ck-page">
      {/* RENDER LOADER (via Portal if desired, or inline since div is fixed) */}
      {typeof document !== 'undefined' ? ReactDOM.createPortal(loadingOverlay, document.body) : loadingOverlay}

      <CKNavbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setShowSignup={setShowSignup}
      />

      <main>
        <section className="ck-form-section">
          {/* ... Rest of your render logic remains exactly the same ... */}
          <div className="ck-form-layout">
            {/* LEFT HERO */}
            <div className="ck-hero">
              <p className="ck-hero-text">
                Every mobile number is alive with energy, shaping how we think, feel, speak, and live.
              </p>

              <div className="mx-auto max-w-[900px] px-3">
                <div className="ck-tags-wrap space-y-3">
                  {features.map((row, rowIndex) => (
                    <div key={rowIndex} className="ck-tags-row flex flex-wrap justify-center gap-3">
                      {row.map((text, index) => (
                        <ElectricBorder
                          key={index}
                          color="#ff6b35"
                          speed={2.1}
                          chaos={0.5}
                          thickness={1}
                          style={{ borderRadius: 16 }}
                        >
                          <div className="flex items-center h-[26px] sm:h-[34px]">
                            <p className="m-0 opacity-80 px-3 sm:px-[52px] text-[14px] sm:text-[18px] mt-[2px] sm:mt-[6px] text-center whitespace-nowrap">
                              {text}
                            </p>
                          </div>
                        </ElectricBorder>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <p className="ck-hero-sub">
                Every Mobile Number tells a story.
                <br />
                This is YOURS.
              </p>

              <p className="ck-delivery-text-left">
                <>
                  Delivery within 5–7 days
                  <br />
                  Requires mobile number OTP verification
                </>
              </p>
            </div>

            {/* RIGHT FORM */}
            <div className="ck-form-panel">
              <div className="ck-form-heading">Book Personalised Report</div>

              <div className="ck-form-card">
                <div className="scroll-area">
                  <div className="ck-form-slider">
                    <div className="ck-form-track" style={{ transform: `translateX(-${step * 100}%)` }}>
                      {/* Slide 0 */}
                      <div className="ck-form-slide">
                        <div className="ck-form-inner">
                          <GeneralInformationForm
                            data={getGeneralFormData()}
                            onChange={handleGeneralFormChange}
                            showTitle={true}
                          />
                        </div>
                      </div>

                      {/* Slide 1 */}
                      <div className="ck-form-slide">
                        <div className="ck-form-inner">
                          <PrimaryNumberForm
                            data={getPrimaryFormData()}
                            onChange={handlePrimaryFormChange}
                            showTitle={true}
                          />
                        </div>
                      </div>

                      {/* Slide 2 */}
                      <div className="ck-form-slide">
                        <div className="ck-form-inner">
                          <ParallelNumbersForm
                            numbers={parallels}
                            onChange={updateParallel}
                            onAdd={addParallel}
                            onRemove={toggleRemoveParallel}
                            maxNumbers={MAX_PARALLEL_NUMBERS}
                            showTitle={true}
                          />
                        </div>
                      </div>

                      {/* Slide 3 */}
                      <div className="ck-form-slide">
                        <div className="ck-form-inner">
                          <PreviousNumbersForm
                            numbers={previousNumbers}
                            onChange={updatePrevious}
                            onAdd={addPrevious}
                            onRemove={removePrevious}
                            showTitle={true}
                          />
                        </div>
                      </div>

                      {/* Slide 4 OTP */}
                      <div className="ck-form-slide">
                        <div className="ck-form-inner">
                          <div className="ck-form-heading otp-title otp">OTP Verification</div>

                          {/* Primary OTP */}
                          <div className="ck-field-block">
                            <div className="ck-label">Primary Number</div>
                            <div className="ck-inline-inputs">
                              <div className="ck-input-flex readonly-input" style={{ display: "flex", alignItems: "center" }}>
                                {primary.isd} {primary.number}
                              </div>

                              {!otpPrimary.verified && (
                                <button
                                  type="button"
                                  className="ck-pill"
                                  onClick={sendOtpPrimary}
                                  disabled={otpPrimary.cooldown > 0}
                                >
                                  {otpPrimary.sent
                                    ? otpPrimary.cooldown > 0
                                      ? `Resend in ${otpPrimary.cooldown}s`
                                      : "Resend OTP"
                                    : "Send OTP"}
                                </button>
                              )}
                            </div>
                          </div>

                          {otpPrimary.sent && (
                            <div className="ck-field-block">
                              <div className="ck-inline-inputs">
                                <input
                                  className="ck-input-flex"
                                  placeholder="Enter OTP"
                                  value={otpPrimary.code}
                                  onChange={(e) =>
                                    setOtpPrimary((o) => ({ ...o, code: e.target.value }))
                                  }
                                  disabled={otpPrimary.verified}
                                />
                                <button
                                  type="button"
                                  className="ck-pill"
                                  onClick={verifyOtpPrimary}
                                  disabled={otpPrimary.verified}
                                >
                                  {otpPrimary.verified ? "Verified" : "Verify"}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Parallel OTPs */}
                          {parallels.map((p, i) => {
                            const status = otpParallels[i];
                            return (
                              <div key={i}>
                                <div className="ck-field-block">
                                  <div className="ck-label">Parallel Number #{i + 1}</div>

                                  <div className="ck-inline-inputs">
                                    <div className="ck-input-flex readonly-input" style={{ display: "flex", alignItems: "center" }}>
                                      {p.isd} {p.number}
                                    </div>

                                    <button
                                      type="button"
                                      className="ck-pill"
                                      onClick={() => sendOtpParallel(i)}
                                      disabled={status?.verified || status?.cooldown > 0}
                                    >
                                      {status?.verified
                                        ? "Verified"
                                        : status?.sent
                                        ? status.cooldown > 0
                                          ? `Resend in ${status.cooldown}s`
                                          : "Resend OTP"
                                        : "Send OTP"}
                                    </button>
                                  </div>
                                </div>

                                {status?.sent && (
                                  <div className="ck-field-block">
                                    <div className="ck-inline-inputs">
                                      <input
                                        className="ck-input-flex"
                                        placeholder="Enter OTP"
                                        value={status?.code || ""}
                                        onChange={(e) =>
                                          setOtpParallels((list) =>
                                            list.map((x, idx) =>
                                              idx === i ? { ...x, code: e.target.value } : x
                                            )
                                          )
                                        }
                                        disabled={status?.verified}
                                      />
                                      <button
                                        type="button"
                                        className="ck-pill"
                                        onClick={() => verifyOtpParallel(i)}
                                        disabled={status?.verified}
                                      >
                                        {status?.verified ? "Verified" : "Verify"}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FIXED NAV */}
                <div className="ck-fixed-nav">
                  <span
                    className="ck-prev-link"
                    onClick={step > 0 ? goPrev : undefined}
                    style={{ opacity: step === 0 ? 0.4 : 1 }}
                  >
                    &lt;&lt;&lt; prev
                  </span>

                  <span
                    className={"ck-next-link" + (step === 4 ? " disabled" : "")}
                    onClick={step < 4 ? goNext : undefined}
                  >
                    next &gt;&gt;&gt;
                  </span>
                </div>

                {/* PRICE + PROCEED */}
                <div className="ck-form-footer">
                  <div className="ck-price-pill">{priceText}</div>

                  <button
                    className={"ck-proceed-btn" + (proceedEnabled ? " ck-proceed-btn-ready" : "")}
                    onClick={handleProceed}
                    disabled={!proceedEnabled}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQS */}
        <section className="ck-faq-section">
          <div className="ck-faq-title">FAQs</div>
          <div className="ck-faq-list">
            {faqs.map((faq, index) => {
              const questionText = faq.question.replace(/^\d+\s*[-–]\s*/, "");
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={index}
                  className={"ck-faq-item" + (isOpen ? " ck-faq-item-active" : "")}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-row" style={{ cursor: "pointer" }}>
                    <button type="button" className={"faq-toggle" + (isOpen ? " open" : "")} aria-expanded={isOpen}>
                      <span className="faq-arrow">›</span>
                    </button>

                    <div className="faq-question">{questionText}</div>
                  </div>

                  {isOpen && <div className="faq-answer">{faq.answer}</div>}
                </div>
              );
            })}
          </div>

          <div className="ck-faq-footer pt-2" style={{ marginBottom: "1rem" }}>
            For any questions, write to us at hello@consciouskarma.co
          </div>
        </section>

        {/* Signup/Login Overlay */}
        {(showSignup || showLogin) && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            {showSignup && (
              <SignupModal
                onClose={() => setShowSignup(false)}
                onSwitch={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
              />
            )}

            {showLogin && (
              <LoginModal
                onClose={() => setShowLogin(false)}
                onSwitch={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
              />
            )}
          </div>
        )}

        {/* FOOTER */}
        <footer className="w-full bg-black text-white border-t-2 border-orange-400 py-3 sm:py-2 md:py-3">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
              <a href="/termsandconditions" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline">
                Terms & Conditions
              </a>
              <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />

              <a href="/privacy-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline">
                Privacy Policy
              </a>
              <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />

              <a href="/refund-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline">
                Refund Policy
              </a>
              <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />

              <a href="/shipping-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline">
                Shipping & Delivery
              </a>
              <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />

              <a href="/contact-us" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ConsciousKarmaPage;