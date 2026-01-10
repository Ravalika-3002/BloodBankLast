import { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminDonors() {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    API.get("/admin/donors").then(res => setDonors(res.data));
  }, []);

  return (
    <div className="dashboard-cards">
      {donors.map(d => (
        <div key={d._id} className="card">
          <h3>{d.name}</h3>
          <p>Blood Group: {d.bloodGroup}</p>
          <p>City: {d.city}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDonors;
