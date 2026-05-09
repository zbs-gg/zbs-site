import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ZBS GG — memory that knows what matters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 30% 40%, rgba(192,132,252,0.12), transparent 55%), radial-gradient(circle at 80% 70%, rgba(125,249,255,0.10), transparent 50%), #050505",
          color: "#f5f5f5",
          padding: "72px",
          fontFamily:
            "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            fontSize: 22,
            letterSpacing: 4,
            color: "rgba(245,245,245,0.55)",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: "rgba(245,245,245,0.4)", fontSize: 14, letterSpacing: 6 }}>
              ▪ INDEPENDENT RESEARCH LAB
            </span>
            <span style={{ color: "#f5f5f5", letterSpacing: 8, fontWeight: 500, fontSize: 28 }}>
              ZBS GG
            </span>
          </div>
          <div style={{ fontSize: 16, color: "rgba(245,245,245,0.4)", letterSpacing: 4 }}>
            zbs.gg
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 104, lineHeight: 1.04, letterSpacing: -2 }}>
            memory that knows
          </div>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1.04,
              letterSpacing: -2,
              color: "rgba(245,245,245,0.5)",
            }}
          >
            what matters.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 18,
            color: "rgba(245,245,245,0.5)",
            letterSpacing: 2,
            paddingTop: 24,
            borderTop: "1px solid rgba(245,245,245,0.12)",
          }}
        >
          <span>
            Garden.Pulse · Garden.Heart · Garden.Emo.Bench
          </span>
          <span style={{ color: "rgba(245,245,245,0.35)" }}>
            MIT · phuket · κ_stateful = 0.81
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
