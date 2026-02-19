import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./recordDonation.css";

function RecordDonation() {
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      console.log("🔥 CALLING /hospital/donors");
      const res = await API.get("/hospital/donors");
      console.log("BACKEND RESPONSE:", res.data);
      setDonors(res.data);
    } catch (err) {
      console.log("❌ Donor fetch error:", err);
      alert("Failed to load donors");
    }
  };

  const submitDonation = async () => {
    if (!selectedDonor) {
      alert("Please select a donor");
      return;
    }

    await API.post("/hospital/donation", {
      donorId: selectedDonor._id,
      bloodGroup: selectedDonor.bloodGroup
    });

    alert("Donation recorded successfully");
  };

  return (
    <div className="donation-container">
      <h2>Record Blood Donation</h2>

      <p className="info-text">
        🩸 <strong>1 Unit ≈ 450 ml</strong>
      </p>

      <label>Donor</label>
      <select
        onChange={(e) =>
          setSelectedDonor(donors.find((d) => d._id === e.target.value))
        }
      >
        <option value="">Select Donor</option>

        {donors.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name} ({d.bloodGroup}) – {d.city}
          </option>
        ))}
      </select>

      <label>Blood Group</label>
      <input value={selectedDonor?.bloodGroup || ""} disabled />

      <label>Donation Quantity</label>
      <input value="1 Unit (≈ 450 ml)" disabled />

      <button onClick={submitDonation}>Record Donation</button>
    </div>
  );
}

export default RecordDonation;
