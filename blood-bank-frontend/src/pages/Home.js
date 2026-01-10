function Home() {
  return (
    <div className="home-hero">
      <div className="home-content">
        <h1 className="home-title">
          Blood Bank Management System
        </h1>

        <p className="home-subtitle">
          Find blood. Donate blood. Save lives.
        </p>

        <div className="home-features">
          <div className="feature-card">
            🩸 Quick Blood Search
          </div>
          <div className="feature-card">
            ❤️ Easy Donor Registration
          </div>
          <div className="feature-card">
            🏥 Hospital Inventory Tracking
          </div>
        </div>
      </div>

      <div className="home-image">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
          alt="Blood Donation"
        />
      </div>
    </div>
  );
}

export default Home;
