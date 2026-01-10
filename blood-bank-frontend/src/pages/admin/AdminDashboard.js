import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-cards">

        <div
          className="card clickable"
          onClick={() => navigate("/admin/inventories")}
        >
          <h3>Hospital Inventories</h3>
          <p>View blood stock of all hospitals</p>
        </div>

        <div
          className="card clickable"
          onClick={() => navigate("/admin/hospitals")}
        >
          <h3>Manage Hospitals</h3>
          <p>Approve / Reject hospitals</p>
        </div>

        <div
          className="card clickable"
          onClick={() => navigate("/admin/records")}
        >
          <h3>System Records</h3>
          <p>Users • Donors • Hospitals</p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
