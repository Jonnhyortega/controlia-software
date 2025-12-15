"use client";

import Hero from "./components/hero";
import Pricing from "./components/pricing"
import CallToAction from "./components/callToAction"
import CTA from "./components/cta"
import Features from "./components/features"
import MarketingLayout from "./components/MarketingLayout";

export default function LandingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <div id="features">
        <Features />
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
