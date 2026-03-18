// src/ConsciousKarmaSections.jsx
import React, { useEffect, useState, useRef } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import InstantReportForm from "./InstantReportForm.jsx";
import InlineInstantReportForm from "./components/InlineInstantReportForm.jsx";
import InlineInstantReportForm1 from "./components/InlineInstantReportForm1.jsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import TypingText from "./components/ui/shadcn-io/typing-text.jsx";
// import TypingLine from "./components/ui/shadcn-io/TypingLine.jsx";
import TypingParagraphs from "./components/ui/shadcn-io/TypingParagraphs.jsx";
import { motion, useMotionValue, useTransform } from "framer-motion";
// import DecryptedText from "./components/DecryptedText.jsx";
import FadeInOnScroll from "./components/FadeInOnScroll.jsx";
import CKNavbar from "./components/CKNavbar.jsx";

/* === Images (your filenames) === */
import loveImg from "./4.png";
import financeImg from "./2.png";
import fortuneImg from "./3.png";
import intelligenceImg from "./1.png";
import intuitionImg from "./5.png";
import earthGif from "./Earth Gif.gif";
import zeroPng from "./zero.png";
import karmaTransparent from "./ruondimgg.jpg";
import earthConnections from "./Earth connections.png";
import gradeImg from "./Grade.jpg";
import blog01 from "./Blog.1.jpg";
import blog02 from "./Blog.2.jpg";
import blog03 from "./Blog.3.jpg";
import blankStarImg from "./blank-star.jpg";
import mobileEnergyFlow from "./mobile number energy flow.png";
import SignupModal from "./SignupModal.jsx";
import LoginModal from "./LoginModal.jsx";

/* ===================== CONFIG: COMMON TEXT STYLE ===================== */
// Isse sabhi sections mein font size aur spacing same rahegi
const commonTextStyle = {
  fontSize: 'clamp(18px, 2.5vw, 19px)',
  lineHeight: '1.4',
  marginBottom: '0' // thoda gap maintain karne ke liye
};

/* ===================== MAIN PAGE ===================== */

