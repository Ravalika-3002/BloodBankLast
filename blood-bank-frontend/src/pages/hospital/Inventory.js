import { useEffect, useState } from "react";
import API from "../../api/axios";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function Inventory() {
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/hospital/inventory");

      // ✅ Convert array → object map
      const data = {};
      res.data.forEach(item => {
        data[item.bloodGroup] = item.units;
      });

      setInventory(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load inventory");
    }
  };

  return (
    <div className="dashboard">
      <h2>Blood Inventory</h2>

      <div className="inventory-cards">
        {BLOOD_GROUPS.map(group => {
          const units = inventory[group] || 0;

          return (
            <div
              key={group}
              className={`inventory-card ${
                units === 0
                  ? "empty-stock"
                  : units < 5
                  ? "low-stock"
                  : "ok-stock"
              }`}
            >
              <h3>{group}</h3>
              <p className="units-text">{units} Units</p>

              <span className="stock-label">
                {units === 0
                  ? "NO STOCK"
                  : units < 5
                  ? "LOW"
                  : "AVAILABLE"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inventory;
