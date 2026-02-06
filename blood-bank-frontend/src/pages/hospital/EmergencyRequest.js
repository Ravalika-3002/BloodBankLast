import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./EmergencyRequest.css";

function EmergencyRequest() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [unitsRequired, setUnitsRequired] = useState(1);

  const [requests, setRequests] = useState([]);
  const [donorsMap, setDonorsMap] = useState({});
  const [selectedDonor, setSelectedDonor] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ================= FETCH REQUESTS ================= */
  const fetchRequests = async () => {
    try {
      const res = await API.get("/hospital/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CREATE REQUEST ================= */
  const submitRequest = async () => {
    if (!bloodGroup || unitsRequired <= 0) {
      alert("Please fill all fields correctly");
      return;
    }

    try {
      await API.post("/hospital/request-based-donation", {
        bloodGroup,
        unitsRequired,
        urgency: "emergency"
      });

      setBloodGroup("");
      setUnitsRequired(1);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create request");
    }
  };

  /* ================= FETCH DONORS ================= */
  const fetchDonors = async (requestId) => {
    try {
      const res = await API.get(`/hospital/request/${requestId}/donors`);
      setDonorsMap(prev => ({ ...prev, [requestId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= RECORD DONATION ================= */
  const recordDonation = async (requestId, bloodGroup) => {
    const donorId = selectedDonor[requestId];
    if (!donorId) {
      alert("Please select a donor");
      return;
    }

    try {
      await API.post("/hospital/donation", {
        donorId,
        bloodGroup,
        requestId
      });

      setSelectedDonor(prev => ({ ...prev, [requestId]: "" }));
      fetchRequests();
      fetchDonors(requestId);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to record donation");
    }
  };

  /* ================= REMOVE REQUEST ================= */
  const removeRequest = async (requestId) => {
    if (!window.confirm("Remove this request from hospital list?")) return;

    try {
      await API.put(`/hospital/request/${requestId}/remove`);
      fetchRequests();
    } catch (err) {
      alert("Failed to remove request");
    }
  };

  return (
    <div className="emergency-page">
      <h1>🚨 Emergency Blood Requests</h1>

      {/* ================= CREATE REQUEST ================= */}
      <div className="request-form">
        <select
          value={bloodGroup}
          onChange={e => setBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={unitsRequired}
          onChange={e => setUnitsRequired(Number(e.target.value))}
          placeholder="Units Required"
        />

        <button onClick={submitRequest}>
          Send Emergency Request
        </button>
      </div>

      {/* ================= REQUEST LIST ================= */}
      {requests.length === 0 && (
        <p className="empty-text">No active emergency requests</p>
      )}

      {requests.map(req => {
        const donors = donorsMap[req._id] || [];
        const acceptedDonors = donors.filter(d => d.status === "accepted");

        return (
          <div key={req._id} className="request-card">
            <div className="request-header">
              <h3>{req.bloodGroup}</h3>
              <span className={`status ${req.status}`}>
                {req.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <p>
              Units: {req.unitsCollected} / {req.unitsRequired}
            </p>

            <button
              className="view-btn"
              onClick={() => fetchDonors(req._id)}
            >
              View Donors
            </button>

            {/* ================= DONORS ================= */}
            {donors.length > 0 && (
              <div className="donors-list">
                {donors.map(d => (
                  <div key={d._id} className="donor-card">
                    <div>
                      <strong>{d.donorId.name}</strong>
                      <p>{d.donorId.bloodGroup}</p>
                    </div>

                    <span className={`badge ${d.status}`}>
                      {d.status.toUpperCase()}
                    </span>

                    {!d.eligibleAtThatTime && (
                      <small className="cooling">
                        Cooling period
                      </small>
                    )}

                    {d.rejectionReason && (
                      <small className="reason">
                        {d.rejectionReason}
                      </small>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ================= RECORD DONATION ================= */}
            {req.status !== "fulfilled" && acceptedDonors.length > 0 && (
              <div className="record-card">
                <h4>🩸 Record Blood Donation</h4>
                <p>1 Unit ≈ 450 ml</p>

                <select
                  value={selectedDonor[req._id] || ""}
                  onChange={e =>
                    setSelectedDonor({
                      ...selectedDonor,
                      [req._id]: e.target.value
                    })
                  }
                >
                  <option value="">Select Accepted Donor</option>
                  {acceptedDonors.map(d => (
                    <option key={d._id} value={d.donorId._id}>
                      {d.donorId.name}
                    </option>
                  ))}
                </select>

                <button
                  className="record-btn"
                  onClick={() =>
                    recordDonation(req._id, req.bloodGroup)
                  }
                >
                  Record Donation
                </button>
              </div>
            )}

            {/* ================= REMOVE ================= */}
            <button
              className="cancel-btn"
              onClick={() => removeRequest(req._id)}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default EmergencyRequest;
