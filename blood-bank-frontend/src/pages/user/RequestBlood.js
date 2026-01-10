function RequestBlood() {
  return (
    <div className="dashboard">
      <h2>Request Blood</h2>

      <form className="form">
        <input placeholder="Patient Name" />
        <select>
          <option>Select Blood Group</option>
          <option>A+</option>
          <option>B+</option>
          <option>O+</option>
          <option>AB+</option>
        </select>
        <input placeholder="Hospital Name" />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default RequestBlood;
