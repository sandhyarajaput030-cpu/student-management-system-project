import React from "react";
import "./StudentLayout.css";

const StudentFooter = () => {
  return (
    <div className="student-footer">
      <p>
        © {new Date().getFullYear()} Admin Panel | All Rights Reserved
      </p>
    </div>
  );
};

export default StudentFooter;