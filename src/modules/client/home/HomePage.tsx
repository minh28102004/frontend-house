"use client";

import React from "react";
import { Hero, BannerHome, Intro, Rooms, Concepts, Reviews, Cta } from "./components";

const HomePage = () => {
  return (
    <div className="w-full ">
      <Hero />
      {/* <Marquee /> */}
      <BannerHome />
      <Intro />
      <Rooms />
      <Concepts />
      <Reviews />
      <Cta />
    </div>
  );
};

export default HomePage;