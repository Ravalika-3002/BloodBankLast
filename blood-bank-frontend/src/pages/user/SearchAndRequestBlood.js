import { useEffect, useState } from "react";
import API from "../../api/axios";

function SearchAndRequestBlood() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBlood = () => {
    if (!bloodGroup || !units) {
      alert("Please select blood group and units");
      return;
    }

    setLoading(true);

    // 1️⃣ TRY CURRENT LOCATION
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await API.get(
            `/user/search?lat=${latitude}&lng=${longitude}&bloodGroup=${bloodGroup}`
          );

          setResults(res.data);
        } catch (err) {
          alert("Search failed");
        } finally {
          setLoading(false);
        }
      },

      // 2️⃣ FALLBACK → REGISTERED LOCATION
      async () => {
        try {
          const res = await API.get(
            `/user/search?bloodGroup=${bloodGroup}`
          );
          setResults(res.data);
        } catch (err) {
          alert("Search failed");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const requestBlood = async (hospitalId) => {
    try {
      await API.post("/user/request", {
  hospitalId,
  bloodGroup,
  unitsRequired: parseInt(units)
});
      alert("Blood request sent successfully");
    } catch (err) {
      alert("Request failed");
    }
  };

  return (
    <div className="dashboard">
      <h2>Search & Request Blood</h2>

      {/* SEARCH CARD */}
      <div className="card">
        <select onChange={(e) => setBloodGroup(e.target.value)}>
          <option value="">Select Blood Group</option>
          <option>A+</option><option>A-</option>
          <option>B+</option><option>B-</option>
          <option>O+</option><option>O-</option>
          <option>AB+</option><option>AB-</option>
        </select>

        <input
          type="number"
          placeholder="Units Required"
          onChange={(e) => setUnits(e.target.value)}
        />

        <button onClick={searchBlood}>
          {loading ? "Searching..." : "Search Availability"}
        </button>
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="dashboard-cards">
          {results.map((inv) => (
            <div key={inv._id} className="card">
              <h3>{inv.hospitalId.hospitalName}</h3>
              <p className="email-red">{inv.hospitalId.email}</p>
              <p>City: {inv.hospitalId.city}</p>
              <p>Available Units: {inv.quantity}</p>

              <button
                onClick={() => requestBlood(inv.hospitalId._id)}
              >
                Request Blood
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && (
        <p>No blood available within 5 km</p>
      )}
    </div>
  );
}

export default SearchAndRequestBlood;
