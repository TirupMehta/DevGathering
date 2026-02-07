"use client";

import { useEffect, useState } from "react";

export default function WaitlistCounter() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        async function fetchCount() {
            try {
                const res = await fetch("/api/waitlist-count");
                if (res.ok) {
                    const data = await res.json();
                    setCount(data.count);
                }
            } catch {
                // Silently fail
            }
        }

        fetchCount();

        // Refresh every 30 seconds
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    if (count === null) return null;

    return (
        <div className="waitlist-counter">
            <span className="waitlist-count">[{count.toLocaleString()}]</span>
            <span className="waitlist-label">engineers waiting</span>
        </div>
    );
}
