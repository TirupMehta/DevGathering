"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [error, setError] = useState("");

    useEffect(() => {
        async function checkSession() {
            try {
                const res = await fetch("/api/admin/session");
                if (res.ok) {
                    router.push("/admin/dashboard");
                }
            } catch {
                // Not logged in
            }
        }
        checkSession();
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!password) return;

        setStatus("loading");
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            console.log("Login response status:", res.status);
            const data = await res.json();
            console.log("Login response data:", data);

            if (res.ok) {
                console.log("Login successful, redirecting to dashboard...");
                router.push("/admin/dashboard");
            } else {
                setStatus("error");
                setError(data.error || "Invalid credentials");
                setPassword("");
            }
        } catch (e) {
            console.error("Login fetch error:", e);
            setStatus("error");
            setError("Network error. Please try again.");
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg)",
            padding: "24px",
        }}>
            <div className="card" style={{ width: "100%", maxWidth: 420, padding: "48px 40px" }}>
                <div className="text-center mb-6">
                    <Link href="/" className="text-muted text-sm" style={{ display: "inline-block", marginBottom: "24px" }}>
                        ← Back to site
                    </Link>
                    <h1 style={{ fontSize: "1.75rem", marginBottom: "8px" }}>Admin Access</h1>
                    <p className="text-muted">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="Enter admin password"
                            required
                            autoFocus
                            disabled={status === "loading"}
                            autoComplete="current-password"
                        />
                        {status === "error" && (
                            <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "8px" }}>{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === "loading"}
                        style={{ width: "100%", marginTop: "8px" }}
                    >
                        {status === "loading" ? (
                            <>
                                <span className="spinner" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span>Login</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Secure admin access only
                    </p>
                </div>
            </div>
        </div>
    );
}
