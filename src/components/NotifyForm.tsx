"use client";

import { useState, useRef } from "react";

export default function NotifyForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const inputRef = useRef<HTMLInputElement>(null);

    // Cmd+K to focus
    // Cmd+K listener removed

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            const res = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    if (status === "success") {
        return (
            <div className="badge badge-success">
                You&apos;re in! We&apos;ll be in touch.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="hero-form">
            <div className="command-input-wrapper">
                <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to join the waitlist..."
                    required
                    disabled={status === "loading"}
                    className="input command-input"
                    style={{ paddingLeft: "16px" }}
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
                {status === "loading" ? (
                    <span className="spinner" />
                ) : (
                    <>
                        Notify Me
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </>
                )}
            </button>
        </form>
    );
}
