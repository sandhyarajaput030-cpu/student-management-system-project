import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, oldPassword, newPassword } = formData;

    if (!email || !oldPassword || !newPassword) {
      setMessage("All fields required ❌");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/change-password",
        formData
      );
      setMessage(res.data.message);
      setFormData({ email: "", oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error changing password ❌");
    }
  };

  return (
    <div className="change-password-card">
      <h2>Change Password</h2>

      <form onSubmit={handleSubmit} className="change-password-form">

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Old Password */}
        <div className="form-group">
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Enter old password"
            required
          />
        </div>

        {/* New Password */}
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          Change Password
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      {/* --- STYLING --- */}
      <style jsx>{`
        .change-password-card {
          max-width: 450px;
          margin: 40px auto;
          padding: 25px 30px;
          border: 2px solid black;
          border-radius: 12px;
          box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
          background-color: #fff;
        }
        .change-password-card h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }
        .form-group label {
          font-weight: 600;
          margin-bottom: 5px;
        }
        .form-group input {
          padding: 10px;
          border: 1px solid black;
          border-radius: 6px;
          font-size: 14px;
        }
        .btn-submit {
          width: 100%;
          padding: 12px;
          border: 2px solid black;
          border-radius: 8px;
          background-color: black;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-submit:hover {
          background-color: white;
          color: purple;
        }
        .message {
          margin-top: 15px;
          text-align: center;
          font-weight: 600;
          color: green;
        }
      `}</style>
    </div>
  );
};

export default ChangePassword;