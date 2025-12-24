import { useEffect, useState } from "react";
import { getStatus } from "./api";

export default function StatusBadge() {
  const [s, setS] = useState(null);

  useEffect(() => {
    const fetchStatus = () => {
      getStatus()
        .then(res => setS(res.data))
        .catch(() => setS({ connected: false }));
    };

    fetchStatus();
    const i = setInterval(fetchStatus, 2000);
    return () => clearInterval(i);
  }, []);

  if (!s) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: s.connected ? "#22c55e" : "#ef4444"
        }}
      />
    
    </div>
  );
}
