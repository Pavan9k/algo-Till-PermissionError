// import { useEffect, useState } from "react";
// import axios from "axios";

// const LIMIT = 100; // instruments per page

// const InstrumentTable = () => {
//   const [instruments, setInstruments] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1); // current page
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchInstruments = async (pageNumber) => {
//     try {
//       setLoading(true);
//       const offset = (pageNumber - 1) * LIMIT;
//       const response = await axios.get(
//         `http://localhost:5000/instruments?offset=${offset}&limit=${LIMIT}`
//       );
//       setInstruments(response.data.instruments || []);
//       setTotal(response.data.total || 0);
//     } catch (err) {
//       setError(err.message || "Failed to fetch instruments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInstruments(page);
//     // eslint-disable-next-line
//   }, [page]);

//   // Safe filter for search
//   const filteredInstruments = instruments.filter((inst) => {
//     const symbol = inst.tradingsymbol?.toLowerCase() || "";
//     const exchange = inst.exchange?.toLowerCase() || "";
//     const token = inst.instrument_token?.toString() || "";

//     return (
//       symbol.includes(search.toLowerCase()) ||
//       exchange.includes(search.toLowerCase()) ||
//       token.includes(search)
//     );
//   });

//   const totalPages = Math.ceil(total / LIMIT);

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h2>Instruments</h2>
//       <input
//         type="text"
//         placeholder="Search by symbol, exchange, or token"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
//       />
//       {loading ? (
//         <div>Loading instruments...</div>
//       ) : error ? (
//         <div style={{ color: "red" }}>{error}</div>
//       ) : (
//         <>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Token</th>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Symbol</th>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Name</th>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Exchange</th>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Type</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredInstruments.map((inst) => (
//                 <tr key={inst.instrument_token}>
//                   <td>{inst.instrument_token}</td>
//                   <td>{inst.tradingsymbol || "-"}</td>
//                   <td>{inst.name || "-"}</td>
//                   <td>{inst.exchange || "-"}</td>
//                   <td>{inst.instrument_type || "-"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination Controls */}
//           <div style={{ marginTop: "1rem" }}>
//             <button
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               style={{ marginRight: "1rem", padding: "0.5rem" }}
//             >
//               Previous
//             </button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <button
//               onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={page === totalPages}
//               style={{ marginLeft: "1rem", padding: "0.5rem" }}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default InstrumentTable;

import { useEffect, useState } from "react";
import axios from "axios";

const LIMIT = 100; // instruments per page

const InstrumentTable = () => {
  const [instruments, setInstruments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputPage, setInputPage] = useState(1); // for jump-to-page input

 const fetchInstruments = async (pageNumber, keyword = "") => {
  try {
    setLoading(true);
    const offset = (pageNumber - 1) * LIMIT;
    const response = await axios.get("http://localhost:5000/instruments", {
      params: {
        offset,
        limit: LIMIT,
        keyword: keyword || undefined, // only send if non-empty
      },
    });

    setInstruments(response.data.instruments || []);
    setTotal(response.data.total || 0);
  } catch (err) {
    setError(err.message || "Failed to fetch instruments");
  } finally {
    setLoading(false);
  }
};

  // Fetch instruments whenever page or search changes
  useEffect(() => {
    fetchInstruments(page, search);
  }, [page, search]);

  const totalPages = Math.ceil(total / LIMIT);

  const handlePageInput = () => {
    let p = parseInt(inputPage);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setPage(p);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Instruments</h2>
      <input
        type="text"
        placeholder="Search by symbol"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reset to first page when searching
        }}
        style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
      />
      {loading ? (
        <div>Loading instruments...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Token</th>
                <th>Symbol</th>
                <th>Name</th>
                <th>Exchange</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {instruments.map((inst) => (
                <tr key={inst.instrument_token}>
                  <td>{inst.instrument_token}</td>
                  <td>{inst.tradingsymbol || "-"}</td>
                  <td>{inst.name || "-"}</td>
                  <td>{inst.exchange || "-"}</td>
                  <td>{inst.instrument_type || "-"}</td>
                </tr>
              ))}
              {instruments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No instruments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              style={{ marginRight: "1rem", padding: "0.5rem" }}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              style={{ marginLeft: "1rem", padding: "0.5rem" }}
            >
              Next
            </button>

            {/* Jump to page input */}
            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              style={{ width: "60px", marginLeft: "1rem", padding: "0.25rem" }}
            />
            <button onClick={handlePageInput} style={{ marginLeft: "0.5rem", padding: "0.25rem 0.5rem" }}>
              Go
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InstrumentTable;



// import { useEffect, useState } from "react";
// import axios from "axios";

// const LIMIT = 100; // instruments per page

// const InstrumentTable = () => {
//   const [instruments, setInstruments] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1); // current page
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [jumpPage, setJumpPage] = useState(""); // input for jump to page

//   const fetchInstruments = async (pageNumber) => {
//     try {
//       setLoading(true);
//       const offset = (pageNumber - 1) * LIMIT;
//       const response = await axios.get(
//         `http://localhost:5000/instruments?offset=${offset}&limit=${LIMIT}`
//       );
//       setInstruments(response.data.instruments || []);
//       setTotal(response.data.total || 0);
//     } catch (err) {
//       setError(err.message || "Failed to fetch instruments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInstruments(page);
//   }, [page]);

//   // Safe filter for search
//   const filteredInstruments = instruments.filter((inst) => {
//     const symbol = inst.tradingsymbol?.toLowerCase() || "";
//     const exchange = inst.exchange?.toLowerCase() || "";
//     const token = inst.instrument_token?.toString() || "";

//     return (
//       symbol.includes(search.toLowerCase()) ||
//       exchange.includes(search.toLowerCase()) ||
//       token.includes(search)
//     );
//   });

//   const totalPages = Math.ceil(total / LIMIT);

//   const handleJumpPage = () => {
//     let target = parseInt(jumpPage);
//     if (isNaN(target)) return;
//     if (target < 1) target = 1;
//     if (target > totalPages) target = totalPages;
//     setPage(target);
//     setJumpPage(""); // clear input
//   };

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h2>Instruments</h2>
//       <input
//         type="text"
//         placeholder="Search by symbol, exchange, or token"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
//       />
//       {loading ? (
//         <div>Loading instruments...</div>
//       ) : error ? (
//         <div style={{ color: "red" }}>{error}</div>
//       ) : (
//         <>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Token</th>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Symbol</th>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Name</th>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Exchange</th>
//                 <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Type</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredInstruments.map((inst) => (
//                 <tr key={inst.instrument_token}>
//                   <td>{inst.instrument_token}</td>
//                   <td>{inst.tradingsymbol || "-"}</td>
//                   <td>{inst.name || "-"}</td>
//                   <td>{inst.exchange || "-"}</td>
//                   <td>{inst.instrument_type || "-"}</td>
//                 </tr>
//               ))}
//               {filteredInstruments.length === 0 && (
//                 <tr>
//                   <td colSpan={5} style={{ textAlign: "center" }}>
//                     No instruments found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Pagination Controls */}
//           <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
//             <button
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               style={{ padding: "0.5rem" }}
//             >
//               Previous
//             </button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <button
//               onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={page === totalPages}
//               style={{ padding: "0.5rem" }}
//             >
//               Next
//             </button>

//             {/* Jump to page */}
//             <input
//               type="number"
//               placeholder="Go to page"
//               value={jumpPage}
//               onChange={(e) => setJumpPage(e.target.value)}
//               style={{ padding: "0.5rem", width: "100px" }}
//             />
//             <button onClick={handleJumpPage} style={{ padding: "0.5rem" }}>
//               Go
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default InstrumentTable;
