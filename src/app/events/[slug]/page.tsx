"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RSVPModal from "@/components/RSVPModal";
import { useToast } from "@/components/ToastProvider";

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

export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { showToast } = useToast();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);
    const [showRSVPModal, setShowRSVPModal] = useState(false);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const res = await fetch(`/api/events/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setEvent(data.event);
                } else if (res.status === 404) {
                    setNotFoundState(true);
                }
            } catch (e) {
                console.error("Failed to fetch event:", e);
                setNotFoundState(true);
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [slug]);

    if (notFoundState) {
        notFound();
    }

    if (loading) {
        return (
            <>
                <Navigation />
                <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="spinner" style={{ width: 32, height: 32 }} />
                </main>
                <Footer />
            </>
        );
    }

    if (!event) {
        return notFound();
    }

    const formattedDate = event.event_date
        ? new Date(event.event_date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        })
        : "TBA";

    return (
        <>
            <Navigation />

            <main>
                <div className="page-header">
                    <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
                        <Link href="/events" className="text-muted text-sm mb-4" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Events
                        </Link>
                        <h1 className="mb-4 mt-4">{event.name}</h1>
                        <div className="event-card-meta mb-5">
                            <span>📍 {event.city || "TBA"}</span>
                            <span>📅 {formattedDate}</span>
                            {event.venue && <span>🏢 {event.venue}</span>}
                            {event.capacity && <span>👥 {event.capacity} spots</span>}
                        </div>
                    </div>
                </div>

                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
                        <div className="card mb-6" style={{ padding: "32px" }}>
                            <h2 className="mb-4">About this event</h2>
                            {event.description ? (
                                <p style={{ lineHeight: 1.8, fontSize: "16px" }}>{event.description}</p>
                            ) : (
                                <p className="text-muted">More details coming soon...</p>
                            )}
                        </div>

                        <div className="card mb-6" style={{ padding: "32px" }}>
                            <h2 className="mb-4">Event Details</h2>
                            <div style={{ display: "grid", gap: "16px" }}>
                                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                    <span style={{ width: 40, height: 40, borderRadius: "8px", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                                        📅
                                    </span>
                                    <div>
                                        <p className="text-muted text-sm">Date</p>
                                        <p style={{ fontWeight: 500 }}>{formattedDate}</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                    <span style={{ width: 40, height: 40, borderRadius: "8px", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                                        📍
                                    </span>
                                    <div>
                                        <p className="text-muted text-sm">Location</p>
                                        <p style={{ fontWeight: 500 }}>{event.city || "TBA"}{event.venue && `, ${event.venue}`}</p>
                                    </div>
                                </div>
                                {event.capacity && (
                                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                        <span style={{ width: 40, height: 40, borderRadius: "8px", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                                            👥
                                        </span>
                                        <div>
                                            <p className="text-muted text-sm">Capacity</p>
                                            <p style={{ fontWeight: 500 }}>{event.capacity} attendees</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RSVP CTA */}
                        <div className="card text-center" style={{ padding: "48px 32px", border: "1px solid var(--accent)" }}>
                            <h2 className="mb-3">Want to attend?</h2>
                            <p className="text-muted mb-5" style={{ maxWidth: 400, margin: "0 auto 24px" }}>
                                Submit your RSVP request. Space is limited, and we review each request to ensure a great experience for everyone.
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowRSVPModal(true)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="8.5" cy="7" r="4" />
                                    <line x1="20" y1="8" x2="20" y2="14" />
                                    <line x1="23" y1="11" x2="17" y2="11" />
                                </svg>
                                <span>RSVP Now</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* RSVP Modal */}
            <RSVPModal
                eventId={event.id}
                eventSlug={event.slug}
                eventName={event.name}
                isOpen={showRSVPModal}
                onClose={() => setShowRSVPModal(false)}
                onSuccess={() => {
                    showToast("RSVP submitted! We'll notify you once approved.", "success");
                }}
            />
        </>
    );
}
