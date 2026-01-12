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
      const res = await API.get("/hospital/donors");
      setDonors(res.data);
    } catch {
      alert("Failed to load donors");
    }
  };

  const submitDonation = async () => {
    if (!selectedDonor) {
      alert("Please select a donor");
      return;
    }

    try {
      await API.post("/hospital/donation", {
        donorId: selectedDonor._id,
        bloodGroup: selectedDonor.bloodGroup,
        units: 1 // FIXED: 1 UNIT = 1 BAG
      });

      alert("Donation recorded successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Donation failed");
    }
  };

  return (
    <div className="donation-container">
      <h2>Record Blood Donation</h2>

      <p className="info-text">
        🩸 <strong>1 Unit ≈ 450 ml</strong> (Standard blood donation)
      </p>

      {/* DONOR */}
      <label>Donor</label>
      <select
        onChange={(e) =>
          setSelectedDonor(
            donors.find((d) => d._id === e.target.value)
          )
        }
      >
        <option value="">Select Donor</option>
        {donors.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name} ({d.bloodGroup}) – {d.city}
          </option>
        ))}
      </select>

      {/* BLOOD GROUP */}
      <label>Blood Group</label>
      <input
        value={selectedDonor?.bloodGroup || ""}
        disabled
      />

      {/* UNITS */}
      <label>Donation Quantity</label>
      <input value="1 Unit (≈ 450 ml)" disabled />

      <button onClick={submitDonation}>
        Record Donation
      </button>
    </div>
  );
}

export default RecordDonation;
