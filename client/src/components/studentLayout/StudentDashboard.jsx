import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please login.");
          return;
        }

        const res = await axios.get(
          "https://student-management-system-project-o25c.onrender.com/api/users/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStudent(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard");
      }
    };

    fetchDashboard();
  }, []);

  if (error)
    return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;

  if (!student)
    return <h2 style={{ textAlign: "center" }}>Loading Dashboard...</h2>;

  // ================= ATTENDANCE =================

  let attendanceData = student.attendance || {};

  if (attendanceData.days) {
    attendanceData = attendanceData.days;
  }

  if (Array.isArray(attendanceData)) {
    const obj = {};
    attendanceData.forEach((v, i) => {
      obj[i + 1] = v;
    });
    attendanceData = obj;
  }

  let presentCount = 0;

  const attendanceBoxes = Array.from({ length: 30 }, (_, i) => {
    const day = (i + 1).toString();
    const val = attendanceData[day] || "A";

    if (val === "P" || val === "present") {
      presentCount++;
    }

    return val === "P" || val === "present" ? "P" : "A";
  });

  const attendancePercent = Math.round((presentCount / 30) * 100);

  // ================= FEE =================

  const fee = student.fee || { total: 0, paid: 0 };
  const feePercent = fee.total
    ? Math.round((fee.paid / fee.total) * 100)
    : 0;

  const exams = student.exams || [];
  const events = student.events || [];

  return (
   <div
  style={{
    minHeight: "100vh",
    background: "#def0f4e5",
    padding: "40px 0",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
    
      <h1>Student Dashboard</h1>
      <h2>Welcome, {student.name}</h2>

      {/* DASHBOARD CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={{ ...cardStyle, background: "#f366ac", color: "white" }}>
          <h3>Attendance</h3>
          <h2>{attendancePercent}%</h2>
        </div>

        <div style={{ ...cardStyle, background: "#3b82f6", color: "white" }}>
          <h3>Fee Payment</h3>
          <h2>
            ₹{fee.paid} / ₹{fee.total}
          </h2>
        </div>

        <div style={{ ...cardStyle, background: "#10b981", color: "white" }}>
          <h3>Upcoming Exams</h3>
          <h2>{exams.length}</h2>
        </div>

        <div style={{ ...cardStyle, background: "#f59e0b", color: "white" }}>
          <h3>Events</h3>
          <h2>{events.length}</h2>
        </div>

        <div style={{ ...cardStyle, background: "#ef4444", color: "white" }}>
          <h3>Remaining Fee</h3>
          <h2>₹{fee.total - fee.paid}</h2>
        </div>
      </div>

      {/* ================= ATTENDANCE CALENDAR ================= */}

      <h2 style={{ marginTop: "40px" }}>Monthly Attendance</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: "12px",
          maxWidth: "550px",
          marginTop: "20px",
        }}
      >
        {attendanceBoxes.map((status, index) => (
          <div
            key={index}
            style={{
              textAlign: "center",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: "bold",
              background: status === "P" ? "#22c55e" : "#ef4444",
              color: "white",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              Day {index + 1}
            </div>

            <div style={{ fontSize: "18px" }}>{status}</div>
          </div>
        ))}
      </div>

      {/* ================= FEE DETAILS ================= */}

      <h2 style={{ marginTop: "40px" }}>Fee Details</h2>

      <div style={cardStyle}>
        <p>
          <strong>Total Fee:</strong> ₹{fee.total}
        </p>

        <p>
          <strong>Paid Fee:</strong> ₹{fee.paid}
        </p>

        <p>
          <strong>Remaining Fee:</strong> ₹{fee.total - fee.paid}
        </p>

        <div style={progressBar}>
          <div
            style={{
              ...progressFill,
              width: `${feePercent}%`,
              background: "#3b82f6",
            }}
          />
        </div>

        <p style={{ marginTop: "10px" }}>{feePercent}% Paid</p>
      </div>

      {/* ================= EXAM TIMETABLE ================= */}

      <h2 style={{ marginTop: "40px" }}>Exam Timetable</h2>

      {exams.length === 0 ? (
        <p>No exams scheduled</p>
      ) : (
        <table style={tableStyle}>
          <thead style={{ background: "#2563eb", color: "white" }}>
            <tr>
              <th style={tableCell}>Subject</th>
              <th style={tableCell}>Date</th>
              <th style={tableCell}>Time</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam, i) => (
              <tr
                key={i}
                style={{
                  background: i % 2 === 0 ? "#f9fafb" : "white",
                }}
              >
                <td style={tableCell}>{exam.subject}</td>
                <td style={tableCell}>{exam.date}</td>
                <td style={tableCell}>{exam.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= EVENTS ================= */}

      <h2 style={{ marginTop: "40px" }}>Events</h2>

      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {events.map((event, i) => (
            <div key={i} style={cardStyle}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>

              <small>
                {event.date} | {event.time}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  transition: "0.3s",
};

const progressBar = {
  height: "12px",
  background: "#eee",
  borderRadius: "10px",
  marginTop: "10px",
};

const progressFill = {
  height: "12px",
  borderRadius: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

const tableCell = {
  padding: "14px",
  textAlign: "center",
  borderBottom: "1px solid #eee",
};

export default StudentDashboard;
