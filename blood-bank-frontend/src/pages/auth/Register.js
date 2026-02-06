import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./register.css";

function Register() {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true);

    let payload = { ...form };

    // ✅ Check if geolocation exists
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          // ✅ Permission allowed
          payload.location = {
            type: "Point",
            coordinates: [
              pos.coords.longitude,
              pos.coords.latitude
            ]
          };

          await register(payload);
        },
        async () => {
          // ❌ Permission denied → city only
          await register(payload);
        }
      );
    } else {
      // ❌ Browser not supported
      await register(payload);
    }
  };

  const register = async (payload) => {
    try {
      await API.post(`/auth/register/${role}`, payload);

      alert(
        role === "hospital"
          ? "Hospital registered. Awaiting approval."
          : "Registration successful. Please login."
      );

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
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

        <button
          className="register-btn"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
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
