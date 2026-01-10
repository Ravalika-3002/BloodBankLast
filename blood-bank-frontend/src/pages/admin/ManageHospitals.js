import { useEffect, useState } from "react";
import API from "../../api/axios";

function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetchPendingHospitals();
  }, []);

  const fetchPendingHospitals = async () => {
    try {
      const res = await API.get("/admin/pending-hospitals");
      setHospitals(res.data);
    } catch (err) {
      alert("Failed to load hospitals");
    }
  };

  const approveHospital = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);
      fetchPendingHospitals();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const rejectHospital = async (id) => {
    try {
      // Simple reject: delete hospital (or update status later)
      await API.delete(`/admin/reject/${id}`);
      fetchPendingHospitals();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  return (
    <div className="dashboard">
      <h2>Manage Hospitals</h2>

      <div className="dashboard-cards">
        {hospitals.length === 0 && (
          <p>No pending hospitals</p>
        )}

        {hospitals.map((h) => (
          <div key={h._id} className="card">
            <h3>{h.hospitalName}</h3>
            <p><b>Email:</b> {h.email}</p>
            <p><b>City:</b> {h.city}</p>

            <div className="card-actions">
              <button
                className="approve-btn"
                onClick={() => approveHospital(h._id)}
              >
                Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => rejectHospital(h._id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageHospitals;
