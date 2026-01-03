// src/ConsciousKarmaSections.jsx
import React, { useEffect, useState } from "react";
import InstantReportForm from "./InstantReportForm.jsx";

/* === Images (your filenames) === */
import loveImg from "./Love.jpg";
import financeImg from "./Finance.jpg";
import fortuneImg from "./Fortune.png";
import intelligenceImg from "./Intelligence.jpg";
import intuitionImg from "./Intuition.jpg";
import earthGif from "./Earth Gif.gif";
import zeroPng from "./zero.png";
import karmaTransparent from "./Karma transparent.png";
import earthConnections from "./Earth connections.png";
import gradeImg from "./Grade.jpg";
import blankStarImg from "./blank-star.jpg";
import mobileEnergyFlow from "./mobile number energy flow.png";
import Typewriter from "./Typewriter.jsx";

/* ============ THEME & LAYOUT (Injected CSS) ============ */
const CSS = `
/* --------- Fonts --------- */
/* Balgin (self-host under /public/fonts/Balgin/*) */
@font-face{ font-family:'Balgin'; src:url('/fonts/Balgin/Balgin-ExtraLight.woff2') format('woff2'), url('/fonts/Balgin/Balgin-ExtraLight.woff') format('woff'); font-weight:200; font-style:normal; font-display:swap; }
@font-face{ font-family:'Balgin'; src:url('/fonts/Balgin/Fontspring-DEMO-balgin-extralight.otf') format('opentype'); font-weight:200; font-style:normal; font-display:swap; }

/* use it on your headline */
h1.headline, h2.headline, h3.headline, .headline{ font-family:'Balgin', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif !important; font-size:clamp(28px,4vw,80px); line-height:1.06; letter-spacing:.02em; margin:0; }
.headline .accent{ color:var(--accent,#ff8a3d); }

/* Arsenal (Google) also loaded via <link> below */
:root{
  --bg:#000; --text:#f2f2f2; --muted:#dcdcdc;
  --accent:#ff8a3d; --accent-700:#f07a2e;
  --line:#2a2a2a; --shadow:0 10px 30px rgba(0,0,0,.35);
  --font-body:'Arsenal',system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica,Arial,sans-serif;
  --font-display:'Balgin','Arsenal',system-ui,sans-serif;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;background:var(--bg);color:var(--text);font:18px/1.6 var(--font-body)}
a{color:var(--accent);text-decoration:none}
img{max-width:100%;height:auto;display:block}

.container{max-width:1280px;margin:0 auto;padding:0 24px}
.section{padding:72px 0;position:relative;background:#000}
/* === Divider (hairline + gradient bar) applied to every .section via <Divider/> === */
.section .divider-top{position:absolute;left:0;right:0;top:0;height:1px;background:rgba(255,255,255,0.06)}
.section .divider-bottom{position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg, rgba(0,0,0,0) 0%, #2a2a2a 12%, #3c3c3c 50%, #2a2a2a 88%, rgba(0,0,0,0) 100%);box-shadow:0 1px 0 rgba(0,0,0,0.7) inset}

/* --------- Type --------- */
.h1,.h2,.h3,.headline{font-family: 'Balgin', system-ui, -apple-system, Segoe UI, Roboto, sans-serif!important;}
.h1{font-size:clamp(34px,4.5vw,40px);line-height:1.1;margin:0 0 14px}
.h2{font-size:clamp(30px,4vw,52px);line-height:1.1; margin:0 0 10px}
.h3{font-size:clamp(16px,3.2vw,24px);line-height:1.15;margin:0 0 10px}
.lead{color:var(--muted);max-width:72ch}
.center{text-align:center}

.headline{ font-family: 'Balgin', system-ui, -apple-system, Segoe UI, Roboto, sans-serif; font-size:clamp(18px,3vw,64px); line-height:1.08; font-weight:700; letter-spacing:.02em; text-transform:uppercase; }
.headline .accent{color:var(--accent)}

/* --------- Navbar (text-only brand) --------- */
.heroNav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
.brandRow{display:flex;align-items:center}
.brandMark{line-height:1}
.brandTop{ font-family:'Arsenal',system-ui,sans-serif; font-size:clamp(24px,2.2vw,32px); letter-spacing:.2px; color:#fff; display:block; }
.brandBottom{ font-family:'Balgin','Arsenal',system-ui,sans-serif; font-size:clamp(28px,2.4vw,36px); letter-spacing:2px; color:var(--accent); display:block; margin-top:2px; }

/* --------- Hero --------- */
.heroStage{min-height:74vh;display:grid;grid-template-rows:auto 1fr}
.heroGrid{display:grid;grid-template-columns:1fr;gap:28px;align-items:center}
@media(min-width:980px){.heroGrid{grid-template-columns:1.2fr .8fr}}
.heroRight{display:grid;row-gap:16px;justify-items:center}
.heroStage .lead{ font-family:'Arsenal',system-ui,sans-serif; font-size: clamp(14px, 2vw, 30px); line-height:1.35;color:#c8c8c8;margin:0 0 6px;text-align:center; }

/* Right column / Icon list */
.iconCol{display:block;margin:0;padding:0}
.bigBadge{display:flex;align-items:center;gap:33px;margin:0}
.bigBadge img{width:clamp(64px,2.2vw,102px);height:clamp(90px,5.2vw,120px);object-fit:contain;border-radius:14px;display:block}
.bigBadge .label{font-family:'Arsenal',system-ui,sans-serif;font-size:clamp(18px,3.2vw,31px);line-height:1;margin:0}

/* Form + actions */
.formWrap{padding:14px;background:rgba(255,255,255,.03);}
.formRow{display:grid;grid-template-columns:120px 1fr;gap:12px}
select,.input{ appearance:none;width:100%;padding:14px;border:1px solid #555;border-radius:10px;background:#121212;color:var(--text); font-size:16px;font-family:var(--font-body) }
.input{max-width:420px}
.btn{display:inline-flex;align-items:center;justify-content:center;border:2px solid var(--accent) ;border-radius:14px;padding:14px 18px;background:black;color:var(--accent);font-weight:800;cursor:pointer;font-family:var(--font-display)}
.btn:hover{background:var(--accent-700);color:#000}
.inline{display:flex;gap:12px;flex-wrap:wrap;margin-top:14px}
.priceTag{font-weight:700;font-family:var(--font-display);font-size:28px;color:var(--accent)}
.actionsRow{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:14px}

/* PDF icon link */
.pdfLink{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border:1px solid #6b6b6b;border-radius:10px;background:#141414;color:var(--accent)}
.pdfLink:hover{color:var(--accent-700);border-color:#8a8a8a;background:#161616}
.pdfIcon{width:22px;height:22px;display:block}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

/* --------- “What is this” (3 icons) --------- */
.centerBlock{max-width:960px;margin:0 auto;text-align:center}
.grid3{display:grid;grid-template-columns:1fr;gap:40px;align-items:start;justify-items:center}
@media (min-width:1100px){.grid3{grid-template-columns:repeat(3,1fr)}}
.iconCard{display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px;max-width:360px}
.iconCard p{margin:0;line-height:1.6;font-size:18px;color:#eaeaea}

/* Uniform, equal-height icon circles (Earth/0/Karma) */
.iconCircle{ width: clamp(180px, 14vw, 220px); height: clamp(180px, 14vw, 220px); border-radius: 50%; display:grid;place-items:center; background:transparent;overflow:hidden; }
.iconCircle img{width:100%;height:100%;object-fit:cover;display:block}
.iconCircle.--sketch img{transform:scale(1.06)}

/* --------- Blog cards --------- */
.blogGrid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:960px){.blogGrid{grid-template-columns:repeat(3,1fr)}}
.blogCard{padding:16px;background:rgba(255,255,255,.03);border:1px solid #3a3a3a;border-radius:14px;box-shadow:var(--shadow)}
.blogCard h4{margin:8px 0 6px;font-size:18px;font-family:var(--font-display)}
.blogCard p{color:#dcdcdc;font-family:var(--font-body)}

/* --------- Modal --------- */
.modalOverlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);display:grid;place-items:center;z-index:1000}
.modal{width:min(720px,92vw);max-height:86vh;overflow:auto;background:#0f0f0f;border:1px solid #3a3a3a;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);padding:24px;position:relative}
.modalClose{position:absolute;top:10px;right:14px;width:auto;height:auto;border-radius:0;border:none;background:transparent;color:#bcbcbc;font-size:22px;cursor:pointer;padding:0}

/* ==== UNIQUE SEQUENCE split layout + typewriter ==== */
.split2{ display:grid; grid-template-columns: 1.1fr .9fr; gap:48px; align-items:center; }
@media (max-width: 980px){ .split2{ grid-template-columns:1fr; gap:28px; } }
.split2 .left .lead{ text-align:left; }
.splitImg{ width:100%; border-radius:14px; box-shadow: var(--shadow); margin: 14px 0 16px; }
.rightBlock{ text-align:right; display:grid; row-gap:16px; justify-items:end; }
.rightHeading{ font-family:'Balgin','Arsenal',system-ui,sans-serif; font-weight:300; font-size: clamp(32px, 2.6vw, 64px); line-height: 1.18; letter-spacing: .01em; }
.split2 .right .lead{ text-align:right; }
.caret{ display:inline-block; width:2px; height:1em; background: var(--accent); margin-left:4px; vertical-align: -0.12em; animation: caretBlink 1s steps(1) infinite; }
@keyframes caretBlink { 50% { opacity: 0; } }
.tpList{ list-style:none; margin:6px 0 0; padding:0; width:100%; max-width:700px }
.tpItem{ display:flex; gap:10px; align-items:flex-start; margin:8px 0 }
.tpBullet{ width:8px; height:8px; border-radius:50%; background:var(--accent); margin-top:.65em }
.tpText{ flex:1; line-height:1.5 }
.rightBlock{ text-align: left; display: grid; row-gap: 16px; justify-items: start; }
.rightHeading{ text-align: left; }
.split2 .right .lead{ text-align: left; }
.rightBlock .plainWrap { justify-self: stretch; text-align: left; }
.tpPlain{ display: grid; row-gap: 0; margin: 0; padding: 0; }
.tpLine{ margin: 0; line-height: 1.18; font-size: clamp(13px, 1.1vw, 17px); letter-spacing: .01em; text-align: left; direction: ltr; white-space: normal; }

/* ==== WOVEN (left globe / right content + effects) ==== */
.wovenGrid{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}
@media(max-width:980px){.wovenGrid{grid-template-columns:1fr;gap:28px}}
.globeWrap{position:relative}
.globeImg{width:100%;max-width:720px;border-radius:14px;box-shadow:var(--shadow);opacity:.95}
.copyWrap{position:relative;z-index:1;text-align:left}
.weaveHeading{margin:0 0 8px;font-family:'Balgin','Arsenal',system-ui,sans-serif; font-weight:300;font-size:clamp(28px,3.2vw,52px);line-height:1.12;letter-spacing:.02em}
.weavePara{margin:8px 0 0}

/* === Centered blocks === */
#final-cta .heroGrid{ display:grid; grid-template-columns: 1fr 1fr; gap:32px; align-items:center; justify-items:center; }
@media (max-width: 980px){ #final-cta .heroGrid{ grid-template-columns:1fr; } }
#final-cta .h2{ text-align:center; margin: 0 0 12px; font-size: clamp(26px, 3vw, 32px); line-height: 1.15; }
#final-cta .iconCol{ display:flex; justify-content:center; align-items:center; flex-wrap:wrap; margin-top: 10px; }
#final-cta .bigBadge{ display:flex; flex-direction:column; align-items:center; gap:8px; min-width: 116px; }
#final-cta .bigBadge img{ width: clamp(70px, 7vw, 100px); height: clamp(70px, 4vw, 100px); object-fit: contain; border-radius: 14px; }
#final-cta .bigBadge .label{ font-family:'Arsenal',system-ui,sans-serif; font-size: 16px; line-height: 1; }
#final-cta .ctaWrap{ display:grid; justify-items:center; gap:12px; }
#final-cta .ctaWrap .actionsRow{ justify-content:center; }
#final-cta .ctaWrap .inline{ justify-content:center; }

/* Poster helpers */
.poster{ display:grid; justify-items:center; row-gap:36px; }
.posterTitle{ font-size: 32px; line-height: 1.18; text-align: center; margin: 0; }
.posterImg{ width: min(790px, 63vw); display: block; margin: 0 auto; border-radius: 14px; }
.posterCaption{ font-size: 32px; line-height: 1.32; text-align: center; margin: 0; max-width: 558px; }

.mantra{ display: grid; justify-items: center; row-gap: clamp(22px, 3.6vw, 48px); }
.mantraLine{ margin: 0; text-align: center; font-size: clamp(28px, 4.6vw, 56px); line-height: 0; letter-spacing: .01em; }
.mantraEm{ font-size: clamp(34px, 6vw, 72px); letter-spacing: .02em; }
.mantraCta{ margin-top: clamp(10px, 1.8vw, 18px); font-size: clamp(16px, 1.6vw, 22px); }
.ctaLink{ color: var(--accent); font-weight: 700; text-decoration: none; }

.yantra{ display:grid; justify-items:center; row-gap: clamp(22px, 3.6vw, 42px); }
.yantraGroup{ display:grid; justify-items:center; row-gap: clamp(10px, 1.6vw, 16px); }
.yantraLine{ margin: 0; text-align: center; font-size: clamp(28px, 4.6vw, 32px); line-height: 1.22; letter-spacing: .01em; }
.yantraEm{ color: var(--accent); font-weight:700 }
.yantraCta{ margin-top: clamp(12px, 2vw, 24px); font-size: clamp(16px, 1.6vw, 22px); }

.wovenPoster{ display:grid; justify-items:center; row-gap: clamp(24px, 4vw, 44px); }
.wovenGlobe{ width: min(580px, 70vw); max-width: 100%; border-radius: 14px; box-shadow: var(--shadow); margin: 0 auto; }
.wovenCopy{ margin: 0; text-align: center; font-size: clamp(28px, 4.6vw, 32px); line-height: 1.32; letter-spacing: .01em; max-width: 743px; }
.wovenCopy .accent{ color: var(--accent); }

#final-cta .ctaPoster{ display:grid; justify-items:center; row-gap: clamp(18px,4vw,36px); }
#final-cta .ctaTitle{ margin:0; text-align:center; font-size: clamp(28px, 4.6vw, 32px); line-height:1.25; letter-spacing:.01em; }
#final-cta .ctaIcons{ display:flex; align-items:center; justify-content:center; gap: clamp(18px,5vw,46px); }
#final-cta .ctaIcons img{ width: clamp(52px,7vw,84px); height: clamp(52px,7vw,84px); object-fit:contain; border-radius:14px; }
#final-cta .ctaUI{ width: min(760px, 92vw); display:grid; row-gap:14px; }
#final-cta .ctaRow{ display:flex; align-items:center; gap:16px; }
#final-cta .ctaBox{ height:64px; border:2px solid #8c8c8c; background:transparent; border-radius:16px; }
#final-cta .ctaBox.small{ flex:0 0 clamp(110px,20vw,140px); }
#final-cta .ctaBox.big{   flex:1; }
#final-cta .ctaBox.hl{    border-color: var(--accent); }
#final-cta .ctaPrice{ font-family: var(--font-display); font-weight:800; font-size: clamp(22px,3vw,32px); color: var(--text); margin-right:6px; }

/* Screenshot-style HERO (stacked headline + title) */
.stackHead{ font-family:'Balgin', system-ui, -apple-system, Segoe UI, Roboto, sans-serif; font-weight:200; text-transform:uppercase; font-size:clamp(28px, 4.6vw, 72px); line-height:1.02; letter-spacing:.02em; margin: 0; }
.stackHead .line{ display:block; }
.stackHead .line + .line{ margin-top:.14em; }
.stackHead .accent{ color:var(--accent); }
.heroRightTitle{ font-family:'Balgin', system-ui, -apple-system, Segoe UI, Roboto, sans-serif; font-weight:300; font-size:clamp(24px, 2.6vw, 40px); line-height:1.1; letter-spacing:.01em; margin:0 0 10px; text-align:left; }
.iconCol{ display:grid; gap:18px; }
.bigBadge{ gap:18px; }
.bigBadge .label{ font-family:'Arsenal',system-ui,sans-serif; font-size:clamp(16px, 2vw, 22px); line-height:1; }/* Reduce section vertical padding */
.section {
  padding: 32px 0 !important; /* previously 72px */
}

/* Mantra block tighter spacing */
.mantra {
  row-gap: clamp(12px, 2vw, 24px) !important;
}

.mantraLine {
  line-height: 1.1 !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Bring CTA closer */
.mantraCta {
  margin-top: 6px !important;
}

`;

