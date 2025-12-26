import { useEffect, useState } from "react";
import { getProfile } from "./api";
import StatusBadge from "./StatusBadge";
import LiveTable from "./LiveTable";
import HistoricalDataViewer from "./HistoricalDataViewer";
import InstrumentTable from "./InstrumentTable";
import HistoricalDataTable from "./HistoricalTableData";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = () => {
    window.location.href = "http://localhost:5000/login";
  };

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Checking login status…</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Test App</h2>

      {!profile ? (
        <button onClick={login}>Login with Zerodha</button>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Welcome, <b>{profile.user_shortname}</b>
            <StatusBadge />
          </div>
          {/* <InstrumentTable /> */}

          {/* <LiveTable /> */}
          <HistoricalDataViewer />
          <HistoricalDataTable instrumentToken={16806658} />
        </>
      )}
    </div>
  );
}
