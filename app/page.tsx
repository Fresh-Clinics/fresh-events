"use client";

import React from "react";

const Page: React.FC = () => {
  return (
    <div style={{ display: "flex", justifyContent: "left", alignItems: "left", height: "100vh", padding:"50px" }}>
      <iframe
        src="https://lu.ma/embed/calendar/cal-PfKCHyYHQHvdr87/events"
        width="1000"
        height="1000"
        frameBorder="0"

        style={{ border: "none", borderRadius: "0px", background:"#f4f5f6!important" }}
        allowFullScreen="true"
        aria-hidden="false"
        tabIndex={0}
      />
    </div>
  );
};

export default Page;
