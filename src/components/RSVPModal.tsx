"use client";

import { useState } from "react";

interface RSVPModalProps {
    eventId: string;
    eventSlug: string;
    eventName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface RSVPForm {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    linkedinUrl: string;
    message: string;
}

export default function RSVPModal({ eventId, eventSlug, eventName, isOpen, onClose, onSuccess }: RSVPModalProps) {
    const [form, setForm] = useState<RSVPForm>({
        name: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        linkedinUrl: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.name || !form.email) {
            setError("Name and email are required");
            return;
        }

        setStatus("loading");
        setError("");

        try {
            const res = await fetch("/api/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId,
                    eventSlug,
                    ...form,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                onSuccess();
            } else {
                setStatus("error");
                setError(data.error || "Failed to submit RSVP");
            }
        } catch {
            setStatus("error");
            setError("Network error. Please try again.");
        }
    }

    function handleClose() {
        setForm({ name: "", email: "", phone: "", company: "", role: "", linkedinUrl: "", message: "" });
        setStatus("idle");
        setError("");
        onClose();
    }

    return (
        <div
            className="modal-overlay"
            onClick={handleClose}
        >
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <h3>RSVP for {eventName}</h3>
                        <p className="text-muted text-sm">Fill in your details to request a spot</p>
                    </div>
                    <button className="modal-close" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {status === "success" ? (
                    <div className="modal-body text-center" style={{ padding: "48px 24px" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34, 197, 94, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <h3 className="mb-3">RSVP Submitted!</h3>
                        <p className="text-muted mb-5">
                            We've received your request. You'll receive a confirmation email once your RSVP is approved.
                        </p>
                        <button className="btn btn-primary" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-grid mb-4">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="input"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="input"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-grid mb-4">
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                                        className="input"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company</label>
                                    <input
                                        type="text"
                                        value={form.company}
                                        onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))}
                                        className="input"
                                        placeholder="Acme Inc."
                                    />
                                </div>
                            </div>

                            <div className="form-grid mb-4">
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <input
                                        type="text"
                                        value={form.role}
                                        onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                                        className="input"
                                        placeholder="Software Engineer"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        value={form.linkedinUrl}
                                        onChange={(e) => setForm(f => ({ ...f, linkedinUrl: e.target.value }))}
                                        className="input"
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message (optional)</label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                                    className="input"
                                    placeholder="Anything you'd like us to know..."
                                    rows={3}
                                />
                            </div>

                            {error && (
                                <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "8px" }}>{error}</p>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
                                {status === "loading" ? (
                                    <>
                                        <span className="spinner" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    "Submit RSVP"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
