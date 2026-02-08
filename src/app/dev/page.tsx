import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "/dev — DevGathering",
    description: "You found the secret dev page! Welcome, fellow developer.",
    robots: "noindex, nofollow",
};

const team = [
    {
        name: "DevGathering",
        role: "Community Platform",
        status: "building",
        version: "0.1.0-beta",
        uptime: "∞",
        commits: "many",
    }
];

const systemInfo = {
    platform: "Next.js 16",
    runtime: "Node.js",
    database: "Supabase",
    hosting: "Vercel",
    coffee_consumed: "☕☕☕☕☕",
    bugs_squashed: 42,
    features_shipped: 12,
    lines_of_code: "enough",
};

export default function DevPage() {
    return (
        <>
            <Navigation />
            <main style={{ paddingTop: "120px", minHeight: "100vh" }}>
                <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <code style={{
                            display: "inline-block",
                            padding: "8px 16px",
                            background: "rgba(255, 107, 53, 0.1)",
                            borderRadius: "6px",
                            color: "#ff6b35",
                            marginBottom: "16px",
                            fontSize: "14px"
                        }}>
                            {`// You weren't supposed to find this...`}
                        </code>
                        <h1 style={{ fontSize: "2.5rem", marginBottom: "16px" }}>/dev</h1>
                        <p style={{ color: "var(--text-muted)" }}>
                            Secret developer page. Welcome, fellow code explorer! 🔍
                        </p>
                    </div>

                    {/* System Info Card */}
                    <div className="card" style={{ marginBottom: "24px" }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "20px",
                            paddingBottom: "16px",
                            borderBottom: "1px solid rgba(255,255,255,0.1)"
                        }}>
                            <span style={{ color: "#22c55e" }}>●</span>
                            <code style={{ color: "var(--text-muted)", fontSize: "14px" }}>system.status</code>
                        </div>

                        <pre style={{
                            background: "rgba(0,0,0,0.3)",
                            padding: "20px",
                            borderRadius: "8px",
                            overflow: "auto",
                            fontSize: "13px",
                            lineHeight: "1.8"
                        }}>
                            <code style={{ color: "var(--text)" }}>
                                {`{
  "platform": "${systemInfo.platform}",
  "runtime": "${systemInfo.runtime}",
  "database": "${systemInfo.database}",
  "hosting": "${systemInfo.hosting}",
  "coffee_consumed": "${systemInfo.coffee_consumed}",
  "bugs_squashed": ${systemInfo.bugs_squashed},
  "features_shipped": ${systemInfo.features_shipped},
  "lines_of_code": "${systemInfo.lines_of_code}",
  "easter_eggs_found": you_tell_me
}`}
                            </code>
                        </pre>
                    </div>

                    {/* Team Card */}
                    <div className="card" style={{ marginBottom: "24px" }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "20px",
                            paddingBottom: "16px",
                            borderBottom: "1px solid rgba(255,255,255,0.1)"
                        }}>
                            <span style={{ color: "#3b82f6" }}>●</span>
                            <code style={{ color: "var(--text-muted)", fontSize: "14px" }}>team.json</code>
                        </div>

                        {team.map((member, i) => (
                            <div key={i} style={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                                gap: "8px 16px",
                                fontSize: "14px",
                                fontFamily: "monospace"
                            }}>
                                <span style={{ color: "#a855f7" }}>&quot;name&quot;:</span>
                                <span style={{ color: "#22c55e" }}>&quot;{member.name}&quot;</span>
                                <span style={{ color: "#a855f7" }}>&quot;role&quot;:</span>
                                <span style={{ color: "#22c55e" }}>&quot;{member.role}&quot;</span>
                                <span style={{ color: "#a855f7" }}>&quot;status&quot;:</span>
                                <span style={{ color: "#ffaa66" }}>&quot;{member.status}&quot;</span>
                                <span style={{ color: "#a855f7" }}>&quot;version&quot;:</span>
                                <span style={{ color: "#22c55e" }}>&quot;{member.version}&quot;</span>
                            </div>
                        ))}
                    </div>

                    {/* Fun Commands */}
                    <div className="card" style={{ marginBottom: "48px" }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "20px",
                            paddingBottom: "16px",
                            borderBottom: "1px solid rgba(255,255,255,0.1)"
                        }}>
                            <span style={{ color: "#ff6b35" }}>●</span>
                            <code style={{ color: "var(--text-muted)", fontSize: "14px" }}>useful_commands.sh</code>
                        </div>

                        <div style={{
                            fontFamily: "monospace",
                            fontSize: "13px",
                            lineHeight: "2",
                            color: "var(--text-muted)"
                        }}>
                            <p><span style={{ color: "#22c55e" }}>$</span> git commit -m &quot;Found the secret page&quot;</p>
                            <p><span style={{ color: "#22c55e" }}>$</span> npm run make-friends</p>
                            <p><span style={{ color: "#22c55e" }}>$</span> curl https://devgathering.in/api/join-community</p>
                            <p><span style={{ color: "#22c55e" }}>$</span> echo &quot;You&apos;re awesome&quot; | tee /dev/happiness</p>
                        </div>
                    </div>

                    {/* Secret message */}
                    <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", marginBottom: "48px" }}>
                        🤫 This page is unlisted. If you found it, you earned it.<br />
                        <span style={{ fontSize: "12px", opacity: 0.7 }}>
                            P.S. Did you try the secret code on the homepage yet? ↑↓↑↓←→←→
                        </span>
                    </p>

                </div>
            </main>
            <Footer />
        </>
    );
}
