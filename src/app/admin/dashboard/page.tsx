"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Event {
    id: string;
    slug: string;
    name: string;
    city: string;
    event_date: string;
    is_published: boolean;
    capacity?: number;
}

interface CreateEventForm {
    name: string;
    slug: string;
    city: string;
    venue: string;
    event_date: string;
    capacity: string;
    description: string;
    password: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [subs, setSubs] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<CreateEventForm>({
        name: "", slug: "", city: "", venue: "", event_date: "", capacity: "", description: "", password: ""
    });
    const [createStatus, setCreateStatus] = useState<"idle" | "loading" | "error">("idle");
    const [createError, setCreateError] = useState("");

    // Publish modal state
    const [publishEvent, setPublishEvent] = useState<Event | null>(null);
    const [publishPassword, setPublishPassword] = useState("");
    const [publishStatus, setPublishStatus] = useState<"idle" | "loading" | "error">("idle");
    const [publishError, setPublishError] = useState("");

    // Edit modal state
    const [editEvent, setEditEvent] = useState<Event | null>(null);
    const [editForm, setEditForm] = useState<CreateEventForm>({
        name: "", slug: "", city: "", venue: "", event_date: "", capacity: "", description: "", password: ""
    });
    const [editStatus, setEditStatus] = useState<"idle" | "loading" | "error">("idle");
    const [editError, setEditError] = useState("");

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
        try {
            const res = await fetch("/api/admin/events");
            console.log("Admin events API response status:", res.status);
            const data = await res.json();
            console.log("Admin events API data:", data);
            if (res.ok) {
                setEvents(data.events || []);
                setSubs(data.subscriberCount || 0);
            }
        } catch (e) {
            console.error("Fetch error:", e);
        }
    }, []);

    useEffect(() => {
        async function init() {
            const ok = await checkAuth();
            if (ok) await fetchData();
            setLoading(false);
        }
        init();
    }, [checkAuth, fetchData]);

    async function handleLogout() {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
    }

    async function handleCreateEvent(e: React.FormEvent) {
        e.preventDefault();
        setCreateStatus("loading");
        setCreateError("");

        try {
            const res = await fetch("/api/admin/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: createForm.slug,
                    name: createForm.name,
                    description: createForm.description,
                    city: createForm.city,
                    venue: createForm.venue,
                    eventDate: createForm.event_date,
                    capacity: createForm.capacity ? parseInt(createForm.capacity) : null,
                    password: createForm.password,
                }),
            });

            if (res.ok) {
                setShowCreateModal(false);
                setCreateForm({ name: "", slug: "", city: "", venue: "", event_date: "", capacity: "", description: "", password: "" });
                setCreateStatus("idle");
                await fetchData();
            } else {
                const data = await res.json();
                setCreateError(data.error || "Failed to create event");
                setCreateStatus("error");
            }
        } catch {
            setCreateError("Network error");
            setCreateStatus("error");
        }
    }

    async function handlePublish(e: React.FormEvent) {
        e.preventDefault();
        if (!publishEvent || !publishPassword) return;

        setPublishStatus("loading");
        setPublishError("");

        try {
            const res = await fetch("/api/admin/events", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: publishEvent.slug, action: "publish", password: publishPassword }),
            });
            if (res.ok) {
                setPublishEvent(null);
                setPublishPassword("");
                setPublishStatus("idle");
                await fetchData();
            } else {
                const data = await res.json();
                setPublishError(data.error || "Failed to publish");
                setPublishStatus("error");
            }
        } catch {
            setPublishError("Network error");
            setPublishStatus("error");
        }
    }

    function openEditModal(event: Event) {
        setEditEvent(event);
        setEditForm({
            name: event.name,
            slug: event.slug,
            city: event.city || "",
            venue: "",
            event_date: event.event_date ? event.event_date.split("T")[0] : "",
            capacity: event.capacity?.toString() || "",
            description: "",
            password: ""
        });
        setEditStatus("idle");
        setEditError("");
    }

    async function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editEvent || !editForm.password) return;

        setEditStatus("loading");
        setEditError("");

        try {
            const res = await fetch("/api/admin/events", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editEvent.id,
                    name: editForm.name,
                    slug: editForm.slug,
                    city: editForm.city,
                    venue: editForm.venue,
                    eventDate: editForm.event_date,
                    capacity: editForm.capacity ? parseInt(editForm.capacity) : null,
                    description: editForm.description,
                    password: editForm.password
                }),
            });

            if (res.ok) {
                setEditEvent(null);
                setEditForm({ name: "", slug: "", city: "", venue: "", event_date: "", capacity: "", description: "", password: "" });
                setEditStatus("idle");
                await fetchData();
            } else {
                const data = await res.json();
                setEditError(data.error || "Failed to update event");
                setEditStatus("error");
            }
        } catch {
            setEditError("Network error");
            setEditStatus("error");
        }
    }

    async function handleDelete() {
        if (!editEvent || !editForm.password) {
            setEditError("Password required to delete");
            return;
        }

        if (!confirm(`Are you sure you want to delete "${editEvent.name}"? This action cannot be undone.`)) {
            return;
        }

        setEditStatus("loading");
        setEditError("");

        try {
            const res = await fetch("/api/admin/events", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editEvent.id,
                    password: editForm.password
                }),
            });

            if (res.ok) {
                setEditEvent(null);
                setEditForm({ name: "", slug: "", city: "", venue: "", event_date: "", capacity: "", description: "", password: "" });
                setEditStatus("idle");
                await fetchData();
            } else {
                const data = await res.json();
                setEditError(data.error || "Failed to delete event");
                setEditStatus("error");
            }
        } catch {
            setEditError("Network error");
            setEditStatus("error");
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
                <span className="spinner" style={{ width: 32, height: 32 }} />
            </div>
        );
    }

    const published = events.filter((e) => e.is_published).length;
    const draft = events.filter((e) => !e.is_published).length;

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            {/* Header */}
            <header style={{
                borderBottom: "1px solid var(--border)",
                padding: "16px 0",
                position: "sticky",
                top: 0,
                background: "var(--bg)",
                zIndex: 100
            }}>
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
            <main className="container" style={{ paddingTop: "48px", paddingBottom: "64px" }}>
                <div className="mb-7">
                    <p className="text-xs text-accent mb-3">Dashboard</p>
                    <h1>Overview</h1>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "48px" }}>
                    <div className="card text-center" style={{ padding: "24px" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "4px" }}>{subs}</div>
                        <div className="text-muted" style={{ fontSize: "14px" }}>Subscribers</div>
                    </div>
                    <div className="card text-center" style={{ padding: "24px" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "4px" }}>{events.length}</div>
                        <div className="text-muted" style={{ fontSize: "14px" }}>Total Events</div>
                    </div>
                    <div className="card text-center" style={{ padding: "24px" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "4px" }}>{published}</div>
                        <div className="text-muted" style={{ fontSize: "14px" }}>Published</div>
                    </div>
                    <div className="card text-center" style={{ padding: "24px" }}>
                        <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "4px" }}>{draft}</div>
                        <div className="text-muted" style={{ fontSize: "14px" }}>Draft</div>
                    </div>
                </div>

                {/* Events */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2>Events</h2>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Create Event</span>
                    </button>
                </div>

                {events.length === 0 ? (
                    <div className="card text-center" style={{ padding: "64px 32px" }}>
                        <p className="text-xs text-muted mb-4">No Events</p>
                        <h3 className="mb-4">Create your first event</h3>
                        <p className="text-muted mb-6">Start by creating an event. You can save as draft and publish when ready.</p>
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                            Create Event
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: "12px" }}>
                        {events.map((event) => (
                            <div key={event.id} className="card" style={{ padding: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                            <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>{event.name}</h3>
                                            <span className="badge" style={{
                                                background: event.is_published ? "rgba(34, 197, 94, 0.2)" : "rgba(255,255,255,0.1)",
                                                color: event.is_published ? "#22c55e" : "var(--text-muted)"
                                            }}>
                                                {event.is_published ? "Live" : "Draft"}
                                            </span>
                                        </div>
                                        <p className="text-muted" style={{ fontSize: "14px" }}>
                                            📍 {event.city || "TBA"} · 📅 {event.event_date ? new Date(event.event_date).toLocaleDateString() : "TBA"}
                                            {event.capacity && ` · 👥 ${event.capacity} spots`}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <Link href={`/admin/dashboard/events/${event.id}/rsvps`} className="btn btn-outline">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                            RSVPs
                                        </Link>
                                        <button className="btn btn-outline" onClick={() => openEditModal(event)}>Edit</button>
                                        {!event.is_published && (
                                            <button className="btn btn-primary" onClick={() => setPublishEvent(event)}>
                                                Publish
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Event Modal */}
            {showCreateModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 200,
                        padding: "24px"
                    }}
                    onClick={() => setShowCreateModal(false)}
                >
                    <div
                        className="card"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: 500, padding: 0 }}
                    >
                        <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3>Create Event</h3>
                            <button onClick={() => setShowCreateModal(false)} style={{ padding: "8px", color: "var(--text-muted)" }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateEvent}>
                            <div style={{ padding: "24px", display: "grid", gap: "16px" }}>
                                <div className="form-group">
                                    <label className="form-label">Event Name *</label>
                                    <input
                                        type="text"
                                        value={createForm.name}
                                        onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))}
                                        className="input"
                                        placeholder="First Gathering"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Slug *</label>
                                    <input
                                        type="text"
                                        value={createForm.slug}
                                        onChange={(e) => setCreateForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s/g, "-") }))}
                                        className="input"
                                        placeholder="first-gathering"
                                        required
                                    />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            value={createForm.city}
                                            onChange={(e) => setCreateForm(f => ({ ...f, city: e.target.value }))}
                                            className="input"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Date</label>
                                        <input
                                            type="date"
                                            value={createForm.event_date}
                                            onChange={(e) => setCreateForm(f => ({ ...f, event_date: e.target.value }))}
                                            className="input"
                                        />
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Venue</label>
                                        <input
                                            type="text"
                                            value={createForm.venue}
                                            onChange={(e) => setCreateForm(f => ({ ...f, venue: e.target.value }))}
                                            className="input"
                                            placeholder="TBD"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Capacity</label>
                                        <input
                                            type="number"
                                            value={createForm.capacity}
                                            onChange={(e) => setCreateForm(f => ({ ...f, capacity: e.target.value }))}
                                            className="input"
                                            placeholder="100"
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        value={createForm.description}
                                        onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))}
                                        className="input"
                                        placeholder="Event description..."
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px" }}>
                                    <label className="form-label">Confirm Password *</label>
                                    <input
                                        type="password"
                                        value={createForm.password}
                                        onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))}
                                        className="input"
                                        placeholder="Re-enter admin password to confirm"
                                        required
                                    />
                                    <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>
                                        Re-authentication required for security
                                    </p>
                                </div>
                                {createStatus === "error" && (
                                    <p style={{ color: "#ef4444", fontSize: "14px" }}>{createError}</p>
                                )}
                            </div>
                            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={createStatus === "loading"}>
                                    {createStatus === "loading" ? <span className="spinner" /> : "Create Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Publish Confirmation Modal */}
            {publishEvent && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 200,
                        padding: "24px"
                    }}
                    onClick={() => { setPublishEvent(null); setPublishPassword(""); setPublishError(""); }}
                >
                    <div
                        className="card"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: 420, padding: 0 }}
                    >
                        <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
                            <h3>Publish Event</h3>
                        </div>
                        <form onSubmit={handlePublish}>
                            <div style={{ padding: "24px" }}>
                                <p className="text-muted mb-5">
                                    You are about to publish <strong style={{ color: "var(--text)" }}>{publishEvent.name}</strong>.
                                    This will make it visible to users and notify all subscribers.
                                </p>
                                <div className="form-group">
                                    <label className="form-label">Confirm Password *</label>
                                    <input
                                        type="password"
                                        value={publishPassword}
                                        onChange={(e) => setPublishPassword(e.target.value)}
                                        className="input"
                                        placeholder="Re-enter admin password"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {publishStatus === "error" && (
                                    <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "8px" }}>{publishError}</p>
                                )}
                            </div>
                            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => { setPublishEvent(null); setPublishPassword(""); setPublishError(""); }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={publishStatus === "loading"}>
                                    {publishStatus === "loading" ? <span className="spinner" /> : "Publish Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Event Modal */}
            {editEvent && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 200,
                        padding: "24px"
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) { setEditEvent(null); setEditError(""); } }}
                >
                    <div className="card" style={{ width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto" }}>
                        <form onSubmit={handleEdit}>
                            <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
                                <h2 style={{ marginBottom: "4px" }}>Edit Event</h2>
                                <p className="text-muted text-sm">Update event details</p>
                            </div>
                            <div style={{ padding: "24px", display: "grid", gap: "16px" }}>
                                <div className="form-group">
                                    <label className="form-label">Event Name *</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Slug *</label>
                                    <input
                                        type="text"
                                        value={editForm.slug}
                                        onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            value={editForm.city}
                                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Venue</label>
                                        <input
                                            type="text"
                                            value={editForm.venue}
                                            onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div className="form-group">
                                        <label className="form-label">Event Date</label>
                                        <input
                                            type="date"
                                            value={editForm.event_date}
                                            onChange={(e) => setEditForm({ ...editForm, event_date: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Capacity</label>
                                        <input
                                            type="number"
                                            value={editForm.capacity}
                                            onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                                            className="input"
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="input"
                                        rows={3}
                                        style={{ resize: "vertical" }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm Password *</label>
                                    <input
                                        type="password"
                                        value={editForm.password}
                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                        className="input"
                                        placeholder="Re-enter admin password"
                                        required
                                    />
                                </div>
                                {editStatus === "error" && (
                                    <p style={{ color: "#ef4444", fontSize: "14px" }}>{editError}</p>
                                )}
                            </div>
                            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={handleDelete}
                                    style={{ color: "#ef4444", borderColor: "#ef4444" }}
                                    disabled={editStatus === "loading"}
                                >
                                    Delete Event
                                </button>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => { setEditEvent(null); setEditError(""); }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={editStatus === "loading"}>
                                        {editStatus === "loading" ? <span className="spinner" /> : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
