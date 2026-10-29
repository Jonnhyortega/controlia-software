"use client";

import Hero from "./components/hero";
import Pricing from "./components/pricing"
import CTA from "./components/cta"
import Features from "./components/features"
import Scanner from "./components/scanner"
import MarketingLayout from "./components/MarketingLayout";

export default function LandingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="scanner">
        <Scanner />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="contact">
        <CTA />
      </div>
    </MarketingLayout>
  );
}
