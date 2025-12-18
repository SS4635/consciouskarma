import { useEffect } from "react";
import InstantReportForm from "./InstantReportForm.jsx";
// Conscious Karma – Black Theme with HERO (pixel‑matched)
// Pure React + Custom CSS. Place assets under /public/ck/* as before.

const CSS = `
:root{
  --bg:#0b0b0b; --text:#f2f2f2; --muted:#e6e6e6; --soft:#cfcfcf;
  --line:#3a3a3a; --accent:#ff8a3d; --accent-700:#f07a2e;
  --box:#111111; --shadow:0 10px 30px rgba(0,0,0,.35);
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;background:var(--bg);color:var(--text);font:18px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica,Arial}
a{color:var(--accent)}
img{max-width:100%;height:auto;display:block}
.container{max-width:1280px;margin:0 auto;padding:0 24px}
.section{padding:64px 0;position:relative}
.section .divider-top,.section .divider-bottom{position:absolute;left:0;right:0;height:4px;background:linear-gradient(90deg,#bbb,#444,#222);opacity:.5}
.section .divider-top{top:0}
.section .divider-bottom{bottom:0}
.h1{font-size:clamp(34px,4.5vw,56px);line-height:1.1;font-weight:800;margin:0 0 14px}
.h2{font-size:clamp(30px,4vw,52px);line-height:1.1;font-weight:800;margin:0 0 10px}
.h3{font-size:clamp(26px,3.2vw,44px);line-height:1.15;font-weight:800;margin:0 0 10px}
.lead{color:#dcdcdc;max-width:72ch}
.center{text-align:center}

/* === HERO === */
.heroStage{min-height:84vh;display:grid;grid-template-rows:auto 1fr;position:relative}
.heroNav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
.brandStack{line-height:1}
.brandTop{font-size:28px;font-weight:500;letter-spacing:.2px;color:#f2f2f2}
.brandBottom{font-size:28px;font-weight:800;color:var(--accent);letter-spacing:2px;margin-top:2px}
.pillBtn{display:inline-flex;align-items:center;justify-content:center;border:3px solid var(--accent);border-radius:14px;padding:10px 18px;color:#f2f2f2;font-weight:700;background:transparent}
.pillBtn:hover{background:rgba(255,138,61,.1)}
.heroContent{align-self:center}
.headline{font-size:clamp(36px,6vw,84px);line-height:1.1;font-weight:600;letter-spacing:.02em;max-width:18ch;text-transform:uppercase}
.headline .accent{color:var(--accent);font-weight:700}

/* === Section: What is this (3 columns) === */
.grid3{display:grid;grid-template-columns:1fr;gap:32px;align-items:center;justify-items:center}
.grid3 p{max-width:48ch;text-align:center}
@media (min-width:960px){.grid3{grid-template-columns:repeat(3,1fr)}}
.iconCard{display:grid;justify-items:center;gap:16px}
.iconCircle{width:min(280px,70%);aspect-ratio:1/1;border-radius:999px;display:grid;place-items:center}
.zeroSketch{width:min(280px,60%)}

/* === Section: Flows of Connection === */
.split{display:grid;grid-template-columns:1fr;gap:32px}
@media (min-width:1020px){.split{grid-template-columns:1.3fr .9fr;gap:40px}}
.highlight span{color:var(--accent);font-weight:600}
.arcWrap{margin-top:28px;position:relative}
.xRow{display:flex;gap:12px;justify-content:center}
.xBox{width:46px;height:46px;border:2px solid var(--accent);border-radius:10px;display:grid;place-items:center;font-weight:700}
svg.arcs{position:absolute;inset:0;pointer-events:none}
svg.arcs path{stroke:#ddd;stroke-width:2;fill:none;opacity:.95}
.listCard{position:relative;border:1px solid #6b6b6b;border-radius:6px;overflow:hidden;background:rgba(255,255,255,.02)}
.listCard ul{list-style:none;margin:0;padding:0}
.listCard li{display:flex;align-items:center;gap:12px;padding:18px 20px;border-top:1px solid #555}
.listCard li:first-child{border-top:none}
.num{display:inline-grid;place-items:center;font-weight:800;background:#1a1a1a;border:1px solid #666;width:30px;height:30px;border-radius:6px}
.ribbon{position:absolute;top:10px;right:-54px;transform:rotate(34deg);background:var(--accent);color:#201a14;padding:8px 70px;font-weight:700;box-shadow:var(--shadow)}

/* === Section: Everything is Energy (left text, right icons) === */
.gridIcons{display:grid;grid-template-columns:1fr;gap:40px}
@media (min-width:1100px){.gridIcons{grid-template-columns:1.2fr .8fr}}
.iconList{display:grid;gap:26px}
.iconItem{display:grid;grid-template-columns:52px 1fr;align-items:center;gap:16px}
.iconGlyph{width:52px;height:52px;border:2px solid #eaeaea;border-radius:12px;display:grid;place-items:center}
.ctaLink{display:inline-block;margin-top:18px;color:var(--accent);font-weight:700;text-decoration:underline;}

/* === Section: Code of Your Journey (image left, text right) === */
.splitBig{display:grid;grid-template-columns:1fr;gap:40px;align-items:center}
@media (min-width:1100px){.splitBig{grid-template-columns:1.1fr 1fr}}
.globe{border-radius:18px;overflow:hidden;box-shadow:var(--shadow)}

/* === Section: Big Question === */
.question{padding:120px 0;text-align:center}
.question .text{font-size:clamp(28px,3.4vw,44px);font-weight:700}

/* === Footer bar === */
.footerBar{position:relative;background:linear-gradient(180deg,var(--accent),var(--accent-700));padding:18px 0;margin-top:0}
.footerBar .row{display:flex;flex-direction:column;gap:14px;align-items:center;justify-content:space-between}
.footerBar a{color:#1d1209;text-decoration:underline;font-weight:700}
@media (min-width:900px){.footerBar .row{flex-direction:row}}
`;