export default function ConsciousKarmaSections() {

  const intl = useIntl();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [prefillIsd, setPrefillIsd] = useState("+91");
  const [prefillMobile, setPrefillMobile] = useState("");
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const distinctlyRef = useRef(null);
  const progress = useMotionValue(0);
  const dashOffset = useTransform(progress, [0, 1], [120, -120]);

  const journeyLines = [
    intl.formatMessage({ id: "digitalYantra.journey1" }),
    intl.formatMessage({ id: "digitalYantra.journey2" }),
    intl.formatMessage({ id: "digitalYantra.journey3" }),
    intl.formatMessage({ id: "digitalYantra.journey4" }),
  ];

  const highlightValue = (id) => (
    <span className="text-[#ff914d]">
      {intl.formatMessage({ id })}
    </span>
  );

  // -----> Intersection Observer for section animations <----- //
  const sectionWatcher = useRef(null);
  const [active, setActive] = useState(false);

  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showForm) setShowForm(false);
        if (showSignup) setShowSignup(false);
        if (showLogin) setShowLogin(false);
      }
    };
    // Attach listener if any modal is open
    if (showForm || showSignup || showLogin) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showForm, showSignup, showLogin]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true); // start animations
        } else {
          setActive(false); // reset
          setStep1Done(false);
          setStep2Done(false);
          setStep3Done(false);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionWatcher.current) observer.observe(sectionWatcher.current);

    return () => observer.disconnect();
  }, []);

  // Chain step2Done automatically once step1Done is achieved
  useEffect(() => {
    if (step1Done && !step2Done) {
      setStep2Done(true);
    }
  }, [step1Done, step2Done]);

  const parent = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.28 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // --- BLOG ITEMS (local demo data) ---
  const blogItems = [
    {
      img: blog01,
      title: intl.formatMessage({ id: "blogs.gradesEnergy.title" }),
      excerpt: intl.formatMessage({ id: "blogs.gradesEnergy.excerpt" }),
      content: intl.formatMessage({ id: "blogs.gradesEnergy.content" }),
    },
    {
      img: blog02,
      title: intl.formatMessage({ id: "blogs.luckyPattern.title" }),
      excerpt: intl.formatMessage({ id: "blogs.luckyPattern.excerpt" }),
      content: intl.formatMessage({ id: "blogs.luckyPattern.content" }),
    },
    {
      img: blog03,
      title: intl.formatMessage({ id: "blogs.energyFlow.title" }),
      excerpt: intl.formatMessage({ id: "blogs.energyFlow.excerpt" }),
      content: intl.formatMessage({ id: "blogs.energyFlow.content" }),
    },
  ];

  // ESC & scroll lock when overlay is open
  useEffect(() => {
    const overlayOpen = showForm || menuOpen;
    if (!overlayOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowForm(false);
        setMenuOpen(false);
      }
    };
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = prev;
    };
  }, [showForm, menuOpen]);

  // GSAP animation for "DISTINCTLY YOURS" section
  useEffect(() => {
    if (!distinctlyRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const linesEls = gsap.utils.toArray(".du-line");
      const highlights = gsap.utils.toArray(".du-highlight");
      const cta = document.querySelector(".du-cta");

      gsap.set(linesEls, { y: 20, opacity: 0 });
      gsap.set(highlights, { scale: 0.98, transformOrigin: "50% 50%" });
      if (cta) gsap.set(cta, { y: 12, opacity: 0 });

      const loop = gsap.to(highlights, {
        scale: 1,
        y: 0,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 4.5,
        delay: 1.8,
        paused: true,
      });
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: distinctlyRef.current,
          start: "top 75%",
          end: "bottom 25%",
          scrub: 0.6, // smooth, gradual show/hide tied to scroll
          onEnter: () => loop.play(),
          onEnterBack: () => loop.play(),
          onLeave: () => loop.pause(0),
          onLeaveBack: () => loop.pause(0),
        },
      });
      tl.to(linesEls, { duration: 0.7, y: 0, opacity: 1, stagger: 0.18 });
      tl.to(
        highlights,
        { duration: 0.45, scale: 1.06, y: -2, ease: "back.out(2)", stagger: 0.12 },
        "-=0.35"
      );
      if (cta) tl.to(cta, { duration: 0.7, y: 0, opacity: 1 }, "-=0.2");
    }, distinctlyRef);
    return () => ctx.revert();
  }, []);

  function openPrefilledModal({ isd, mobile }) {
    setPrefillIsd(isd);
    setPrefillMobile(mobile);
    setShowForm(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-50 font-arsenal overflow-x-hidden px-1 sm:px-6 md:px-8 lg:px-12 pt-2 sm:pt-6 md:pt-8 lg:pt-12 pb-0 ">
      {/* Animated rotating border button styles (applies to all CTA buttons) */}
      
      <style>{`
        .rotating-border-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;background:#000;color:#fff;border:2px solid #ff914d;border-radius:10px;overflow:hidden}
        .rotating-border-btn::before{content:"";position:absolute;inset:-2px;padding:2px;border-radius:inherit;background:conic-gradient(from 0deg, rgba(255,145,77,0.95), rgba(255,145,77,0.2) 18%, transparent 30%, transparent 70%, rgba(255,145,77,0.2) 82%, rgba(255,145,77,0.95));-webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:ckSpin 3.2s linear infinite;pointer-events:none}
        @keyframes ckSpin{to{transform:rotate(360deg)}}
        .rotating-border-btn:focus{outline:none;box-shadow:0 0 0 3px rgba(255,145,77,.25)}

        /* Fluid type helpers for consistent responsive text sizing */
        .text-fluid-16-20{font-size:clamp(16px,3.8vw,20px)}
        .text-fluid-18-24{font-size:clamp(18px,3.6vw,24px)}
        .text-fluid-18-30{font-size:clamp(18px,4vw,30px)}
        .text-fluid-24-30{font-size:clamp(24px,3.2vw,30px)}
      `}</style>
      <div className="absolute top-0 left-0 w-full z-50">
         <CKNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setShowSignup={setShowSignup} />
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMenuOpen(false)} />
      )}


      {/* HERO SECTION */}
      <section className="relative  bg-black flex flex-col pt-0 overflow-x-hidden"> 
        {/* //min-h-screen */}
        
        {/* BACKGROUND GRADIENT LINE (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent opacity-50" />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col justify-center items-center w-full relative  pt-20 md:pt-12 ">
          
          {/* 1. HERO TEXT SECTION */}
          <div className="text-center w-full px-4 mb-10 md:mb-14 md:mt-2">
            
            {/* FONT SIZE: Mobile ke liye 28px (Bada), Desktop ke liye 54px (Same as before) */}
            <h1 className="font-balgin font-light uppercase leading-[1.1] md:leading-[1.1] tracking-wide text-white text-center"
              style={{ fontSize: 'clamp(28px, 5vw, 54px)' }}>

              {/* LINE 1 */}
              <span className="block mb-1">
                <FormattedMessage id="hero.title.line1" defaultMessage="YOUR MOBILE NUMBER" />
              </span>

              {/* LINE 2 */}
              <span className="block md:inline">
                {/* Mobile Row 2 - Desktop gap reduced via md:mt-0 */}
                <span className="block md:inline mt-1 md:mt-0"> 
                  <FormattedMessage id="hero.title.line2" defaultMessage="IS THE" />
                  <span className="text-[#ff914d] font-normal">
                    {" "}
                    <FormattedMessage id="hero.title.key" defaultMessage="KEY" />
                    {" "}
                  </span>
                </span>

                {/* Mobile Row 3 */}
                <span className="block md:inline mt-1 md:mt-0">
                  <FormattedMessage id="hero.title.toAchieving" defaultMessage="TO ACHIEVING" />
                  <span className="md:hidden">
                      {" "}<FormattedMessage id="hero.tittle.line3" defaultMessage="YOUR" />
                  </span>
                </span>
              </span>

              {/* LINE 3 - Desktop gap reduced via md:mt-0 */}
              <span className="block mt-1 md:mt-0"> 
                <span className="hidden md:inline">
                  <FormattedMessage id="hero.tittle.line3" defaultMessage="YOUR " />
                </span>
                <span className="text-[#ff914d] font-normal">
                  <FormattedMessage id="hero.title.dreams" defaultMessage="DREAMS" />
                </span>
              </span>

            </h1>

            {/* Subtitles (No Changes) */}
            <div className="mt-6 md:mt-8 space-y-0 text-gray-200 font-thin tracking-wide">
              <p className="mb-4 text-[20px] md:text-[30px]">Every number carries a pattern</p>
              <p style={{ fontSize: 'clamp(16px, 1.5vw, 22px)' }}>
                Discover How a Mobile Number <br className="block sm:hidden" />
                Shapes Life’s Key Areas
              </p>
            </div>
          </div>

          {/* 2. ICONS SECTION */}
          <div className="w-full flex justify-center md:mb-16 mt-[-15px] md:mt-[-30px]">
            
            {/* Container */}
            <div className="
                grid grid-cols-[60px_1fr] gap-y-3 gap-x-4 items-center w-fit
                md:flex md:flex-row md:gap-12 lg:gap-20 md:w-auto 
            ">
              {[
                [financeImg, "Money & Work"],
                [fortuneImg, "Fortune"],
                [loveImg, "Charm & Love"],
                [intuitionImg, "Intuition"],
                [intelligenceImg, "Intelligence"],
              ].map(([src, label], i) => (
                <React.Fragment key={i}>
                  {/* Wrapper */}
                  <div className="contents md:flex md:flex-col md:items-center md:gap-4">
                    
                    {/* Icon */}
                    <div className="flex items-center justify-center">
                      {/* FIX 3: Increased Icon Sizes (w-14 mobile, w-20 desktop) */}
                      <img 
                        src={src} 
                        alt={label} 
                        className="w-14 h-14 md:w-20 md:h-20 object-contain" 
                      />
                    </div>

                    {/* Text */}
                    <span className="text-white font-light text-left md:text-center whitespace-nowrap md:whitespace-normal md:max-w-[120px] leading-tight" style={{ fontSize: 'clamp(18px, 2.5vw, 20px)' }}>
                      {label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 3. FORM SECTION */}
          <div className="w-full max-w-[340px] md:max-w-[420px] px-4 mt-10 md:mt-3">
            <InlineInstantReportForm
              ctaLabel={intl.formatMessage({ id: "form.ctaInstantReport" })}
              onSubmit={openPrefilledModal}
            />
          </div>

        </div>

        {/* ... (Navbar logic remains) ... */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMenuOpen(false)} />
        )}
        <CKNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setShowSignup={setShowSignup} />
        <div style={{ height: "250px" }} />
      </section>


      {/* WHAT IS THIS */}
      <section className="relative bg-black flex items-center justify-center  px-4 sm:px-6">
        {/* pt-8 sm:pt-10 md:pt-12 lg:pt-[44px] pb-8 sm:pb-10 md:pb-12 lg:pb-[64px] */}
        <div className="container mx-auto max-w-full text-center flex flex-col justify-center">
          <h2 className="font-balgin leading-[1.05] mb-8 sm:mb-10 md:mb-12 lg:mb-16 font-bold tracking-[0.02em] text-white" style={{ fontSize: 'clamp(20px, 2.8vw, 25px)' }}>
            <FormattedMessage id="whatIsThis.title" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-[44px] items-center justify-items-center">
            {/* Earth section */}
            <div className="flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6 lg:gap-[22px] w-full max-w-[320px]">
              <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] rounded-full grid place-items-center bg-transparent overflow-hidden">
                <img
                  src={earthGif}
                  alt={intl.formatMessage({ id: "alt.earthRotating" })}
                  className="w-full h-full object-cover"
                />
              </div>
              <p
                className="text-gray-200 font-thin w-full px-2 sm:px-0 whitespace-pre-line inline-block"
                style={commonTextStyle}
              >
                <FormattedMessage
  id="whatIsThis.universe.line1"
  values={{
    patterns: <span className="text-[#ff914d] font-normal">patterns</span>
  }}
