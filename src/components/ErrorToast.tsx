import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { errorEmitter } from "@/lib/errorEmitter";

interface ToastItem {
    id: number;
    message: string;
    fullDetail: string;
    exiting: boolean;
}

let idCounter = 0;

const buildErrorHtmlPage = (fullDetail: string): string => {
    let parsed: any = {};
    try {
        parsed = JSON.parse(fullDetail);
    } catch {
        // Handle gracefully
    }

    const statusCode = parsed.status ?? "—";
    const statusText = parsed.statusText ?? "";
    const method = parsed.method ?? "—";
    const url = parsed.url ?? "—";
    const timestamp = parsed.timestamp ? new Date(parsed.timestamp).toLocaleString("vi-VN") : "—";
    const requestData = parsed.requestData ? JSON.stringify(parsed.requestData, null, 2) : null;
    const response = parsed.response ? JSON.stringify(parsed.response, null, 2) : null;

    const isServerError = statusCode >= 500;
    const accentColor = isServerError ? "#dc2626" : "#d97706";
    const accentBg = isServerError ? "#fef2f2" : "#fffbeb";
    const statusLabel = isServerError ? "Server Error" : statusCode >= 400 ? "Client Error" : "Error";

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Error ${statusCode} – Chi tiết lỗi</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
      min-height: 100vh;
      padding: 32px 16px;
      color: #111827;
    }
    .container { max-width: 820px; margin: 0 auto; }

    .hero {
      background: ${accentBg};
      border: 1.5px solid ${accentColor}33;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }
    .hero-icon {
      width: 56px; height: 56px; flex-shrink: 0;
      background: ${accentColor};
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; color: #fff;
    }
    .hero-title {
      font-size: 28px; font-weight: 800;
      color: ${accentColor}; line-height: 1.2;
    }
    .hero-subtitle {
      font-size: 14px; color: #6b7280; margin-top: 4px;
    }
    .status-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: ${accentColor}18;
      color: ${accentColor};
      border: 1px solid ${accentColor}44;
      border-radius: 999px;
      padding: 2px 12px;
      font-size: 12px; font-weight: 700;
      margin-top: 10px;
    }

    .card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      margin-bottom: 16px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .card-header {
      padding: 14px 20px;
      border-bottom: 1px solid #f3f4f6;
      font-weight: 700; font-size: 13px;
      color: #374151;
      display: flex; align-items: center; gap: 8px;
      background: #fafafa;
    }
    .card-header span.dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: ${accentColor}; display: inline-block;
    }
    .info-row {
      display: flex; align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid #f9fafb;
      font-size: 14px;
    }
    .info-row:last-child { border-bottom: none; }
    .info-label {
      width: 130px; flex-shrink: 0;
      font-weight: 600; color: #6b7280; font-size: 12px;
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .info-value { color: #111827; word-break: break-all; }
    .info-value.method {
      font-weight: 800; font-size: 13px; letter-spacing: 0.05em;
      color: #2563eb;
    }
    .info-value.url { font-family: monospace; font-size: 13px; color: #059669; }
    .info-value.status-ok { color: #16a34a; font-weight: 700; }
    .info-value.status-err { color: ${accentColor}; font-weight: 700; }

    pre {
      background: #0f172a;
      color: #e2e8f0;
      border-radius: 0 0 12px 12px;
      padding: 20px;
      font-size: 13px;
      font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      overflow-x: auto;
      line-height: 1.7;
      margin: 0;
      max-height: 360px;
      overflow-y: auto;
    }
    pre .key  { color: #93c5fd; }
    pre .str  { color: #86efac; }
    pre .num  { color: #fca5a5; }
    pre .bool { color: #fbbf24; }
    pre .null { color: #94a3b8; }

    .empty { padding: 20px; color: #9ca3af; font-size: 13px; font-style: italic; }

    .footer {
      text-align: center; font-size: 12px; color: #9ca3af; margin-top: 24px;
    }
    .back-btn {
      display: inline-block;
      margin-top: 8px;
      padding: 6px 18px;
      background: #111827; color: #fff;
      border-radius: 8px; font-size: 12px; font-weight: 600;
      cursor: pointer; border: none;
      text-decoration: none;
    }
    .back-btn:hover { background: #374151; }
  </style>
</head>
<body>
<div class="container">

  <div class="hero">
    <div class="hero-icon">⚠️</div>
    <div>
      <div class="hero-title">HTTP ${statusCode} – ${statusText || statusLabel}</div>
      <div class="hero-subtitle">Đã xảy ra lỗi trong quá trình gọi API. Xem chi tiết bên dưới.</div>
      <div class="status-badge"><span>●</span> ${statusLabel} &nbsp;·&nbsp; ${timestamp}</div>
    </div>
  </div>

  <!-- Request info -->
  <div class="card">
    <div class="card-header"><span class="dot"></span> Thông tin yêu cầu</div>
    <div class="info-row">
      <span class="info-label">Method</span>
      <span class="info-value method">${method}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Endpoint</span>
      <span class="info-value url">${url}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Status code</span>
      <span class="info-value ${statusCode >= 400 ? "status-err" : "status-ok"}">${statusCode} ${statusText}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Thời gian</span>
      <span class="info-value">${timestamp}</span>
    </div>
  </div>

  <!-- Response body -->
  <div class="card">
    <div class="card-header"><span class="dot"></span> Phản hồi từ server</div>
    ${response ? `<pre>${syntaxHighlight(response)}</pre>` : '<div class="empty">Không có dữ liệu phản hồi.</div>'}
  </div>

  <!-- Request body -->
  <div class="card">
    <div class="card-header"><span class="dot"></span> Dữ liệu gửi lên (Request Body)</div>
    ${requestData ? `<pre>${syntaxHighlight(requestData)}</pre>` : '<div class="empty">Không có request body.</div>'}
  </div>

  <div class="footer">
    <div>Trang này được tạo tự động bởi hệ thống xử lý lỗi API.</div>
    <button class="back-btn" onclick="window.close()">✕ Đóng tab này</button>
  </div>
</div>
</body>
</html>`;
};

function syntaxHighlight(json: string): string {
    return json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
            (match) => {
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) return `<span class="key">${match}</span>`;
                    return `<span class="str">${match}</span>`;
                }
                if (/true|false/.test(match)) return `<span class="bool">${match}</span>`;
                if (/null/.test(match)) return `<span class="null">${match}</span>`;
                return `<span class="num">${match}</span>`;
            }
        );
}

const ErrorToast = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const unsubscribe = errorEmitter.on(({ message, fullDetail }) => {
            const id = ++idCounter;
            setToasts((prev) => [...prev, { id, message, fullDetail, exiting: false }]);

            // Start exit animation after 4700ms, remove at 5000ms
            setTimeout(() => {
                setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
                setTimeout(() => {
                    setToasts((prev) => prev.filter((t) => t.id !== id));
                }, 300);
            }, 4700);
        });

        return unsubscribe;
    }, []);

    const dismiss = (id: number) => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
    };

    const openDetail = (fullDetail: string) => {
        const html = buildErrorHtmlPage(fullDetail);
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    };

    return ReactDOM.createPortal(
        <div
            style={{
                position: "fixed",
                top: 24,
                right: 24,
                zIndex: 99999,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                pointerEvents: "none"
            }}
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    style={{
                        pointerEvents: "all",
                        minWidth: 340,
                        maxWidth: 440,
                        background: "#fff1f0",
                        border: "1.5px solid #ff4d4f",
                        borderRadius: 12,
                        boxShadow: "0 8px 32px rgba(255,77,79,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        opacity: toast.exiting ? 0 : 1,
                        transform: toast.exiting ? "translateX(60px)" : "translateX(0)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        animation: "slideInRight 0.3s ease"
                    }}
                >
                    {/* Red circle icon */}
                    <div
                        style={{
                            flexShrink: 0,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "#ff4d4f",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 1
                        }}
                    >
                        <span style={{ color: "#fff", fontSize: 13, fontWeight: 900, lineHeight: 1 }}>×</span>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 14,
                                color: "#cf1322",
                                marginBottom: 2
                            }}
                        >
                            Lỗi
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "#820014",
                                lineHeight: 1.5,
                                wordBreak: "break-word",
                                marginBottom: 8,
                                opacity: 0.85
                            }}
                        >
                            {toast.message}
                        </div>
                        <button
                            onClick={() => openDetail(toast.fullDetail)}
                            style={{
                                background: "transparent",
                                border: "1px solid #ff4d4f",
                                borderRadius: 6,
                                color: "#ff4d4f",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                padding: "2px 10px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#ff4d4f";
                                e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#ff4d4f";
                            }}
                        >
                            🔍 View detail
                        </button>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => dismiss(toast.id)}
                        style={{
                            flexShrink: 0,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#bfbfbf",
                            fontSize: 18,
                            lineHeight: 1,
                            padding: 0,
                            marginTop: -2,
                            transition: "color 0.2s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ff4d4f")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#bfbfbf")}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
            ))}

            <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>,
        document.body
    );
};

export default ErrorToast;
