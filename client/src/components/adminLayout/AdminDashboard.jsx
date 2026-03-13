import React, { useEffect, useState } from "react";
import { FaUsers, FaClipboardList, FaCheck, FaTimes } from "react-icons/fa";

const AdminDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [pendingStudents, setPendingStudents] = useState(0);
  const [approvedStudents, setApprovedStudents] = useState(0);
  const [recentStudents, setRecentStudents] = useState([]);

  // CARD STYLING
  const cardStyle = {
    color: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const approveButtonStyle = {
    background: "#10b981", // green
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const rejectButtonStyle = {
    background: "#ef4444", // red
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  // HOVER EFFECTS FOR CARDS
  const hoverIn = (e) => {
    e.currentTarget.style.transform = "translateY(-8px)";
    e.currentTarget.style.boxShadow = "0 18px 35px rgba(0,0,0,0.25)";
  };
  const hoverOut = (e) => {
    e.currentTarget.style.transform = "translateY(0px)";
    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
  };

  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/users/admin-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setTotalStudents(data.totalStudents);
        setPendingStudents(data.pendingStudents);
        setApprovedStudents(data.approvedStudents);
        setRecentStudents(data.recentStudents);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  // APPROVE / REJECT HANDLERS
  const handleApprove = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/api/users/student/${studentId}/approve`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) fetchDashboard();
      else alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/api/users/student/${studentId}/reject`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) fetchDashboard();
      else alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div style={{ minHeight: "100%", background: "#f8fafc", padding: "30px" }}>
      {/* WELCOME */}
      <div
        style={{
          background: "#1e293b",
          color: "white",
          padding: "22px",
          borderRadius: "14px",
          marginBottom: "30px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ margin: 0 }}>Welcome back, Admin 👋</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>Manage students and system efficiently.</p>
      </div>

      {/* STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div style={{ ...cardStyle, background: "#6366f1" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <FaUsers size={35} />
          <div>
            <h3>Total Students</h3>
            <p style={{ fontSize: "34px", fontWeight: "bold" }}>{totalStudents}</p>
          </div>
        </div>
        <div style={{ ...cardStyle, background: "#10b981" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <FaClipboardList size={35} />
          <div>
            <h3>Pending Approvals</h3>
            <p style={{ fontSize: "34px", fontWeight: "bold" }}>{pendingStudents}</p>
          </div>
        </div>
        <div style={{ ...cardStyle, background: "#f59e0b" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <FaUsers size={35} />
          <div>
            <h3>Approved Students</h3>
            <p style={{ fontSize: "34px", fontWeight: "bold" }}>{approvedStudents}</p>
          </div>
        </div>
      </div>

      {/* RECENT STUDENTS TABLE */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>Recent Students</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Course</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.map((s) => (
              <tr key={s._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{s.name}</td>
                <td style={{ padding: "12px" }}>{s.email}</td>
                <td style={{ padding: "12px" }}>{s.course || "Not Assigned"}</td>
                <td
                  style={{
                    padding: "12px",
                    color: s.status === "approved" ? "#10b981" : "#f59e0b",
                  }}
                >
                  {s.status === "approved" ? "Approved ✅" : "Pending"}
                </td>
                <td style={{ padding: "12px" }}>
                  {s.status !== "approved" && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => handleApprove(s._id)} style={approveButtonStyle}>
                        <FaCheck /> Approve
                      </button>
                      <button onClick={() => handleReject(s._id)} style={rejectButtonStyle}>
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}
                  {s.status === "approved" && (
                    <span style={{ color: "#10b981" }}>Approved ✅</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;