/>
                <FormattedMessage id="whatIsThis.universe.line2" />
                <FormattedMessage id="whatIsThis.universe.line3" />
              </p>
            </div>

            {/* Zero section */}
            <div className="flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6 lg:gap-[22px] w-full max-w-[320px]">
              <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] rounded-full grid place-items-center bg-transparent overflow-hidden">
                <img
                  src={zeroPng}
                  alt={intl.formatMessage({ id: "alt.zeroSymbol" })}
                  className="w-full h-85 mr-6  object-cover scale-[1.02]"
                />
              </div>

              <p
                className="text-gray-200 font-thin w-full px-2 sm:px-0 whitespace-pre-line inline-block"
                style={commonTextStyle}
              >
                <FormattedMessage
                  id="whatIsThis.numbers.line1"
                  values={{
                    numbers: <span style={{ color: "#ff914d" }}>{intl.formatMessage({ id: "whatIsThis.numbers" })}</span>,
                    symbols: <span style={{ color: "#ff914d" }}>{intl.formatMessage({ id: "whatIsThis.symbols" })}</span>
                  }}
                />
                <FormattedMessage
  id="whatIsThis.numbers.line2"
  values={{
    numericalSystems: <span className="text-[#ff914d] font-normal">numerical systems</span>
  }}
