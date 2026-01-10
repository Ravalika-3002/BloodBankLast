import { useNavigate } from "react-router-dom";

function DonorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>Donor Dashboard</h2>

      <div className="dashboard-cards">
       <div
  className="card clickable"
  onClick={() => navigate("/donor/requests")}
>
  <h3>Donate Blood</h3>
  <p>View and respond to donation requests.</p>
</div>


        <div className="card clickable">
          <h3>My Donations</h3>
          <p>Track donation history.</p>
        </div>

        <div className="card clickable">
          <h3>Eligibility</h3>
          <p>Check donation eligibility.</p>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
