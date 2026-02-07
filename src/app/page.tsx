import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NotifyForm from "@/components/NotifyForm";

export const metadata: Metadata = {
  title: "DevGathering — Where Developers Connect",
  description: "In-person developer events. Tech talks, workshops, genuine connections.",
};

const features = [
  {
    num: "01",
    title: "Tech Talks",
    desc: "Real engineers sharing real stories from production. No marketing fluff, just hard-won lessons and practical takeaways you can use tomorrow.",
  },
  {
    num: "02",
    title: "Networking",
    desc: "Connect with developers who speak your language. No recruiters, no sales pitches—just genuine conversations about code, architecture, and craft.",
  },
  {
    num: "03",
    title: "Community",
    desc: "Find your local tribe of builders. Whether you're a junior dev or a principal engineer, there's a place for you at DevGathering.",
  },
];

const values = [
  {
    title: "Quality over quantity",
    desc: "Small, focused events where everyone can participate. No 500-person conferences where you get lost in the crowd.",
  },
  {
    title: "Developers first",
    desc: "Every decision we make puts developers first. No sponsors pushing products. No vendor booths. Just knowledge sharing.",
  },
  {
    title: "Local connection",
    desc: "Building communities city by city. Face-to-face connections that last beyond a single event.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navigation />

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p className="text-xs text-accent mb-4">Launching Soon</p>

            <div className="hero-title-wrapper">
              <span className="hero-title-main">Connect</span>
              <span className="hero-title-accent">& Build</span>
            </div>

            <p className="hero-subtitle" style={{ textAlign: "center" }}>
              The new standard for developer gatherings.
              No sales pitches. No fluff. Just engineering.
            </p>

            <NotifyForm />

            <Link href="/request" className="btn btn-outline mt-6">
              Bring to your city
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="section">
          <div className="container text-center">
            <p className="text-xs text-accent mb-3">What to expect</p>
            <h2 className="mb-4">
              By devs, <span className="text-accent">for devs</span>
            </h2>
            <p className="text-muted mb-7" style={{ maxWidth: 600, margin: "0 auto 48px" }}>
              We&apos;re building the kind of events we always wanted to attend.
              Technical, genuine, and focused on what matters most—great engineering.
            </p>

            <div className="features">
              {features.map((f) => (
                <div key={f.num} className="card" style={{ textAlign: "left" }}>
                  <div className="feature-num">{f.num}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section" style={{ background: "var(--bg-card)" }}>
          <div className="container text-center">
            <p className="text-xs text-accent mb-3">Our Philosophy</p>
            <h2 className="mb-4">What we believe in</h2>
            <p className="text-muted mb-7" style={{ maxWidth: 600, margin: "0 auto 48px" }}>
              Every DevGathering event is built on these core principles.
            </p>

            <div className="features">
              {values.map((v, i) => (
                <div key={i} className="card" style={{ textAlign: "left", background: "var(--bg)" }}>
                  <h3 className="feature-title">{v.title}</h3>
                  <p className="feature-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section">
          <div className="container text-center">
            <p className="text-xs text-accent mb-3">How it works</p>
            <h2 className="mb-4">Simple and focused</h2>
            <p className="text-muted mb-7" style={{ maxWidth: 600, margin: "0 auto 48px" }}>
              We keep things simple so you can focus on what matters.
            </p>

            <div className="features" style={{ textAlign: "left" }}>
              <div className="card">
                <div className="feature-num">Step 1</div>
                <h3 className="feature-title">Join the waitlist</h3>
                <p className="feature-desc">Sign up with your email to be notified when we launch events in your area. No spam, just updates.</p>
              </div>
              <div className="card">
                <div className="feature-num">Step 2</div>
                <h3 className="feature-title">Get invited</h3>
                <p className="feature-desc">When we launch in your city, you&apos;ll be the first to know. Early members get priority access to events.</p>
              </div>
              <div className="card">
                <div className="feature-num">Step 3</div>
                <h3 className="feature-title">Show up & connect</h3>
                <p className="feature-desc">Come to events, meet other developers, learn something new, and maybe even share your own story.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="container">
            <div className="card text-center" style={{ padding: "80px 32px" }}>
              <h2 className="mb-4">We&apos;re just getting started</h2>
              <p className="text-muted" style={{ maxWidth: 480, margin: "0 auto 32px" }}>
                Be the first to know when we launch in your city.
                Join our waitlist and help us build the developer community you&apos;ve always wanted.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/request" className="btn btn-primary">
                  Request Your City
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/about" className="btn btn-outline">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
