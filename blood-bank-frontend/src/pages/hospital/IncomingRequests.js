import { useEffect, useState } from "react";
import API from "../../api/axios";

function IncomingRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await API.get("/hospital/requests");
    setRequests(res.data);
  };

  const approve = async (id) => {
    try {
      await API.put(`/hospital/request/${id}/accept`);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Insufficient stock");
    }
  };

  const reject = async (id) => {
    await API.put(`/hospital/request/${id}/decline`);
    fetchRequests();
  };

  return (
    <div className="dashboard">
      <h2>Incoming Blood Requests</h2>

      {requests.map(r => (
        <div key={r._id} className="card">
          <h3>{r.bloodGroup} - {r.units} units</h3>
          <p>User: {r.userId.name}</p>
          <p>City: {r.userId.city}</p>

          <button onClick={() => approve(r._id)}>Approve</button>
          <button onClick={() => reject(r._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default IncomingRequests;
