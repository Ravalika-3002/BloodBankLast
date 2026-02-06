import { useNavigate } from "react-router-dom";

function DonorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>Donor Dashboard</h2>

      <div className="dashboard-cards">
        <div className="card clickable" onClick={() => navigate("/donor/requests")}>
          <h3>Donation Requests</h3>
          <p>Hospital blood requests</p>
        </div>

        <div className="card clickable" onClick={() => navigate("/donor/donations")}>
          <h3>My Donations</h3>
          <p>Donation history</p>
        </div>

        <div className="card clickable" onClick={() => navigate("/donor/eligibility")}>
          <h3>Eligibility</h3>
          <p>Check donation cooldown</p>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
