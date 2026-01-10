import { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminAllHospitals() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    API.get("/admin/hospitals").then(res => setHospitals(res.data));
  }, []);

  return (
    <div className="dashboard-cards">
      {hospitals.map(h => (
        <div key={h._id} className="card">
          <h3>{h.hospitalName}</h3>
          <p>Email: {h.email}</p>
          <p>City: {h.city}</p>
          <p>Status: <b>{h.status}</b></p>
        </div>
      ))}
    </div>
  );
}

export default AdminAllHospitals;
