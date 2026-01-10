import { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/admin/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div className="dashboard-cards">
      {users.map(u => (
        <div key={u._id} className="card">
          <h3>{u.name}</h3>
          <p>Email: {u.email}</p>
          <p>City: {u.city}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminUsers;
