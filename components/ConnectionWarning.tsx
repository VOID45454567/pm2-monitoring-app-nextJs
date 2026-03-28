"use client";

interface ConnectionWarningProps {
  serverName: string;
  url: string;
  error?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export default function ConnectionWarning({
  serverName,
  url,
  error,
  onDismiss,
  onRetry,
}: ConnectionWarningProps) {
  return (
    <div
      style={{
        backgroundColor: "#fff3cd",
        borderLeft: "4px solid #ffc107",
        padding: "12px 16px",
        marginBottom: "16px",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <strong style={{ color: "#856404" }}>⚠️ Connection Warning</strong>
        <div style={{ marginTop: "4px", fontSize: "14px", color: "#856404" }}>
          Cannot connect to <strong>{serverName}</strong> ({url})
          {error && <span> - {error}</span>}
        </div>
        <div style={{ marginTop: "4px", fontSize: "12px", color: "#856404" }}>
          Please check if the server is running and accessible.
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: "4px 12px",
              backgroundColor: "#ffc107",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#856404",
              fontWeight: "500",
            }}
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              padding: "4px 12px",
              backgroundColor: "transparent",
              border: "1px solid #856404",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#856404",
            }}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
