const mockRequests = [
  {
    id: 1,
    bloodGroup: "A+",
    hospital: "City Hospital",
    status: "Pending"
  },
  {
    id: 2,
    bloodGroup: "O-",
    hospital: "Red Cross Center",
    status: "Approved"
  },
  {
    id: 3,
    bloodGroup: "B+",
    hospital: "Apollo Hospital",
    status: "Rejected",
    reason: "Insufficient blood units available"
  }
];

function MyRequests() {
  return (
    <div className="dashboard">
      <h2>My Blood Requests</h2>

      <div className="dashboard-cards">
        {mockRequests.map(req => (
          <div key={req.id} className="card">
            <h3>Blood Group: {req.bloodGroup}</h3>
            <p><strong>Hospital:</strong> {req.hospital}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${req.status.toLowerCase()}`}>
                {req.status}
              </span>
            </p>

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

export default MyRequests;
