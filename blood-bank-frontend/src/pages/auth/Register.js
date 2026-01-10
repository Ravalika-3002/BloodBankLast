import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = () => {
    console.log("REGISTER PAYLOAD:", { role, ...form });
    alert("Backend will be connected next");
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join the Blood Bank platform</p>

        {/* ROLE */}
        <div className="form-section">
          <label>Register as</label>
          <select onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="donor">Donor</option>
            <option value="hospital">Hospital</option>
          </select>
        </div>

        {/* ROLE SPECIFIC DETAILS */}
        <div className="form-section">
          {(role === "user" || role === "donor") && (
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                placeholder="Full Name"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>
          )}

          {role === "donor" && (
            <div className="input-group">
              <span className="icon">🩸</span>
              <input
                placeholder="Blood Group (A+, O-)"
                onChange={(e) =>
                  setForm({ ...form, bloodGroup: e.target.value })
                }
              />
            </div>
          )}

          {role === "hospital" && (
            <>
              <div className="input-group">
                <span className="icon">🏥</span>
                <input
                  placeholder="Hospital Name"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hospitalName: e.target.value
                    })
                  }
                />
              </div>

              <div className="input-group">
                <span className="icon">📄</span>
                <input
                  placeholder="License Number"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      licenseNumber: e.target.value
                    })
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="form-section">
          <div className="input-group">
            <span className="icon">📧</span>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <span className="icon">📍</span>
            <input
              placeholder="City"
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />
          </div>
        </div>

        <button className="register-btn" onClick={submit}>
          Register
        </button>

        <p className="login-text">
          Already registered?{" "}
          <span onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
