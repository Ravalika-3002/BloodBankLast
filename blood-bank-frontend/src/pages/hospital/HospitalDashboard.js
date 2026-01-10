import { useNavigate } from "react-router-dom";

function HospitalDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>Hospital Dashboard</h2>

      <div className="dashboard-cards">
        <div
          className="card clickable"
          onClick={() => navigate("/hospital/inventory")}
        >
          <h3>Blood Inventory</h3>
          <p>View and manage blood stock.</p>
        </div>
        <div
  className="card clickable"
  onClick={() => navigate("/hospital/donation")}
>
  <h3>Record Donation</h3>
  <p>Add donor blood to inventory</p>
</div>

       <div
  className="card clickable"
  onClick={() => navigate("/hospital/requests")}
>
  <h3>Blood Requests</h3>
  <p>View and respond to user requests.</p>
</div>


        <div className="card clickable">
          <h3>Add Blood Stock</h3>
          <p>Update blood availability.</p>
        </div>
      </div>
    </div>
  );
}

export default HospitalDashboard;
