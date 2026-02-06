import { useEffect, useState } from "react";
import API from "../../api/axios";

const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

function Inventory() {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/hospital/inventory");

      const map = {};
      res.data.forEach(item => {
        map[item.bloodGroup] = item.units;
      });

      setInventory(map);
    } catch (err) {
      console.error(err);
      alert("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading inventory...</p>;
  }

  return (
    <div className="dashboard">
      <h2>Blood Inventory</h2>

      <div className="inventory-cards">
        {BLOOD_GROUPS.map(bg => {
          const units = inventory[bg] || 0;

          return (
            <div
              key={bg}
              className={`inventory-card ${
                units === 0
                  ? "empty-stock"
                  : units < 5
                  ? "low-stock"
                  : "ok-stock"
              }`}
            >
              <h3>{bg}</h3>
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
