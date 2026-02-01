// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Landing from './landingPage.jsx';
import PersonalisedReport from './PersonalisedReport.jsx';
import Plans from './plans.jsx';
import Consult from './Consult.jsx';
import TermsAndConditions from './TermsAndConditions.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import RefundPolicy from './RefundPolicy.jsx';
import ShippingPolicy from './ShippingPolicy.jsx';
import ContactUs from './ContactUs.jsx';
import Blog from './Blog.jsx';
import HowToReadMobileNumberBlog from './HowToReadMobileNumberBlog.jsx';
import HowToChooseMobileNumberBlog from './HowToChooseMobileNumberBlog.jsx';
import LinkGuard from "./LinkGuard";
import LinkPage from "./LinkPage";
import NotFound from "./NotFound";

// ✅ Import your translations
import {IntlProvider} from "./i18n/IntlProvider.jsx";  // 👈 yahan se saari text aayegi
import DashboardLayout from './DashboardLayout.jsx';
import SignupModal from './SignupModal.jsx';
import LoginModal from './LoginModal.jsx';
export default function App() {

  return (
    <IntlProvider>  
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignupModal />} />
          <Route
  path="/link"
  element={
    <LinkGuard>
      <LinkPage />
    </LinkGuard>
  }
/>
          <Route path="/404" element={<NotFound />} />
<Route path="*" element={<NotFound />} />


          <Route path="/login" element={<LoginModal />} />
          
          <Route path="/personalised-report" element={<PersonalisedReport />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/consult" element={<Consult />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blog/how-to-read-mobile-number" element={<HowToReadMobileNumberBlog />} />
          <Route path="/blog/how-to-choose-mobile-number" element={<HowToChooseMobileNumberBlog />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Routes>
      </BrowserRouter>
    </IntlProvider>
  );
}
