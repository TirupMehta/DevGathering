"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Event {
    id: string;
    slug: string;
    name: string;
    city: string;
    venue: string;
    event_date: string;
}

interface RSVP {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    role: string | null;
    linkedin_url: string | null;
    message: string | null;
    status: string;
    created_at: string;
    approved_at: string | null;
}

export default function RSVPManagementPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: eventId } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<Event | null>(null);
    const [rsvps, setRsvps] = useState<RSVP[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [expandedRsvp, setExpandedRsvp] = useState<string | null>(null);

    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/session");
            if (!res.ok) {
                router.push("/admin");
                return false;
            }
            return true;
        } catch {
            router.push("/admin");
            return false;
        }
    }, [router]);

    const fetchData = useCallback(async () => {
        const isAuth = await checkAuth();
        if (!isAuth) return;

        try {
            // Fetch RSVPs for this event
            const rsvpRes = await fetch(`/api/admin/rsvp?eventId=${eventId}`);
            if (rsvpRes.ok) {
                const data = await rsvpRes.json();
                setRsvps(data.rsvps || []);
            }

            // Fetch events to get event details
            const eventsRes = await fetch("/api/admin/events");
            if (eventsRes.ok) {
                const data = await eventsRes.json();
                const foundEvent = data.events?.find((e: Event) => e.id === eventId);
                setEvent(foundEvent || null);
            }
        } catch (e) {
            console.error("Failed to fetch data:", e);
        } finally {
            setLoading(false);
        }
    }, [eventId, checkAuth]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    async function handleAction(rsvpId: string, action: "approve" | "reject" | "resend_email") {
        setActionLoading(rsvpId);

        try {
            const res = await fetch("/api/admin/rsvp", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rsvpId, action }),
            });

            const data = await res.json();

            if (res.ok) {
                if (action === "resend_email") {
                    alert(data.emailSent ? "Email sent successfully!" : `Email failed: ${data.message}`);
                }
                await fetchData();
            } else {
                alert(data.error || `Failed to ${action} RSVP`);
            }
        } catch (e) {
            console.error(`Failed to ${action} RSVP:`, e);
            alert("Network error");
        } finally {
            setActionLoading(null);
        }
    }

    async function handleLogout() {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
    }

    const pendingCount = rsvps.filter(r => r.status === "pending").length;
    const approvedCount = rsvps.filter(r => r.status === "approved").length;
    const rejectedCount = rsvps.filter(r => r.status === "rejected").length;

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
                <span className="spinner" style={{ width: 32, height: 32 }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            {/* Header */}
            <header style={{ borderBottom: "1px solid var(--border)", padding: "16px 0", position: "sticky", top: 0, background: "var(--bg)", zIndex: 100 }}>
                <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Link href="/" style={{ fontWeight: 600, fontSize: "18px" }}>DevGathering</Link>
                        <span className="badge" style={{ background: "var(--accent)", color: "var(--bg)" }}>Admin</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="container" style={{ paddingTop: "32px", paddingBottom: "64px" }}>
                <Link href="/admin/dashboard" className="text-muted text-sm mb-4" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </Link>

                <div className="mb-6 mt-4">
                    <h1 className="mb-2">{event?.name || "Event"} - RSVPs</h1>
                    <p className="text-muted">
                        {event?.city && `📍 ${event.city}`}
                        {event?.event_date && ` · 📅 ${new Date(event.event_date).toLocaleDateString()}`}
                    </p>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
                    <div className="card text-center" style={{ padding: "20px" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--accent)" }}>{pendingCount}</div>
                        <div className="text-muted text-sm">Pending</div>
                    </div>
                    <div className="card text-center" style={{ padding: "20px" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#22c55e" }}>{approvedCount}</div>
                        <div className="text-muted text-sm">Approved</div>
                    </div>
                    <div className="card text-center" style={{ padding: "20px" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ef4444" }}>{rejectedCount}</div>
                        <div className="text-muted text-sm">Rejected</div>
                    </div>
                </div>

                {/* RSVP List */}
                <h2 className="mb-4">All RSVPs ({rsvps.length})</h2>

                {rsvps.length === 0 ? (
                    <div className="card text-center" style={{ padding: "64px 24px" }}>
                        <p className="text-muted">No RSVPs yet for this event.</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: "12px" }}>
                        {rsvps.map((rsvp) => (
                            <div key={rsvp.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                                {/* RSVP Header */}
                                <div
                                    style={{
                                        padding: "20px 24px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        flexWrap: "wrap",
                                        gap: "16px"
                                    }}
                                    onClick={() => setExpandedRsvp(expandedRsvp === rsvp.id ? null : rsvp.id)}
                                >
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                                            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{rsvp.name}</h3>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: rsvp.status === "approved"
                                                        ? "rgba(34, 197, 94, 0.2)"
                                                        : rsvp.status === "rejected"
                                                            ? "rgba(239, 68, 68, 0.2)"
                                                            : "rgba(255, 107, 53, 0.2)",
                                                    color: rsvp.status === "approved"
                                                        ? "#22c55e"
                                                        : rsvp.status === "rejected"
                                                            ? "#ef4444"
                                                            : "var(--accent)"
                                                }}
                                            >
                                                {rsvp.status}
                                            </span>
                                        </div>
                                        <p className="text-muted text-sm">
                                            {rsvp.email} {rsvp.company && `· ${rsvp.company}`}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        {rsvp.status === "pending" && (
                                            <>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={(e) => { e.stopPropagation(); handleAction(rsvp.id, "approve"); }}
                                                    disabled={actionLoading === rsvp.id}
                                                    style={{ fontSize: "13px", height: "36px" }}
                                                >
                                                    {actionLoading === rsvp.id ? <span className="spinner" /> : "Approve"}
                                                </button>
                                                <button
                                                    className="btn btn-outline"
                                                    onClick={(e) => { e.stopPropagation(); handleAction(rsvp.id, "reject"); }}
                                                    disabled={actionLoading === rsvp.id}
                                                    style={{ fontSize: "13px", height: "36px" }}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {rsvp.status === "approved" && (
                                            <button
                                                className="btn btn-outline"
                                                onClick={(e) => { e.stopPropagation(); handleAction(rsvp.id, "resend_email"); }}
                                                disabled={actionLoading === rsvp.id}
                                                style={{ fontSize: "13px", height: "36px" }}
                                            >
                                                {actionLoading === rsvp.id ? <span className="spinner" /> : "Resend Email"}
                                            </button>
                                        )}
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            style={{
                                                width: 20,
                                                height: 20,
                                                color: "var(--text-muted)",
                                                transform: expandedRsvp === rsvp.id ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.2s"
                                            }}
                                        >
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedRsvp === rsvp.id && (
                                    <div style={{
                                        padding: "20px 24px",
                                        borderTop: "1px solid var(--border)",
                                        background: "var(--bg)",
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, 1fr)",
                                        gap: "16px"
                                    }}>
                                        <div>
                                            <p className="text-muted text-xs" style={{ marginBottom: "4px" }}>Email</p>
                                            <p>{rsvp.email}</p>
                                        </div>
                                        {rsvp.phone && (
                                            <div>
                                                <p className="text-muted text-xs" style={{ marginBottom: "4px" }}>Phone</p>
                                                <p>{rsvp.phone}</p>
                                            </div>
                                        )}
                                        {rsvp.company && (
                                            <div>
                                                <p className="text-muted text-xs" style={{ marginBottom: "4px" }}>Company</p>
                                                <p>{rsvp.company}</p>
                                            </div>
                                        )}
                                        {rsvp.role && (
                                            <div>
                                                <p className="text-muted text-xs" style={{ marginBottom: "4px" }}>Role</p>
                                                <p>{rsvp.role}</p>
                                            </div>
                                        )}
                                        {rsvp.linkedin_url && (
                                            <div>
                                                <p className="text-muted text-xs" style={{ marginBottom: "4px" }}>LinkedIn</p>
                                                <a href={rsvp.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-accent">
                                                    View Profile →
                                                </a>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-muted text-xs" style={{ marginBottom: "4px" }}>Submitted</p>
                                            <p>{new Date(rsvp.created_at).toLocaleString()}</p>
                                        </div>
                                        {rsvp.message && (
                                            <div style={{ gridColumn: "1 / -1" }}>
                                                <p className="text-muted text-xs" style={{ marginBottom: "4px" }}>Message</p>
                                                <p style={{ lineHeight: 1.6 }}>{rsvp.message}</p>
                                            </div>
                                        )}
                                        {rsvp.approved_at && (
                                            <div>
                                                <p className="text-muted text-xs" style={{ marginBottom: "4px" }}>Approved At</p>
                                                <p>{new Date(rsvp.approved_at).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
