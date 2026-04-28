"use client";

import HomePage from "@/modules/client/home/HomePage";
import React from "react";

export default function Page() {
  return (
    <div style={{ paddingTop: 'var(--site-header-height)' }}>
      <HomePage />
    </div>
  );
}