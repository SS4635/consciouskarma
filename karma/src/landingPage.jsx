import React, { useEffect, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";

import InstantReportForm from "./InstantReportForm.jsx";
import InlineInstantReportForm from "./components/InlineInstantReportForm.jsx";
import InlineInstantReportForm1 from "./components/InlineInstantReportForm1.jsx";
import CKNavbar from "./components/CKNavbar.jsx";
import SignupModal from "./SignupModal.jsx";
import LoginModal from "./LoginModal.jsx";

import loveImg from "./4.png";
import financeImg from "./2.png";
import fortuneImg from "./3.png";
import intelligenceImg from "./1.png";
import intuitionImg from "./5.png";
import earthGif from "./Earth Gif.gif";
import zeroPng from "./zero.png";
import karmaTransparent from "./ruondimgg.jpg";
import earthConnections from "./Earth connections.png";
import blog01 from "./Blog.1.jpg";
import blog02 from "./Blog.2.jpg";
import blog03 from "./Blog.3.jpg";
import mobileEnergyFlow from "./mobile number energy flow.png";

const commonTextStyle = {
  fontSize: "clamp(20px, 2.5vw, 20px)",
  lineHeight: "1.4",
  marginBottom: "0",
};

const parent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.28 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const heroIcons = [
  [financeImg, "Money & Work"],
  [fortuneImg, "Fortune"],
  [loveImg, "Charm & Love"],
  [intuitionImg, "Intuition"],
  [intelligenceImg, "Intelligence"],
];

const footerLinks = [
  { href: "/termsandconditions", id: "footer.termsConditions" },
  { href: "/privacy-policy", id: "footer.privacyPolicy" },
  { href: "/refund-policy", id: "footer.refundPolicy" },
  { href: "/shipping-policy", id: "footer.shippingDelivery" },
  { href: "/contact-us", id: "footer.contactUs" },
];

function SectionSpacer() {
  return <div style={{ height: "145px" }} />;
}

function SubsectionSpacer() {
  return <div className="h-[36px] md:h-[48px]" />;
}

function FooterDivider() {
  return (
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
  );
}

function BlogCard({ blog, index, expandedBlog, setExpandedBlog }) {
  const hrefMap = {
    0: "/blogs",
    1: "/blog/how-to-read-mobile-number",
    2: "/blog/how-to-choose-mobile-number",
  };

  const href = hrefMap[index];

  if (href) {
    return (
      <a
        href={href}
        className="w-full max-w-[380px] border-2 border-[#f59255] rounded-lg overflow-hidden bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] block"
        style={{ textDecoration: "none" }}
      >
        <div className="aspect-square bg-black flex items-center justify-center">
          {blog.img ? (
            <img
              src={blog.img}
              alt={blog.title}
              className="w-full h-400 object-cover"
            />
          ) : (
            <div className="text-5xl sm:text-6xl">✦</div>
          )}
        </div>

        <div className="p-4 sm:p-5 md:p-6 text-left">
          <h4 className="text-2xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white" style={{ fontSize: "clamp(22px, 2.5vw, 22px)" }}>
            {blog.title}
          </h4>
          <p className="text-gray-300 text-md md:text-md mb-3 sm:mb-4" style={{fontSize:"clamp(18px, 2.5vw, 16px)"}}>
            {blog.excerpt}
          </p>
          <div className="mt-2">
            <span className="text-[#f59255] font-semibold text-sd md:text-sm hover:text-orange-300">
              <FormattedMessage id="blogs.readMore" />
            </span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className="w-full max-w-[380px] border-2 border-[#f59255] rounded-lg overflow-hidden bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]">
      <div className="aspect-square bg-black flex items-center justify-center">
        {blog.img ? (
          <img
            src={blog.img}
            alt={blog.title}
            className="w-full h-400 object-cover"
          />
        ) : (
          <div className="text-5xl sm:text-6xl">✦</div>
        )}
      </div>

      <div className="p-4 sm:p-5 md:p-6 text-left">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">
          {blog.title}
        </h3>
        <p className="text-gray-300 text-sm mb-3 sm:mb-4">{blog.excerpt}</p>

        {expandedBlog === index ? (
          <div className="mt-2 text-sm text-gray-200">
            <p className="mb-3">{blog.content}</p>
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
              className="text-[#f59255] font-semibold text-sm hover:text-orange-300"
              onClick={() => setExpandedBlog(index)}
              aria-expanded={false}
            >
              <FormattedMessage id="blogs.readMore" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConsciousKarmaSections() {
  const intl = useIntl();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [prefillIsd, setPrefillIsd] = useState("+91");
  const [prefillMobile, setPrefillMobile] = useState("");
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const journeyLines = [
    intl.formatMessage({ id: "digitalYantra.journey1" }),
    intl.formatMessage({ id: "digitalYantra.journey2" }),
    intl.formatMessage({ id: "digitalYantra.journey3" }),
    intl.formatMessage({ id: "digitalYantra.journey4" }),
  ];

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

  const highlightValue = (id) => (
    <span className="text-[#f59255]">{intl.formatMessage({ id })}</span>
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showForm) setShowForm(false);
        if (showSignup) setShowSignup(false);
        if (showLogin) setShowLogin(false);
      }
    };

    if (showForm || showSignup || showLogin) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showForm, showSignup, showLogin]);

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

  function openPrefilledModal({ isd, mobile }) {
    setPrefillIsd(isd);
    setPrefillMobile(mobile);
    setShowForm(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-50 font-arsenal overflow-x-hidden">
      <style>{`
        .rotating-border-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;background:#000;color:#fff;border:2px solid #f59255;border-radius:10px;overflow:hidden}
        .rotating-border-btn::before{content:"";position:absolute;inset:-2px;padding:2px;border-radius:inherit;background:conic-gradient(from 0deg, rgba(255,145,77,0.95), rgba(255,145,77,0.2) 18%, transparent 30%, transparent 70%, rgba(255,145,77,0.2) 82%, rgba(255,145,77,0.95));-webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
        .rotating-border-btn:focus{outline:none;box-shadow:0 0 0 3px rgba(255,145,77,.25)}
        .text-fluid-16-20{font-size:clamp(16px,3.8vw,20px)}
        .text-fluid-18-24{font-size:clamp(18px,3.6vw,24px)}
        .text-fluid-18-30{font-size:clamp(18px,4vw,30px)}
        .text-fluid-24-30{font-size:clamp(24px,3.2vw,30px)}
      `}</style>

      <div className="absolute top-0 left-0 w-full z-50">
        <CKNavbar
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          setShowSignup={setShowSignup}
        />
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <section className="relative bg-black flex flex-col overflow-x-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent opacity-50" />

        {/* 64px gap from navbar (60px header + 64px spacer) */}
        <div style={{ height: "128px" }} />

        <div className="flex-1 flex flex-col justify-center items-center w-full relative">
          <div className="text-center w-full px-4">
            <h1
              className="font-balgin font-light uppercase leading-[1.1] md:leading-[1.1] tracking-wide text-white text-center"
              style={{ fontSize: "clamp(28px, 5vw, 54px)" }}
            >
              <span className="block">
                <FormattedMessage
                  id="hero.title.line1"
                  defaultMessage="YOUR MOBILE NUMBER"
                />
              </span>

              <span className="block md:inline">
                <span className="block md:inline">
                  <FormattedMessage
                    id="hero.title.line2"
                    defaultMessage="IS THE"
                  />
                  <span className="text-[#f59255] font-normal">
                    {" "}
                    <FormattedMessage
                      id="hero.title.key"
                      defaultMessage="KEY"
                    />{" "}
                  </span>
                </span>
                
                <span className="block md:inline">
                  <span className="text-[#f59255] md:text-[#fff] font-normal">
                  <FormattedMessage
                    id="hero.title.TO"
                    defaultMessage="TO "
                  />
                </span>

                  <FormattedMessage
                    id="hero.title.toAchieving"
                    defaultMessage="ACHIEVING"
                  />
                  <span className="md:hidden">
                    {" "}
                    <FormattedMessage
                      id="hero.tittle.line3"
                      defaultMessage="YOUR"
                    />
                  </span>
                </span>
              </span>

              <span className="block">
                <span className="hidden md:inline">
                  <FormattedMessage
                    id="hero.tittle.line3"
                    defaultMessage="YOUR "
                  />
                </span>
                <span className="text-[#f59255] font-normal">
                  <FormattedMessage
                    id="hero.title.dreams"
                    defaultMessage="DREAMS"
                  />
                </span>
              </span>
            </h1>

            {/* <SubsectionSpacer /> */}
            <div className="h-[24px]" />
            <div className="space-y-0 text-gray-200 font-thin tracking-wide">
              <p className="text-[20px] md:text-[25px] !m-0">
                Every number carries a pattern
              </p>
              {/* <SubsectionSpacer /> */}
              <div className="h-[24px]" />
              <p style={{ fontSize: "20px" }}>
                Discover How a Mobile Number <br className="block sm:hidden" />
                Shapes Life’s Key Areas
              </p>
            </div>
          </div>

          <div style={{ height: "24px" }} />

          <div className="w-full flex justify-center">
            <div className="grid grid-cols-[60px_1fr] gap-y-3 gap-x-4 items-center w-fit md:flex md:flex-row md:gap-12 lg:gap-20 md:w-auto !py-0">
              {heroIcons.map(([src, label], i) => (
                <React.Fragment key={i}>
                  <div className="contents md:flex md:flex-col md:items-center md:gap-2">
                    <div className="flex items-center justify-center">
                      <img
                        src={src}
                        alt={label}
                        className="w-14 h-14 md:w-20 md:h-20 object-contain"
                      />
                    </div>

                    <span
                      className="text-white font-light text-left md:text-center whitespace-nowrap md:whitespace-normal md:max-w-[120px] leading-tight"
                      style={{ fontSize: "clamp(20px, 2.5vw, 20px)" }}
                    >
                      {label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div style={{ height: "24px" }} />
          {/* <SubsectionSpacer /> */}

          <div className="w-full max-w-[340px] md:max-w-[420px] px-4 sm:py-0 lg:py-2">
            <div className="md:h-[48px]" />
            {/* <SubsectionSpacer /> */}
            <InlineInstantReportForm
              ctaLabel={intl.formatMessage({ id: "form.ctaInstantReport" })}
              onSubmit={openPrefilledModal}
            />
          </div>
        </div>

        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <CKNavbar
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          setShowSignup={setShowSignup}
        />

        <SectionSpacer />
      </section>

      <section className="relative bg-black flex items-center justify-center px-4 sm:px-6">
        <div className="container mx-auto max-w-full text-center flex flex-col justify-center">
          <p
            className="font-balgin leading-[1.05] tracking-[0.02em] text-white !m-0"
            style={{ fontSize: "25px" }}
          >
            <FormattedMessage id="whatIsThis.title" />
          </p>

          <SubsectionSpacer />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-[64px] items-center justify-items-center">
            <div className="flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6 lg:gap-[64px] w-full max-w-[320px]">
              <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] rounded-full grid place-items-center bg-[#0b0b0b] overflow-hidden">
                <img
                  src={earthGif}
                  alt={intl.formatMessage({ id: "alt.earthRotating" })}
                  className="w-full h-full object-cover bg-[#0b0b0b]"
                />
              </div>

              <p
                className="text-gray-200 font-thin w-full px-2 sm:px-0 whitespace-pre-line inline-block max-w-[380px] sm:max-w-none"
                style={commonTextStyle}
              >
                <FormattedMessage
                  id="whatIsThis.universe.line1"
                  values={{
                    patterns: (
                      <span className="text-[#f59255] font-normal">
                        patterns
                      </span>
                    ),
                  }}
                />
                <FormattedMessage id="whatIsThis.universe.line2" />
                <FormattedMessage id="whatIsThis.universe.line3" />
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6 lg:gap-[64px] w-full max-w-[320px]">
              <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] rounded-full grid place-items-center bg-transparent pt-1 mr-7">
                <img
                  src={zeroPng}
                  alt={intl.formatMessage({ id: "alt.zeroSymbol" })}
                  className="w-full h-full object-cover scale-[1.02]"
                />
              </div>

              <p
                className="text-gray-200 font-thin w-full px-2 sm:px-0 whitespace-pre-line inline-block"
                style={commonTextStyle}
              >
                <FormattedMessage
                  id="whatIsThis.numbers.line1"
                  values={{
                    numbers: (
                      <span style={{ color: "#f59255" }}>
                        {intl.formatMessage({ id: "whatIsThis.numbers" })}
                      </span>
                    ),
                    symbols: (
                      <span style={{ color: "#f59255" }}>
                        {intl.formatMessage({ id: "whatIsThis.symbols" })}
                      </span>
                    ),
                  }}
                /><FormattedMessage
                  id="whatIsThis.numbers.line2"
                  values={{
                    numericalSystems: (
                      <span className="text-[#f59255] font-normal">
                        numerical systems
                      </span>
                    ),
                  }}
                /><FormattedMessage id="whatIsThis.numbers.line3" />
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6 lg:gap-[64px] w-full max-w-[320px] md:col-span-2 lg:col-span-1">
              <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] rounded-full grid place-items-center bg-transparent overflow-hidden">
                <img
                  src={karmaTransparent}
                  alt={intl.formatMessage({ id: "alt.karmaSymbol" })}
                  className="w-full h-full object-contain scale-[1.5]"
                />
              </div>

              <p
                className="text-gray-200 font-thin w-full px-2 sm:px-0 whitespace-pre-line inline-block"
                style={commonTextStyle}
              >
                <FormattedMessage
                  id="whatIsThis.karma.line1"
                  values={{
                    patternsAligned: (
                      <span className="text-[#f59255] font-normal">
                        patterns we align with{" "}
                      </span>
                    ),
                  }}
                />
                <FormattedMessage
                  id="whatIsThis.karma.line2"
                  values={{
                    destiny: (
                      <span style={{ color: "#f59255" }}>
                        {intl.formatMessage({
                          id: "whatIsThis.karma.destiny",
                        })}
                      </span>
                    ),
                  }}
                />
                <br />
                <FormattedMessage id="whatIsThis.karma.line3" />
                <br />
                <FormattedMessage
                  id="whatIsThis.karma.line4"
                  style="color: black"
                />
              </p>
            </div>
          </div>
        </div>

        <SectionSpacer />
      </section>

      <section
        className="relative bg-black flex flex-col items-center justify-center px-2 sm:px-6"
      >
        <div className="container mx-auto text-center max-w-5xl">
          <div>
            <SectionSpacer />
            {/* <SubsectionSpacer /> */}
          </div>

          <div>
            {/* <SubsectionSpacer /> */}
            <div className="w-full flex justify-center px-1 sm:px-0">
              <img
                src={mobileEnergyFlow}
                alt={intl.formatMessage({ id: "mobileEnergy.altImage" })}
                className="lg:w-[560px] md:w-[650px] sm:w-[450px] h-auto"
              />
            </div>
          </div>

          <SubsectionSpacer />

<p
  className="m-0 text-gray-200 font-thin w-full px-2 sm:px-0 max-w-full sm:max-w-[300px] md:max-w-none mx-auto"
  style={commonTextStyle}
>
  <span className="text-white inline md:block">
    <FormattedMessage id="mobileEnergy.line1" />
  </span>{" "}
  <span className="text-white inline md:block">
    <FormattedMessage id="mobileEnergy.line2" />
  </span>{" "}
  <span className="inline md:block">
    <FormattedMessage
      id="mobileEnergy.line3"
      values={{
        distinctPattern: (
          <span className="text-[#f59255] font-normal">
            distinct pattern
          </span>
        ),
      }}
    />
  </span>{" "}
  <span className="inline md:block">
    <FormattedMessage id="mobileEnergy.line4" />
  </span>
</p>
        </div>

        <SubsectionSpacer />
      </section>

      <section className="relative bg-black flex flex-col items-center justify-center text-center px-2 sm:px-6">
        <div className="container">
          <p className="text-gray-200 font-thin text-[20px] md:text-[20px] !py-0 !m-0">
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
                distinctlyYours: (
                  <span className="text-[#f59255] font-normal">
                    DISTINCTLY YOURS
                  </span>
                ),
              }}
            />
          </p>

          <SubsectionSpacer />

          <p className="!m-0 !text-[25px]">
            <a
              href="/personalized-report"
              className="inline-block font-light no-underline"
              style={{ color: "white", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.target.style.color = "#f59255")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              <FormattedMessage id="distinctly.line5" />
            </a>
          </p>
        </div>

        <SectionSpacer />
      </section>

      <section
        className="relative bg-black flex flex-col items-center justify-center px-4 sm:px-6 text-center"
      >
        <div>
          <img
            src={earthConnections}
            alt={intl.formatMessage({ id: "woven.altImage" })}
            className="w-[260px] sm:w-[320px] md:w-[380px] lg:w-[450px] mx-auto"
          />
        </div>

        <div className="max-w-3xl mx-auto relative">
  <SubsectionSpacer />
  <p
    className="mb-1 text-gray-200 font-thin w-full px-1 sm:px-0 max-w-full sm:max-w-[350px] md:max-w-none mx-auto"
    style={commonTextStyle}
  >
    <span className="inline md:block">
      <FormattedMessage id="woven.line1" />
    </span>{" "}
    <span className="inline md:block">
      <FormattedMessage id="woven.line2" />
    </span>{" "}
    <span className="inline md:block">
      <FormattedMessage id="woven.line3" />
    </span>{" "}
    <span className="inline md:block">
      <FormattedMessage
        id="woven.line4"
        values={{
          shapesYourKarma: (
            <span className="text-[#f59255] font-normal">
              shapes your karma
            </span>
          ),
        }}
      />
    </span>
  </p>
</div>


        <SubsectionSpacer />
      </section>

      <section className="relative bg-black flex flex-col items-center justify-center text-center px-2">
        <div className="container mx-auto max-w-[760px] text-center">
          <p className="text-gray-200 font-thin" style={commonTextStyle}>
            <span className="inline md:block">
              <FormattedMessage id="digitalYantra.line1" />
            </span>{" "}
            <span className="inline md:block">
              <FormattedMessage id="digitalYantra.line2" />
            </span>
          </p>

          <SubsectionSpacer />

          <div>
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

            <SubsectionSpacer />

            <p className="text-gray-200 font-thin" style={commonTextStyle}>
              <FormattedMessage id="digitalYantra.line3" />
              <br />
              <FormattedMessage
                id="digitalYantra.line4"
                values={{
                  greatestAsset: (
                    <span className="text-[#f59255] font-normal">
                      It is your greatest asset — the code of your journey
                    </span>
                  ),
                }}
              />
            </p>

            <SubsectionSpacer />

            <a
              href="/consult"
              className="font-thin no-underline mb-0"
              style={{ fontSize: "25px", color: "white", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.target.style.color = "#f59255")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              <FormattedMessage id="digitalYantra.cta" />
            </a>
          </div>
        </div>

        <SectionSpacer />
      </section>

      <section
        id="blogs"
        className="relative bg-black flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="container mx-auto text-center w-full">
          <h2
            className="font-balgin text-white !m-0"
            style={{ fontSize: "clamp(25px, 3vw, 28px)" }}
          >
            <FormattedMessage id="blogs.title" />
          </h2>

          <SubsectionSpacer />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-[24px] justify-items-center max-w-[1200px] mx-auto">
            {blogItems.map((blog, i) => (
              <BlogCard
                key={i}
                blog={blog}
                index={i}
                expandedBlog={expandedBlog}
                setExpandedBlog={setExpandedBlog}
              />
            ))}
          </div>

          <div className="mt-[20px] text-right w-full max-w-[960px] mx-72" />
        </div>

        <SectionSpacer />
      </section>

      <section className="relative bg-black flex flex-col items-center !m-0">
        <div className="container mx-auto flex flex-col items-center text-center !m-0">
          <p
            className="font-thin text-white max-w-full sm:max-w-[620px] mx-auto !m-0"
            style={{ fontSize: "clamp(22px, 2.5vw, 30px)", lineHeight: "1" }}
          >
            <span
              className="block whitespace-nowrap sm:whitespace-normal !m-0"
              style={{ marginBottom: "clamp(4px, 0.5vw, 8px)" }}
            >
              <FormattedMessage id="finalCta.line1" />
            </span>
            <span className="block !m-0">
              <FormattedMessage id="finalCta.line2" />
            </span>
          </p>

          <SubsectionSpacer />
          {/* <div style={{ height: "24px" }} /> */}

          <div
            className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full overflow-x-auto px-4 scrollbar-hide"
            style={{ marginTop: "0rem !important", marginBottom: "0rem !important" }}
          >
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

          {/* <div style={{ height: "24px" }} /> */}
          <SubsectionSpacer />

          <div className="w-[300px] sm:w-[300px] md:w-[340px] flex flex-col items-center justify-center">
            {/* <SubsectionSpacer /> */}
            <InlineInstantReportForm1
              ctaLabel={intl.formatMessage({ id: "form.ctaInstantReport" })}
              onSubmit={openPrefilledModal}
            />
          </div>
          <SectionSpacer />
        </div>
      </section>

      <footer className="mt-auto w-screen relative left-1/2 -translate-x-1/2 bg-black text-white border-t-2 border-[#f59255] py-3 sm:py-2 md:py-3">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
            {footerLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <a
                  href={link.href}
                  className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 no-underline hover:no-underline focus:no-underline"
                >
                  <FormattedMessage id={link.id} />
                </a>
                {index !== footerLinks.length - 1 && <FooterDivider />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </footer>

      {showForm && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-black border-2 border-[#f59255] rounded-[16px] p-0 max-w-[400px] w-full max-h-[70vh] relative flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "16px",
                marginLeft: "16px",
                marginRight: "16px",
                fontSize: "20px",
                fontWeight: "700",
                paddingTop: "5px",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "300",
                  marginBottom: "2rem",
                }}
              >
                Instant Report
              </p>
            </div>

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