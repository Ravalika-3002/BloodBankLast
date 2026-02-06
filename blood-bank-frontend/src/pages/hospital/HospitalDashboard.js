import { useNavigate } from "react-router-dom";

function HospitalDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>Hospital Dashboard</h2>

      <div className="dashboard-cards">
        <div className="card clickable" onClick={() => navigate("/hospital/inventory")}>
          <h3>Blood Inventory</h3>
          <p>View and manage blood stock</p>
        </div>

        <div className="card clickable" onClick={() => navigate("/hospital/donation")}>
          <h3>Record Donation</h3>
          <p>Voluntary or request-based donation</p>
        </div>

        <div className="card clickable" onClick={() => navigate("/hospital/requests")}>
          <h3>User Blood Requests</h3>
          <p>Requests from patients</p>
        </div>

        <div className="card clickable" onClick={() => navigate("/hospital/emergency")}>
          <h3>Emergency Blood Request</h3>
          <p>Request donors when inventory is low</p>
        </div>
      </div>
    </div>
  );
}

export default HospitalDashboard;
