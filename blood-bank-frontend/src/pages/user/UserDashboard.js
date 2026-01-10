import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>User Dashboard</h2>

      <div className="dashboard-cards">
        {/* SEARCH + REQUEST (COMBINED) */}
        <div
          className="card clickable"
          onClick={() => navigate("/user/search")}
        >
          <h3>Search & Request Blood</h3>
          <p>
            Find nearby hospitals and request blood based on availability.
          </p>
        </div>

        {/* MY REQUESTS */}
        <div
          className="card clickable"
          onClick={() => navigate("/user/my-requests")}
        >
          <h3>My Requests</h3>
          <p>Track your blood request status.</p>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