/* Load Arsenal from Google Fonts */
function useLoadFonts(){
  useEffect(()=>{
    const id = "gf-arsenal";
    if(!document.getElementById(id)){
      const l = document.createElement("link");
      l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Arsenal:wght@400;700&display=swap";
      document.head.appendChild(l);
    }
  },[]);
}

/* Inject the CSS once */
function useInjectCSS(){
  useEffect(()=>{
    const id = "ck-sections-css";
    if(!document.getElementById(id)){
      const s = document.createElement("style");
      s.id = id; s.textContent = CSS; document.head.appendChild(s);
    }
  },[]);
}

// === Divider component to place inside each .section ===
function Divider(){ return (<><div className="divider-top"/><div className="divider-bottom"/></>); }

/* Inline form used in hero + modal */
export function InlineInstantReportForm({ ctaLabel="Get Instant Report", onSubmit, initialIsd="+91", initialMobile="" }){
  const [isd, setIsd] = useState(initialIsd);
  const [mobile, setMobile] = useState(initialMobile);
  useEffect(()=>{ setIsd(initialIsd); },[initialIsd]);
  useEffect(()=>{ setMobile(initialMobile); },[initialMobile]);

  function handleSubmit(e){
    e.preventDefault();
    const full = `${isd}${mobile}`.replace(/\s+/g,"");
    if(!/^[+][0-9]{6,15}$/.test(full)){ alert("Please enter a valid mobile number"); return; }
    onSubmit ? onSubmit({isd, mobile, full}) : alert(`Generating instant report for ${full}`);
  }

  return (
    <form onSubmit={handleSubmit} className="formWrap" aria-label="Instant Report Form">
      <div className="formRow" style={{ display: "grid", gridTemplateColumns: "105px 1fr", gap: "12px" }}>
        <div style={{ position: "relative", width: "100%", height: "44px" }}>
          <select value={isd} onChange={e=>setIsd(e.target.value)} aria-label="Country code"
            style={{
              width: "100%", height: "100%", background: "transparent", border: "1.5px solid #666", borderRadius: "12px",
              padding: "0 12px", color: "transparent", appearance: "none", cursor: "pointer"
            }}
          >
            <option value="+91" style={{background: "#000", color: "#fff"}}>🇮🇳 +91</option>
            <option value="+1" style={{background: "#000", color: "#fff"}}>🇺🇸 +1</option>
            <option value="+44" style={{background: "#000", color: "#fff"}}>🇬🇧 +44</option>
            <option value="+61" style={{background: "#000", color: "#fff"}}>🇦🇺 +61</option>
            <option value="+971" style={{background: "#000", color: "#fff"}}>🇦🇪 +971</option>
          </select>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "#fff", fontSize: "0.95rem", gap: "5px" }}>
             <span>{isd}</span>
             <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
        </div>
        <input className="input" type="tel" inputMode="numeric" pattern="[0-9 ]*" placeholder="Enter your mobile number" value={mobile} onChange={e=>setMobile(e.target.value)} aria-label="Mobile number"
          style={{ width: "100%", height: "44px", background: "transparent", border: "1.5px solid #666", borderRadius: "12px", padding: "0.65rem 0.85rem", color: "#fff", fontSize: "0.95rem" }}
        />
      </div>
      <div className="actionsRow">
        <span className="priceTag">₹269</span>
        <button className="btn" type="submit">{ctaLabel}</button>
        <a className="pdfLink" href="/sample-report" aria-label="View Sample Report (PDF)">
          <svg className="pdfIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M8 13h8M8 17h8"/>
          </svg>
        </a>
      </div>
    </form>
  );
}

