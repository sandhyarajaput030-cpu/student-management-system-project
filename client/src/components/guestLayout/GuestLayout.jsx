import React from "react";

import GuestHeader from "./GuestHeader";
import GuestNavbar from "./GuestNavbar";
import GuestFooter from "./GuestFooter";

import { Outlet } from "react-router-dom";

function GuestLayout() {
  return (
    <div>

      <GuestHeader />

      <GuestNavbar />

      <main style={{ padding: "20px", marginBottom: "60px" }}>
        <Outlet />
      </main>

      <GuestFooter />

    </div>
  );
}

export default GuestLayout;