/>
                <FormattedMessage id="whatIsThis.numbers.line3" />
              </p>
            </div>

            {/* Karma section */}
            <div className="flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6 lg:gap-[22px] w-full max-w-[320px] md:col-span-2 lg:col-span-1">
              <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] rounded-full grid place-items-center bg-transparent overflow-hidden">
                <img
                  src={karmaTransparent}
                  alt={intl.formatMessage({ id: "alt.karmaSymbol" })}
                  className="w-70 h-81 mr-8 object-contain scale-[1.5]"
                  style={{ width: "14rem", marginLeft: "30px" }}
                />
              </div>

              <p
                className="text-gray-200 font-thin w-full px-2 sm:px-0 whitespace-pre-line inline-block"
                style={commonTextStyle}
              >
                <FormattedMessage
  id="whatIsThis.karma.line1"
  values={{
    patternsAligned: <span className="text-[#ff914d] font-normal">patterns we align with </span>
  }}
/>
                <FormattedMessage
                  id="whatIsThis.karma.line2"
                  values={{
                    destiny: <span style={{ color: "#ff914d" }}>{intl.formatMessage({ id: "whatIsThis.karma.destiny" })}</span>
                  }}
                />
                <br />
                <FormattedMessage id="whatIsThis.karma.line3" />
                <br />
                <FormattedMessage id="whatIsThis.karma.line4" style="color: black" />
              </p>
            </div>
          </div>
        </div>

        {/* Gradient line at bottom */}
        <div style={{ height: "250px" }} />
      </section >

      {/* MOBILE NUMBER ENERGY FLOW SECTION */}
      {/* MOBILE NUMBER ENERGY FLOW SECTION */}
      <div style={{ height: "250px" }} />
