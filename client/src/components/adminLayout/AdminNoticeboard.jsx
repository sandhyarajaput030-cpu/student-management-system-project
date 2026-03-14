import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const API_BASE = "https://student-management-system-project-o25c.onrender.com/api/noticeboard";

const AdminNoticeboard = () => {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNotice = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!newNotice.trim()) return setError("Notice cannot be empty");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        API_BASE,
        { text: newNotice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotices([res.data, ...notices]);
      setNewNotice("");
      setMessage("Notice added successfully ✅");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add notice");
    }
  };

  const handleDeleteNotice = async (id) => {
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(notices.filter((n) => n._id !== id));
      setMessage("Notice deleted ✅");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete notice");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center text-primary fw-bold">📢 Admin Noticeboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {/* Add Notice Form */}
      <Card className="mb-4 shadow-lg border-0 p-4 bg-white rounded-3">
        <Form onSubmit={handleAddNotice}>
          <Row className="align-items-center">
            <Col md={9} className="mb-2 mb-md-0">
              <Form.Control
                type="text"
                placeholder="Type a new notice here..."
                value={newNotice}
                onChange={(e) => setNewNotice(e.target.value)}
                style={{ borderRadius: "12px", padding: "12px" }}
              />
            </Col>
            <Col md={3}>
              <Button
                type="submit"
                variant="success"
                className="w-100 fw-bold"
                style={{ borderRadius: "12px", padding: "10px" }}
              >
                Add Notice
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Notices List */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : notices.length === 0 ? (
        <Alert variant="info" className="text-center">
          No notices available.
        </Alert>
      ) : (
        <div className="d-grid gap-3">
          {notices.map((notice) => (
            <Card
              key={notice._id}
              className="shadow-sm p-3 d-flex flex-column justify-content-between"
              style={{
                borderRadius: "15px",
                background: "linear-gradient(90deg, #797aba, #6f9cb9)",
                color: "#fff",
                transition: "transform 0.2s",
              }}
            >
              <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>{notice.text}</div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small>{new Date(notice.createdAt).toLocaleString()}</small>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteNotice(notice._id)}
                  style={{ borderRadius: "8px" }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default AdminNoticeboard;
