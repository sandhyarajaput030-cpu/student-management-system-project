import React from "react";
import "./StudentLayout.css";

const StudentHeader = () => {
  return (
    <div className="student-header">
      <div className="header-left">
        <h2>👨‍🎓 Students Management</h2>
      </div>

      <div className="header-right">
        <input
          type="text"
          placeholder="🔍 Search students..."
          className="search-input"
        />
        <button className="add-btn">+ Add Student</button>
      </div>
    </div>
  );
};

export default StudentHeader;