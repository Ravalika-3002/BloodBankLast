import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./adminRecords.css";

function AdminRecords() {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (type) => {
    try {
      const res = await API.get(`/admin/${type}`);
      setRecords(res.data);
    } catch (err) {
      alert("Failed to load records");
    }
  };

  return (
    <div className="admin-records">

      {/* TABS */}
      <div className="records-tabs">
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>

        <button
          className={`tab ${activeTab === "donors" ? "active" : ""}`}
          onClick={() => setActiveTab("donors")}
        >
          Donors
        </button>

        <button
          className={`tab ${activeTab === "hospitals" ? "active" : ""}`}
          onClick={() => setActiveTab("hospitals")}
        >
          Hospitals
        </button>
      </div>

      {/* CARDS */}
      <div className="records-grid">
        {records.length === 0 && <p>No records found</p>}

        {records.map((item) => {
          const hasCity = item.city && item.city.trim() !== "";
          const hasCoordinates =
            item.location?.coordinates?.length === 2;

          return (
            <div key={item._id} className="record-card">
              <h3 className="record-title">
                {item.name || item.hospitalName}
              </h3>

              {/* EMAIL IN RED */}
              <p className="email-red">{item.email}</p>

              {/* LOCATION LOGIC */}
              {hasCity ? (
                <p className="city-text">📍 {item.city}</p>
              ) : hasCoordinates ? (
                <p className="city-text">
                  📍 {item.location.coordinates[1]}, {item.location.coordinates[0]}
                </p>
              ) : (
                <p className="city-text">📍 Location not available</p>
              )}

              {/* DONOR BLOOD GROUP */}
              {item.bloodGroup && (
                <p><b>Blood Group:</b> {item.bloodGroup}</p>
              )}

              {/* STATUS */}
              {item.status && (
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminRecords;