<motion.section
  className="relative bg-black flex flex-col items-center justify-center  px-2 sm:px-6"
  variants={parent}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.25 }}
>
  <div className="container mx-auto text-center max-w-5xl">
    <motion.div variants={item}>
      <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-12">
        {/* YAHAN CHANGE HAI: Ek single <p> tag use karo */}
        {/* Yahan update karein */}
<p className="m-0 text-gray-200 font-thin w-full px-2 sm:px-0" style={commonTextStyle}>
  <span className="text-white inline md:block">
    <FormattedMessage id="mobileEnergy.line1" />
  </span>
  {" "}
  <span className="text-white inline md:block">
    <FormattedMessage id="mobileEnergy.line2" />
  </span>
  {" "}
  <span className="inline md:block">
  <FormattedMessage 
    id="mobileEnergy.line3" 
    values={{
      distinctPattern: <span className="text-[#ff914d] font-normal">distinct pattern</span>
    }}
  />
</span>
  {" "}
  <span className="inline md:block">
    <FormattedMessage id="mobileEnergy.line4" />
  </span>
</p>
      </div>
    </motion.div>

    {/* Image wala part same rahega... */}
    <motion.div variants={item}>
      <div className="w-full flex justify-center px-1 sm:px-0">
        <img src={mobileEnergyFlow} alt={intl.formatMessage({ id: "mobileEnergy.altImage" })} className="w-full sm:w-[365px] max-w-2xl h-auto" />
      </div>
    </motion.div>
  </div>
  <div style={{ height: "250px" }} />
</motion.section>

      {/* DISTINCTLY YOURS */}
      {/* DISTINCTLY YOURS */}
<section className="relative bg-black flex flex-col items-center justify-center text-center px-4 sm:px-6">
  {/* py-12 sm:py-16 md:py-20 lg:py-[72px]  */}
  <div className="container mx-auto">
    
    {/* YAHAN CHANGE HAI: Saare alag <p> hata kar ek single <p> mein daal diya */}
    <p className="text-gray-200 font-thin text-[20px] md:text-[30px]" >
      <FormattedMessage
        id="distinctly.line1"
        values={{ shared: highlightValue("distinctly.shared") }}
      />
      <br />
      <FormattedMessage
        id="distinctly.line2"
        values={{ repeated: highlightValue("distinctly.repeated") }}
      />
      <br />
      <FormattedMessage id="distinctly.line3" />
      <br />
      <FormattedMessage
  id="distinctly.line4"
  values={{ 
    distinctlyYours: <span className="text-[#ff914d] font-normal">DISTINCTLY YOURS</span> 
  }}
