"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NotifyForm from "@/components/NotifyForm";

interface Event {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    city: string | null;
    venue: string | null;
    event_date: string | null;
    capacity: number | null;
}

const upcomingTopics = [
    "System Design Deep Dives",
    "Production Debugging Stories",
    "Modern Frontend Architecture",
    "Database Performance Optimization",
    "DevOps & Platform Engineering",
    "Career Growth for Engineers",
];

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch("/api/events");
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data.events || []);
                }
            } catch (e) {
                console.error("Failed to fetch events:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    return (
        <>
            <Navigation />

            <main>
                <div className="page-header">
                    <div className="container text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <p className="text-xs text-accent mb-3">Our Events</p>
                        <h1 className="mb-4">Events</h1>
                        <p className="text-muted" style={{ maxWidth: 600 }}>
                            {events.length > 0
                                ? "Check out our upcoming events and RSVP to secure your spot."
                                : "We're preparing our first wave of events. Join the waitlist to be the first to know when we launch in your area."
                            }
                        </p>
                    </div>
                </div>

                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>

                        {loading ? (
                            <div className="text-center" style={{ padding: "64px 0" }}>
                                <span className="spinner" style={{ width: 32, height: 32 }} />
                            </div>
                        ) : events.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>
                                {events.map((event) => (
                                    <Link key={event.id} href={`/events/${event.slug}`} className="event-card">
                                        <h3 className="event-card-title">{event.name}</h3>
                                        {event.description && (
                                            <p className="text-muted mb-4" style={{ fontSize: "15px" }}>
                                                {event.description.length > 150
                                                    ? event.description.slice(0, 150) + "..."
                                                    : event.description
                                                }
                                            </p>
                                        )}
                                        <div className="event-card-meta">
                                            <span>📍 {event.city || "TBA"}</span>
                                            <span>
                                                📅 {event.event_date
                                                    ? new Date(event.event_date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric"
                                                    })
                                                    : "TBA"
                                                }
                                            </span>
                                            {event.capacity && <span>👥 {event.capacity} spots</span>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Coming Soon Card */}
                                <div className="card text-center mb-8" style={{ padding: "64px 32px" }}>
                                    <p className="text-xs text-accent mb-4">Coming Soon</p>
                                    <h2 className="mb-4">No events yet</h2>
                                    <p className="text-muted mb-6" style={{ maxWidth: 450, margin: "0 auto 32px" }}>
                                        We're working behind the scenes to bring the first DevGathering events to life.
                                        Great things take time, and we're making sure our first events set the standard.
                                    </p>
                                    <div style={{ maxWidth: 450, margin: "0 auto" }}>
                                        <NotifyForm />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* What to Expect */}
                        <div className="mb-8">
                            <h2 className="mb-4 text-center">What to expect at our events</h2>
                            <p className="text-muted mb-6 text-center" style={{ maxWidth: 600, margin: "0 auto 32px" }}>
                                Every DevGathering event is carefully curated to maximize value and connection.
                            </p>
                            <div className="features">
                                <div className="card">
                                    <h3 className="feature-title">Intimate Size</h3>
                                    <p className="feature-desc">
                                        20-50 developers per event. Small enough for real conversations,
                                        large enough for diverse perspectives.
                                    </p>
                                </div>
                                <div className="card">
                                    <h3 className="feature-title">Quality Speakers</h3>
                                    <p className="feature-desc">
                                        Practicing engineers sharing real experiences—not vendor pitches
                                        or recycled conference talks.
                                    </p>
                                </div>
                                <div className="card">
                                    <h3 className="feature-title">Networking Time</h3>
                                    <p className="feature-desc">
                                        Dedicated time before and after talks to meet other developers
                                        and form genuine connections.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Topics */}
                        <div className="card text-center" style={{ padding: "48px 32px" }}>
                            <h3 className="mb-4">Topics we're planning</h3>
                            <p className="text-muted mb-5">
                                Here's a sneak peek at the kind of topics our first events will cover:
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
                                {upcomingTopics.map((topic, i) => (
                                    <span key={i} className="badge">{topic}</span>
                                ))}
                            </div>
                            <div className="mt-6">
                                <Link href="/request" className="btn btn-outline">
                                    Request a topic
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