function useInjectCSS(){
  useEffect(()=>{
    const id = "ck-css-v3";
    if(!document.getElementById(id)){
      const s = document.createElement("style");
      s.id = id; s.textContent = CSS; document.head.appendChild(s);
    }
  },[]);
}

function Divider(){
  return (<>
    <div className="divider-top"/>
    <div className="divider-bottom"/>
  </>);
}



export default function ConsciousKarmaBlack(){
  useInjectCSS();
  return (
    <div>
<InstantReportForm />
      {/* WHAT IS THIS */}
   

      {/* FLOWS OF CONNECTION */}
      <section className="section">
        <div className="container">
          <div className="split">
            {/* Left text + arcs */}
            <div>
              <h2 className="h2">Flows of Connection.</h2>
              <p className="lead highlight">Every mobile number is a <span>unique sequence</span> of digits, each carrying distinct energy. The interaction and position of each digit create a pattern of vibrations, shaping the user’s actions, behavior, and life flow.</p>
              <div className="arcWrap">
                <div className="xRow">
                  {Array.from({length:10}).map((_,i)=> <div className="xBox" key={i}>X</div>)}
                </div>
                <svg className="arcs" viewBox="0 0 1000 220" preserveAspectRatio="none">
                  {Array.from({length:9}).map((_,i)=>{
                    const x1 = 60 + i*94; const x2 = 60 + (i+1)*94;
                    const mid = (x1+x2)/2; const y1 = 160; const y2 = 160; const c = 30 + (i%5)*14;
                    return <path key={i} d={`M${x1},${y1} C ${mid},${160-c} ${mid},${160-c} ${x2},${y2}`}/>;
                  })}
                  {Array.from({length:8}).map((_,i)=>{
                    const x1 = 60 + i*94; const x2 = 60 + (i+2)*94; const mid=(x1+x2)/2; const c=60 + (i%4)*12;
                    return <path key={`b${i}`} d={`M${x1},160 C ${mid},${160-c} ${mid},${160-c} ${x2},160`}/>;
                  })}
                </svg>
              </div>
            </div>
            {/* Right list + ribbon */}
            <div className="listCard">
              <div className="ribbon">Symbols</div>
              <ul>
                {[[1,'Ambitious','Arrogant'],[2,'Sweet','Gentle'],[3,'Energetic','Impulsive'],[4,'Compatible','Impressionable'],[5,'Organized','Conservative'],[6,'Eloquent','Spend thrift'],[7,'Diligent','Stressed'],[8,'Powerful','Mysterious'],[9,'Intuition','Delusion'],[0,'Unknown','Wanderer']].map(([n,a,b])=> (
                  <li key={String(n)}><span className="num">{n}</span> <span>{a}, {b}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Divider/>
      </section>

      {/* EVERYTHING IS ENERGY */}
      <section className="section">
        <div className="container">
          <div className="gridIcons">
            <div>
              <h2 className="h2">Everything is Energy.</h2>
              <p className="lead">A mobile number is a <a href="#">digital age yantra</a>—a tool threaded with different forms of energy. Consciously crafted, it has the power to ease your journey, shape your path, and attract new opportunities.</p>
              <a className="ctaLink" href="#consult">Invest in your greatest asset  &raquo;&raquo;&raquo;</a>
            </div>
            <div className="iconList">
              {[
                ['money','Money and Work'],
                ['hearts','Charm & Love'],
                ['dice','Luck & Fortune'],
                ['head','Wit & Intellect'],
                ['eye','Sense & Intuition'],
                ['heart','Health & Prosperity'],
              ].map(([k,label])=> (
                <div className="iconItem" key={String(k)}>
                  <div className="iconGlyph"><img src={`/ck/icons/${k}.svg`} alt=""/></div>
                  <div>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Divider/>
      </section>

      {/* CODE OF YOUR JOURNEY */}
      <section className="section">
        <div className="container">
          <div className="splitBig">
            <div className="globe"><img src="/ck/globe-network.jpg" alt="Network globe"/></div>
            <div>
              <h2 className="h2">The Code of Your Journey.</h2>
              <p className="lead">Just as numbers are woven into the fabric of the universe, your mobile number is intricately woven into your life. Its energy does more than connect you to others; it guides your journey, <span style={{color:'var(--accent)',fontWeight:700}}>influencing your karma with every call, message, and interaction.</span></p>
            </div>
          </div>
        </div>
        <Divider/>
      </section>

     
    </div>
  );
}