/* ---------- Bullet-by-bullet Typewriter (local, no external dep) ---------- */
function BulletTypewriter({ items, speed = 26, lineDelay = 650 }) {
  const [current, setCurrent] = useState(0);
  const [typed, setTyped] = useState(() => items.map(() => ""));
  useEffect(() => {
    let timer; const line = items[current]; if (!line) return;
    if (typed[current].length < line.length) {
      timer = setTimeout(() => { setTyped((prev) => { const next = [...prev]; next[current] = line.slice(0, prev[current].length + 1); return next; }); }, speed);
    } else if (current < items.length - 1) { timer = setTimeout(() => setCurrent((c) => c + 1), lineDelay); }
    return () => clearTimeout(timer);
  }, [current, items, typed, speed, lineDelay]);
  return (
    <ul className="tpList" aria-live="polite">
      {items.map((full, i) => { const isActive = i === current; const isDone = typed[i].length === full.length; return (
        <li className="tpItem" key={i}><span className="tpBullet" aria-hidden="true" /><span className="tpText">{typed[i]}{isActive && !isDone ? <span className="caret" /> : null}</span></li>
      );})}
    </ul>
  );
}

/* ===================== MAIN PAGE ===================== */
export default function ConsciousKarmaSections(){
  useLoadFonts();
  useInjectCSS();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [prefillIsd, setPrefillIsd] = useState("+91");
  const [prefillMobile, setPrefillMobile] = useState("");

  useEffect(()=>{
    const overlayOpen = showForm || menuOpen; if(!overlayOpen) return;
    const onKey = (e)=>{ if(e.key === 'Escape'){ setShowForm(false); setMenuOpen(false); } };
    const { body } = document; const prev = body.style.overflow; body.style.overflow = "hidden"; window.addEventListener('keydown', onKey);
    return ()=>{ window.removeEventListener('keydown', onKey); body.style.overflow = prev; };
  },[showForm, menuOpen]);

  function openPrefilledModal({isd, mobile}){ setPrefillIsd(isd); setPrefillMobile(mobile); setShowForm(true); }

  return (
    <div>
      {/* HERO */}
      <section className="section heroStage" id="hero">
        <div className="container">
          <div className="heroNav">
            <div className="brandRow">
              <div className="brandMark" aria-label="Conscious Karma">
                <span className="brandTop">conscious</span>
                <span className="brandBottom">KARMA</span>
              </div>
            </div>
            <button className={`hamburger ${menuOpen ? "is-open" : ""}`} aria-label="Open menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}>
              <span></span><span></span><span></span>
            </button>
          </div>

          <div className="heroGrid">
            {/* LEFT headline */}
            <div>
              <h1 className="stackHead" aria-label="Your mobile number is the key to achieving your dreams">
                <span className="line">YOUR MOBILE NUMBER</span>
                <span className="line">IS THE <span className="accent">KEY</span></span>
                <span className="line"><span className="accent">TO</span> ACHIEVING YOUR</span>
                <span className="line"><span className="accent">DREAMS.</span></span>
              </h1>
            </div>

            {/* RIGHT list + form */}
            <div className="heroRight">
              <h2 className="heroRightTitle">Mobile Number Influence</h2>
              <div className="iconCol">
                {[
                  [financeImg,"Finance & Work"],
                  [fortuneImg,"Fortune"],
                  [loveImg,"Charm & Love"],
                  [intuitionImg,"Sense"],
                  [intelligenceImg,"Intelligence"],
                ].map(([src,label],i)=> (
                  <div className="bigBadge" key={i}>
                    <img src={src} alt={label}/>
                    <div className="label">{label}</div>
                  </div>
                ))}
              </div>
              <InlineInstantReportForm ctaLabel="Get Instant Report" onSubmit={openPrefilledModal}/>
            </div>
          </div>
        </div>

        {/* Drawer */}
        {menuOpen && <div className="navBackdrop" onClick={()=>setMenuOpen(false)} />}
        <nav className={`navDrawer ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
          <div className="navTitle">Menu</div>
          <a className="navLink" href="/create-account" onClick={()=>setMenuOpen(false)}>Create Account <span className="navHint">/create-account</span></a>
          <a className="navLink" href="/get-report" onClick={()=>setMenuOpen(false)}>Personalised Report <span className="navHint">/get-report</span></a>
          <a className="navLink" href="/consult" onClick={()=>setMenuOpen(false)}>Consult <span className="navHint">/consult</span></a>
          <a className="navLink" href="#blogs" onClick={()=>setMenuOpen(false)}>Blog <span className="navHint">#blogs</span></a>
        </nav>
        <Divider/>
      </section>

      {/* WHAT IS THIS */}
      <section className="section" id="what-is-this">
        <div className="container center">
          <h2 className="h3">What is this</h2>
          <div className="grid3" style={{ marginTop: 24 }}>
            <div className="iconCard">
              <span className="iconCircle"><img src={earthGif} alt="Earth rotating" /></span>
              <p>The <b>UNIVERSE</b> is alive with <b>ENERGY</b>. These cosmic forces move through us, subtly shaping thoughts, guiding actions, and colouring experiences.</p>
            </div>
            <div className="iconCard">
              <span className="iconCircle --sketch"><img src={zeroPng} alt="Zero symbol" /></span>
              <p>Sages used numbers as symbols for celestial influence, capturing the essence of cosmic energies with simplicity and precision.</p>
            </div>
            <div className="iconCard">
              <span className="iconCircle --sketch"><img src={karmaTransparent} alt="Karma symbol" /></span>
              <p>Our choices and the energies we embrace shape destiny, creating the path we walk and the reality we manifest.</p>
            </div>
          </div>
        </div>
        <Divider />
      </section>

      {/* UNIQUE SEQUENCE — poster */}
      <section className="section" id="unique-sequence">
        <div className="container">
          <div className="poster">
            <p className="posterTitle">Every mobile number is a unique sequence,<br/>each carrying distinct energy</p>
            <img className="posterImg" src={mobileEnergyFlow} alt="Interlinked digit energy flow diagram" />
            <p className="posterCaption">The interaction and position of its digits form a pattern of vibrations, shaping actions, behaviour, and the flow of life</p>
          </div>
        </div>
        <Divider/>
      </section>

      {/* DISTINCTLY YOURS */}
      <section className="section" id="distinctly-yours">
        <div className="container">
          <div className="mantra">
            <p className="mantraLine">Your date of birth can be shared.</p>
            <p className="mantraLine">Your name can be repeated.</p>
            <p className="mantraLine">Your mobile number is,</p>
            <p className="mantraLine mantraEm">DISTINCTLY YOURS.</p>
            <p className="mantraCta"><a className="ctaLink" href="/get-report">Get personalised report  »»»</a></p>
          </div>
        </div>
        <Divider/>
      </section>

      {/* YANTRA */}
      <section className="section" id="yantra">
        <div className="container">
          <div className="yantra">
            <div className="yantraGroup">
              <p className="yantraLine">A mobile number is a <span className="yantraEm">digital Age Yantra</span></p>
              <p className="yantraLine">a tool threaded with different forms of energy.</p>
            </div>
            <div className="yantraGroup">
              <p className="yantraLine">Consciously crafted,</p>
              <p className="yantraLine">it holds the power to ease a journey,</p>
              <p className="yantraLine">shape a path, and</p>
              <p className="yantraLine">open new opportunities.</p>
            </div>
            <div className="yantraGroup">
              <p className="yantraLine">Your mobile number isn’t just for communication;</p>
              <p className="yantraLine">it is your greatest asset – the code of your journey.</p>
            </div>
            <p className="yantraCta"><a className="ctaLink" href="/consult">Invest in your greatest asset  »»»</a></p>
          </div>
        </div>
        <Divider/>
      </section>

      {/* WOVEN */}
      <section className="section" id="woven">
        <div className="container">
          <div className="wovenPoster">
            <img className="wovenGlobe" src={earthConnections} alt="Networked Earth connections" />
            <p className="wovenCopy">Just as numbers are woven into the fabric of the universe, your mobile number is intricately woven into your life. It guides your journey, <span className="accent">influencing your karma with every call, message, and interaction.</span></p>
          </div>
        </div>
        <Divider/>
      </section>

      {/* BLOGS */}
      <section className="section" id="blogs">
        <div className="container">
          <div className="centerBlock"><p className="h2">Blogs</p></div>
          <div className="blogGrid" style={{marginTop:24}}>
            {[{img:gradeImg,title:"Grades of Energy"},{img:blankStarImg,title:"Finding Your Lucky Pattern"},{img:blankStarImg,title:"Mobile Number Energy Flow"}].map((b,i)=> (
              <article className="blogCard" key={i}>
                <img src={b.img} alt={b.title}/>
                <h4>{b.title}</h4>
                <p>Short excerpt of your blog goes here. Replace with real content pulled from your CMS or Markdown files.</p>
                <a className="ctaLink" href={`/blog/sample-${i+1}`}>Read more »</a>
              </article>
            ))}
          </div>
        </div>
        <Divider/>
      </section>

      {/* FINAL CTA */}
      <section className="section" id="final-cta">
        <div className="container">
          <div className="ctaPoster">
            <p className="ctaTitle">Is Your Mobile Number Enhancing Your Journey or<br/>Holding You Back?</p>
            <div className="ctaIcons">{[financeImg, fortuneImg, loveImg, intuitionImg, intelligenceImg].map((src,i)=>(<img key={i} src={src} alt="" />))}</div>
            <InlineInstantReportForm ctaLabel="Purchase & Get Report" onSubmit={openPrefilledModal} />
          </div>
          <footer className="footerBar" style={{marginTop:32}}>
            <div className="container row">
              <div className="row"><a href="/termsandconditions">Terms & Conditions</a><a href="/privacy-policy">Privacy Policy</a></div>
              <div style={{color:'#1d1209',fontWeight:700}}>Contact Us – suma@consciouskarma.co</div>
            </div>
          </footer>
        </div>
        <Divider/>
      </section>
    </div>
  );
}

/* Optional one-time typewriters */
function TypeWriterOnce({ text, speed = 28 }) {
  const [out, setOut] = React.useState("");
  React.useEffect(() => { let i = 0, t; const step = () => { if (i <= text.length) { setOut(text.slice(0, i++)); t = setTimeout(step, speed); } }; step(); return () => clearTimeout(t); }, [text, speed]);
  return (<h2 className="weaveHeading">{out}{out.length < text.length ? <span className="weaveCaret" /> : null}</h2>);
}

function ParagraphTypewriter({ text, highlight = "", speed = 14, startDelay = 250 }) {
  const full = highlight ? `${text} ${highlight}` : text; const hiStart = highlight ? text.length + 1 : full.length; const [i, setI] = React.useState(0);
  React.useEffect(() => { let t, kick; const type = () => { setI(prev => { if (prev < full.length) { t = setTimeout(type, speed); return prev + 1; } return prev; }); }; kick = setTimeout(type, startDelay); return () => { clearTimeout(t); clearTimeout(kick); }; }, [full, speed, startDelay]);
  const normal = full.slice(0, Math.min(i, hiStart)); const hi = i > hiStart ? full.slice(hiStart, i) : "";
  return (<p className="lead weavePara" dir="ltr" style={{ textAlign: "left" }}>{normal}{highlight && <span className="wAccent">{hi}</span>}{i < full.length && <span className="weaveCaret" />}</p>);
}
