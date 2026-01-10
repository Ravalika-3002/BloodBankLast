import { useEffect, useState } from "react";
import API from "../../api/axios";

const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

function AdminInventories() {
  const [hospitals, setHospitals] = useState([]);
  const [combined, setCombined] = useState({});

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const res = await API.get("/admin/inventories");
        setHospitals(res.data);
        calculateCombined(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load inventories");
      }
    };

    fetchInventories();
  }, []);

  const calculateCombined = (data) => {
    const totals = {};

    data.forEach(h => {
      h.inventory.forEach(item => {
        totals[item.bloodGroup] =
          (totals[item.bloodGroup] || 0) + item.units;
      });
    });

    setCombined(totals);
  };

  return (
    <div className="dashboard admin-inventory">
      <h2>All Hospitals Inventory</h2>

      {/* PER HOSPITAL INVENTORY */}
      {hospitals.map(h => (
        <div key={h.hospitalId} style={{ marginBottom: "40px" }}>
          <h3>{h.hospitalName} ({h.city})</h3>

          <div className="inventory-cards">
            {h.inventory.map(item => (
              <div
                key={item.bloodGroup}
                className={`inventory-card ${
                  item.units === 0
                    ? "empty-stock"
                    : item.units < 5
                    ? "low-stock"
                    : "ok-stock"
                }`}
              >
                <h3>{item.bloodGroup}</h3>
                <p className="units-text">{item.units} Units</p>

                <span className="stock-label">
                  {item.units === 0
                    ? "NO STOCK"
                    : item.units < 5
                    ? "LOW"
                    : "AVAILABLE"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* COMBINED INVENTORY */}
      <h2 style={{ marginTop: "50px" }}>
        Combined Inventory (All Hospitals)
      </h2>

      <div className="inventory-graph">
        {BLOOD_GROUPS.map(bg => (
          <div key={bg} className="graph-row">
            <span className="label">{bg}</span>

            <div className="bar-container">
              <div
                className={`bar ${
                  (combined[bg] || 0) < 10 ? "low" : "normal"
                }`}
                style={{ width: `${(combined[bg] || 0) * 8}px` }}
              />
            </div>

            <span className="units">{combined[bg] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminInventories;
