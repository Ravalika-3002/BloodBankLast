import { useEffect, useState } from "react";
import API from "../../api/axios";

function MyDonations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await API.get("/donor/donations");
      setDonations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load donations");
    }
  };

  return (
    <div className="dashboard">
      <h2>My Donations</h2>

      {donations.length === 0 && <p>No donations yet</p>}

      {donations.map((d) => (
        <div key={d._id} className="card">
          <h3>{d.bloodGroup} – 1 Unit</h3>
          <p>Hospital: {d.hospitalId?.hospitalName}</p>
          <p>City: {d.hospitalId?.city}</p>
          <p>
            Date: {new Date(d.donatedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MyDonations;
