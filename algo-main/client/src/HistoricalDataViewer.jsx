import { useEffect, useState } from "react";
import { getHistoricalData } from "./api";

const HistoricalDataViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const instrumentToken = 16806658; // Your F&O token
        const interval = "day"; // daily candles
        const oi = 1; // include Open Interest
        const continuous = 1; // F&O contract, not continuous

        // Calculate last 1 month period
        const today = new Date();
        const priorDate = new Date();
        priorDate.setMonth(today.getMonth() - 1);

        const pad = (num) => (num < 10 ? "0" + num : num);

        const formatDateTime = (date, isStart) => {
          const yyyy = date.getFullYear();
          const mm = pad(date.getMonth() + 1);
          const dd = pad(date.getDate());
          const hh = isStart ? "09:15:00" : "15:30:00";
          return `${yyyy}-${mm}-${dd} ${hh}`;
        };

        const from = formatDateTime(priorDate, true);
        const to = formatDateTime(today, false);

        const response = await getHistoricalData(
          instrumentToken,
          interval,
          from,
          to,
          oi,
          continuous
        );

        setData(response.data?.candles || []);
      } catch (err) {
        setError(err.message || "Failed to fetch historical data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading historical data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Historical Data (with OI) - Last 1 Month</h2>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: "1rem",
          borderRadius: "6px",
          maxHeight: "500px",
          overflow: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default HistoricalDataViewer;
