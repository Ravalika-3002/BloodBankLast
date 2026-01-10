import { useEffect, useState } from "react";
import API from "../../api/axios";

function RecordDonation() {
  const [donors, setDonors] = useState([]);
  const [donorId, setDonorId] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    const res = await API.get("/admin/donors");
    setDonors(res.data);
  };

  const submitDonation = async () => {
    if (!donorId || !bloodGroup || units <= 0) {
      alert("Fill all fields correctly");
      return;
    }

    try {
      await API.post("/hospital/donation", {
        donorId,
        bloodGroup,
        units: Number(units)
      });

      alert("Donation recorded & inventory updated");
      setUnits("");
    } catch (err) {
      alert(err.response?.data?.message || "Donation failed");
    }
  };

  return (
    <div className="dashboard">
      <h2>Record Donation</h2>

      <select onChange={e => setDonorId(e.target.value)}>
        <option value="">Select Donor</option>
        {donors.map(d => (
          <option key={d._id} value={d._id}>
            {d.name} ({d.bloodGroup}) - {d.city}
          </option>
        ))}
      </select>

      <input
        placeholder="Blood Group"
        value={bloodGroup}
        onChange={e => setBloodGroup(e.target.value)}
      />

      <input
        type="number"
        placeholder="Units"
        value={units}
        onChange={e => setUnits(e.target.value)}
      />

      <button onClick={submitDonation}>Record Donation</button>
    </div>
  );
}

export default RecordDonation;
