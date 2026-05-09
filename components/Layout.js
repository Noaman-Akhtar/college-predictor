import React from "react";
import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Navbar item1="College Predictor" item2="Scholarships" />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="border-t border-[#eaded8] bg-white px-4 py-4 text-center text-xs leading-5 text-[#6d5550]">
        Predictions are based on available historical counselling data and are
        for guidance only. Students should verify official counselling rules,
        eligibility, deadlines, and seat allotment updates before applying.
      </footer>
    </>
  );
};

export default Layout;
