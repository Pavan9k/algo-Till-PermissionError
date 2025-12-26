import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HistoricalDataTable = ({ instrumentToken }) => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1))); // 1 month back
  const [toDate, setToDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const fromStr = fromDate.toISOString().split("T")[0] + " 09:15:00";
      const toStr = toDate.toISOString().split("T")[0] + " 15:30:00";

      const response = await axios.get(
        `http://localhost:5000/historical/${instrumentToken}/day`,
        {
          params: {
            from: fromStr,
            to: toStr,
            oi: 1,
          },
        }
      );

      setData(response.data.candles || []);
    } catch (err) {
      setError(err.message || "Failed to fetch historical data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [fromDate, toDate, instrumentToken]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Historical Data</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label>From: </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div>
          <label>To: </label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <button onClick={fetchData} style={{ padding: "0.5rem" }}>
          Fetch
        </button>
      </div>

      {loading ? (
        <div>Loading historical data...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Open</th>
              <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>High</th>
              <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Low</th>
              <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Close</th>
              <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Volume</th>
               <th>OI</th> {/* Add Open Interest */}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}
            {data.map((row, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>
                  {new Date(row.date).toLocaleDateString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{row.open}</td>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{row.high}</td>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{row.low}</td>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{row.close}</td>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{row.volume}</td>
                        <td>{row?.oi || "-"}</td> {/* Display OI */}

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoricalDataTable;
