import { hospitals } from "../../data/mockData";

function SearchBlood() {
  return (
    <div className="dashboard">
      <h2>Search Blood</h2>

      <div className="dashboard-cards">
        {hospitals.map((hospital, index) => (
          <div key={index} className="card">
            <h3>{hospital.name}</h3>
            <p>
              <strong>Available:</strong> {hospital.bloodGroups.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBlood;
