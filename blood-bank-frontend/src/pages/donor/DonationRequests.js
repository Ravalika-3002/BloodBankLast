import { useEffect, useState } from "react";
import API from "../../api/axios";

function DonationRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await API.get("/donor/requests");
    setRequests(res.data);
  };

  const accept = async (id) => {
    try {
      await API.put(`/donor/request/${id}/accept`);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const reject = async (id, reason) => {
    try {
      await API.put(`/donor/request/${id}/reject`, { reason });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  /* ===== GROUP BY BLOOD GROUP (LATEST ONLY) ===== */
  const latestPerGroup = Object.values(
    requests.reduce((acc, curr) => {
      const bg = curr.requestId.bloodGroup;

      if (
        !acc[bg] ||
        new Date(curr.requestId.createdAt) >
          new Date(acc[bg].requestId.createdAt)
      ) {
        acc[bg] = curr;
      }

      return acc;
    }, {})
  );

  return (
    <div className="dashboard">
      <h2>Donation Requests</h2>

      {latestPerGroup.length === 0 && (
        <p style={{ color: "#6c757d" }}>
          No donation requests
        </p>
      )}

      {latestPerGroup.map(r => {
        const isRemoved = r.requestId.archived;

        let finalStatus;
        if (isRemoved) {
          finalStatus =
            r.rejectionReason === "Request completed"
              ? "FULFILLED"
              : "CANCELLED";
        } else {
          finalStatus = r.status.toUpperCase();
        }

        return (
          <div key={r._id} className="card">
            <h3>{r.requestId.bloodGroup}</h3>

            <p>
              Units Needed: {r.requestId.unitsRequired}
            </p>

            <p>
              Status: <b>{finalStatus}</b>
            </p>

            {/* Cooling period */}
            {!r.eligibleAtThatTime && !isRemoved && (
              <p style={{ color: "red" }}>
                You are in cooling period
              </p>
            )}

            {/* ACTIONS */}
            {r.status === "pending" &&
              !isRemoved &&
              r.eligibleAtThatTime && (
                <>
                  <button onClick={() => accept(r._id)}>
                    Accept
                  </button>

                  <select
                    onChange={(e) =>
                      reject(r._id, e.target.value)
                    }
                  >
                    <option value="">Reject Reason</option>
                    <option value="Health issue">Health issue</option>
                    <option value="Not available">Not available</option>
                  </select>
                </>
              )}

            {/* FINAL MESSAGE */}
            {isRemoved && (
              <p
                style={{
                  color: "#6c757d",
                  fontStyle: "italic",
                  marginTop: "8px"
                }}
              >
                {finalStatus === "FULFILLED"
                  ? "This request was fulfilled successfully"
                  : "This request was cancelled by the hospital"}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DonationRequests;
