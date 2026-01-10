import { useState } from "react";

const mockDonationRequests = [
  {
    id: 1,
    hospital: "City Hospital",
    bloodGroup: "A+",
    distance: "3.2 km",
    status: "Pending"
  },
  {
    id: 2,
    hospital: "Apollo Hospital",
    bloodGroup: "O-",
    distance: "4.5 km",
    status: "Pending"
  }
];

function DonationRequests() {
  const [requests, setRequests] = useState(mockDonationRequests);

  const handleAccept = (id) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: "Accepted" } : req
    ));
  };

  const handleReject = (id, reason) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: "Rejected", reason } : req
    ));
  };

  return (
    <div className="dashboard">
      <h2>Donation Requests</h2>

      <div className="dashboard-cards">
        {requests.map(req => (
          <div key={req.id} className="card">
            <h3>{req.hospital}</h3>
            <p><strong>Blood Group:</strong> {req.bloodGroup}</p>
            <p><strong>Distance:</strong> {req.distance}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${req.status.toLowerCase()}`}>
                {req.status}
              </span>
            </p>

            {req.status === "Pending" && (
              <div className="action-buttons">
                <button onClick={() => handleAccept(req.id)}>
                  Accept
                </button>

                <select
                  onChange={(e) =>
                    handleReject(req.id, e.target.value)
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Reject Reason
                  </option>
                  <option value="Not available today">Not available today</option>
                  <option value="Health issues">Health issues</option>
                  <option value="Too far">Too far</option>
                </select>
              </div>
            )}

            {req.status === "Rejected" && (
              <p className="reject-reason">
                <strong>Reason:</strong> {req.reason}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonationRequests;
