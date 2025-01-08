"use client";

import React from "react";

const Page: React.FC = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <iframe
        src="https://lu.ma/embed/calendar/cal-PfKCHyYHQHvdr87/events"
        width="1000"
        height="1000"
        frameBorder="0"
        style={{ border: "none", borderRadius: "0px" }}
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
      />
    </div>
  );
};

export default Page;