/>
    </p>

    <p className="mt-0 sm:mt-16 md:mt-20 lg:mt-[170px] text-[#ff914d] font-light text-[20px] md:text-[30px]">
      <a
        href="/personalised-report"
        className="inline-block mt-16 sm:mt-16 md:mt-20 lg:mt-[170px]
          text-[#ff914d] font-light hover:opacity-80 transition-opacity no-underline"
      
      >
        <FormattedMessage id="distinctly.line5" />
      </a>
    </p>
  </div>
  <div style={{ height: "250px" }} />
</section>

      {/* WOVEN / EARTH CONNECTIONS SECTION */}
      <motion.section
        className="relative bg-black flex flex-col items-center justify-center px-4 sm:px-6 text-center"
        // py-10
        variants={parent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Static Typography with line breaks */}
        <motion.div
          variants={item}
          className="max-w-3xl mx-auto mb-8 relative"
        >
          <p className="mb-1 text-gray-200 font-thin" style={commonTextStyle}>
  <span className="inline md:block">
    <FormattedMessage id="woven.line1" />
  </span>
  {" "}
  <span className="inline md:block">
    <FormattedMessage id="woven.line2" />
  </span>
  {" "}
  <span className="inline md:block">
    <FormattedMessage id="woven.line3" />
  </span>
  {" "}
  <span className="inline md:block">
  <FormattedMessage 
    id="woven.line4" 
    values={{
      shapesYourKarma: <span className="text-[#ff914d] font-normal">shapes your karma</span>
    }}
  />
</span>
</p>
        </motion.div>

        {/* Image */}
        <motion.div variants={item} className="mt-8">
          <img
            src={earthConnections}
            alt={intl.formatMessage({ id: "woven.altImage" })}
            className="w-[260px] sm:w-[320px] md:w-[380px] lg:w-[350px] mx-auto"
          />
        </motion.div>

        {/* Bottom gradient line */}
        <div style={{ height: "250px" }} />
      </motion.section >

      {/* DIGITAL AGE YANTRA + TYPING EFFECT INSTEAD OF DECRYPT */}
      <section
        className="relative bg-black flex flex-col items-center justify-center text-center px-4"
      >
        <div className="container mx-auto max-w-[760px] text-center">

          {/* TOP HEADING */}
          <p className="text-gray-200 font-thin mb-10" style={commonTextStyle}>
  <span className="inline md:block">
    <FormattedMessage id="digitalYantra.line1" />
  </span>
  {" "}
  <span className="inline md:block">
    <FormattedMessage id="digitalYantra.line2" />
  </span>
</p>
          <br />

          {/* TYPING EFFECT 4-LINES */}
          <div className="">
            {/* mb-10 */}
            <p className="text-white font-thin mb-0" style={commonTextStyle}>
              {journeyLines[0]}
            </p>
            <p className="text-white font-thin" style={commonTextStyle}>
              {journeyLines[1]}
            </p>
            <p className="text-white font-thin" style={commonTextStyle}>
              {journeyLines[2]}
            </p>
            <p className="text-white font-thin" style={commonTextStyle}>
              {journeyLines[3]}
            </p>
            <br />
            <p className="text-gray-200 font-thin mb-10" style={commonTextStyle}>
  <FormattedMessage id="digitalYantra.line3" /><br />
  <FormattedMessage 
    id="digitalYantra.line4" 
    values={{
      greatestAsset: <span className="text-[#ff914d] font-normal">It is your greatest asset — the code of your journey</span>
    }}
  />

          </p>
          <br />
          <br />
          <br /><br />
          <a
            href="/consult"
            className="text-[#ff914d] font-thin no-underline hover:opacity-80 mb-0" 
            style={commonTextStyle}
          >
            <FormattedMessage id="digitalYantra.cta" />
          </a>

          </div>


          {/* MIDDLE SECTION */}
          

          

        </div>
        <div style={{ height: "250px" }} />
      </section >

      {/* BLOGS */}
      {/* BLOGS */}
      <section
          id="blogs"
          className="relative bg-black flex flex-col items-center justify-center  px-4 sm:px-6 mt-0"
         >
          {/* py-12 sm:py-16 md:py-20 lg:py-[72px] */}
          <div className="container mx-auto text-center w-full">
            {/* Heading */}
            <h2 className="font-balgin text-white mb-8 sm:mb-10 md:mb-12 lg:mb-[40px]" style={{ fontSize: 'clamp(22px, 3vw, 28px)' }}>
              <FormattedMessage id="blogs.title" />
            </h2>
  
            {/* Blog Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-[24px] justify-items-center max-w-[1200px] mx-auto">
              {blogItems.map((b, i) => (
                i === 0 ? (
                  <a
                    key={i}
                    href="/blogs"
                    className="w-full max-w-[380px] border-2 border-[#ff914d] rounded-lg overflow-hidden bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition-all block"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="aspect-square bg-black flex items-center justify-center">
                      {b.img ? (
                        <img
                          src={b.img}
                          alt={b.title}
                          className="w-full h-400 object-cover"
                        />
                      ) : (
                        <div className="text-5xl sm:text-6xl">✦</div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 md:p-6 text-left">
                      <h3 className="text-2xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">
                        {b.title}
                      </h3>
                      <p className="text-gray-300 text-md md:text-md mb-3 sm:mb-4">
                        {b.excerpt}
                      </p>
                      <div className="mt-2">
                        <span className="text-[#ff914d] font-semibold text-sd md:text-sm hover:text-orange-300">
                          <FormattedMessage id="blogs.readMore" />
                        </span>
                      </div>
                    </div>
                  </a>
                ) : i === 1 ? (
                  <a
                    key={i}
                    href="/blog/how-to-read-mobile-number"
                    className="w-full max-w-[380px] border-2 border-[#ff914d] rounded-lg overflow-hidden bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition-all block"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="aspect-square bg-black flex items-center justify-center">
                      {b.img ? (
                        <img
                          src={b.img}
                          alt={b.title}
                          className="w-full h-400 object-cover"
                        />
                      ) : (
                        <div className="text-5xl sm:text-6xl">✦</div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 md:p-6 text-left">
                      <h3 className="text-2xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">
                        {b.title}
                      </h3>
                      <p className="text-gray-300 text-md md:text-md mb-3 sm:mb-4">
                        {b.excerpt}
                      </p>
                      <div className="mt-2">
                        <span className="text-[#ff914d] font-semibold text-sd md:text-sm hover:text-orange-300">
                          <FormattedMessage id="blogs.readMore" />
                        </span>
                      </div>
                    </div>
                  </a>
                ) : i === 2 ? (
                  <a
                    key={i}
                    href="/blog/how-to-choose-mobile-number"
                    className="w-full max-w-[380px] border-2 border-[#ff914d] rounded-lg overflow-hidden bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition-all block"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="aspect-square bg-black flex items-center justify-center">
                      {b.img ? (
                        <img
                          src={b.img}
                          alt={b.title}
                          className="w-full h-400 object-cover"
                        />
                      ) : (
                        <div className="text-5xl sm:text-6xl">✦</div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 md:p-6 text-left">
                      <h3 className="text-2xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">
                        {b.title}
                      </h3>
                      <p className="text-gray-300 text-md md:text-md mb-3 sm:mb-4">
                        {b.excerpt}
                      </p>
                      <div className="mt-2">
                        <span className="text-[#ff914d] font-semibold text-sd md:text-sm hover:text-orange-300">
                          <FormattedMessage id="blogs.readMore" />
                        </span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div
                    key={i}
                    className="w-full max-w-[380px] border-2 border-[#ff914d] rounded-lg overflow-hidden bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition-all"
                  >
                    <div className="aspect-square bg-black flex items-center justify-center">
                      {b.img ? (
                        <img
                          src={b.img}
                          alt={b.title}
                          className="w-full h-400 object-cover"
                        />
                      ) : (
                        <div className="text-5xl sm:text-6xl">✦</div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 md:p-6 text-left">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">
                        {b.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 sm:mb-4">
                        {b.excerpt}
                      </p>
  
                      {expandedBlog === i ? (
                        <div className="mt-2 text-sm text-gray-200">
                          <p className="mb-3">{b.content}</p>
                          <button
                            className="btn text-sm px-3 py-2"
                            onClick={() => setExpandedBlog(null)}
                            aria-expanded={true}
                          >
                            <FormattedMessage id="blogs.readLess" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <button
                            className="text-[#ff914d] font-semibold text-sm hover:text-orange-300"
                            onClick={() => setExpandedBlog(i)}
                            aria-expanded={false}
                          >
                            <FormattedMessage id="blogs.readMore" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
  
            {/* Bottom "more >>>" */}
            <div className="mt-[20px] text-right w-full max-w-[960px] mx-72">
              {/* <a href="/blogs" className="text-white font-light" style={{ fontSize: 'clamp(18px, 2.2vw, 20px)' }}>
                <FormattedMessage id="blogs.more" />
              </a> */}
            </div>
          </div>
  
          {/* Bottom gradient line */}
          <div style={{ height: "250px" }} />
        </section >
      {/* FINAL CTA */}
      <section className="relative min-h-screen bg-black flex flex-col items-center justify-center py-10 sm:py-12 md:py-[45px] px-4 sm:px-6" >
        <div className="container mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-7 md:space-y-8 mb-8 sm:mb-12">

          <p className="font-thin text-white max-w-full sm:max-w-[620px] mx-auto mb-[8px] sm:mb-8" style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', lineHeight: '1' }}>
            <span className="block whitespace-nowrap sm:whitespace-normal" style={{ marginBottom: 'clamp(4px, 0.5vw, 8px)' }}>
              <FormattedMessage id="finalCta.line1" />
            </span>
            <span className="block"><FormattedMessage id="finalCta.line2" /></span>
          </p>

          {/* Icon Row */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full overflow-x-auto px-4 scrollbar-hide mb-3 md:mb-0 mt-4 md:mt-0" style={{ marginTop: '0rem !important', marginBottom: '0rem !important' }}>
            {[financeImg, fortuneImg, loveImg, intuitionImg, intelligenceImg].map(
              (src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0 object-contain"
                />
              )
            )}
          </div>

          {/* Form Section */}
            <div className="w-[300px] sm:w-[300px] md:w-[340px] mt-10 sm:mt-[8px] flex flex-col items-center justify-center">
            <InlineInstantReportForm1
              ctaLabel={intl.formatMessage({ id: "form.ctaInstantReport" })}
              onSubmit={openPrefilledModal}
            />
          </div>
        </div>
      </section >

      {/* Global Footer */}
      <footer className="mt-auto w-screen relative left-1/2 -translate-x-1/2 bg-black text-white border-t-2 border-[#ff914d] py-3 sm:py-2 md:py-3" >
        <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5">

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
            <a
              href="/termsandconditions"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              <FormattedMessage id="footer.termsConditions" />
            </a>
            <hr
              style={{
                border: "none",
                background: "white",
                width: "1px",
                height: "15px",
                opacity: "1",
                margin: "0",
              }}
            />

            <a
              href="/privacy-policy"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              <FormattedMessage id="footer.privacyPolicy" />
            </a>
            <hr
              style={{
                border: "none",
                background: "white",
                width: "1px",
                height: "15px",
                opacity: "1",
                margin: "0",
              }}
            />

            <a
              href="/refund-policy"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              <FormattedMessage id="footer.refundPolicy" />
            </a>
            <hr
              style={{
                border: "none",
                background: "white",
                width: "1px",
                height: "15px",
                opacity: "1",
                margin: "0",
              }}
            />

            <a
              href="/shipping-policy"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              <FormattedMessage id="footer.shippingDelivery" />
            </a>
            <hr
              style={{
                border: "none",
                background: "white",
                width: "1px",
                height: "15px",
                opacity: "1",
                margin: "0",
              }}
            />

            <a
              href="/contact-us"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              <FormattedMessage id="footer.contactUs" />
            </a>
          </div>
        </div>
        
      </footer >
{showForm && (
  <div 
    className="fixed inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => setShowForm(false)}
  >
    <div 
      className="bg-black border-2 border-[#ff914d] rounded-[16px] p-0 max-w-[400px] w-full max-h-[70vh] relative flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >

        <div className="" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px", marginLeft: "16px", marginRight: "16px", fontSize: "20px", fontWeight: "700",paddingTop:"5px", flexShrink: 0 }}>
          <p  style={{fontSize:"28px",fontWeight:"300",marginBottom:"2rem"}}>Instant Report</p>
        </div>

      {/* Form */}
      <InstantReportForm
        ctaLabel="Proceed"
        initialIsd={prefillIsd}
        initialMobile={prefillMobile}
        onSubmit={(data) => {
          console.log("Submitted:", data);
          alert(`Generating and sending report for ${data.full}...`);
          setShowForm(false);
        }}
      />

    </div>
  </div>
)}

{/* === GLOBAL SIGNUP + LOGIN MODALS === */}
{/* === GLOBAL SIGNUP + LOGIN MODALS === */}
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

    </div>
  );
}