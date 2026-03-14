import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  Badge
} from "react-bootstrap";

const StudentNoticeboard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://student-management-system-project-o25c.onrender.com/api/noticeboard/student",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotices(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch notices.");
      setLoading(false);
    }
  };

  // Check if notice is new (within 24 hours)
  const isNew = (date) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return new Date() - new Date(date) < oneDay;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Important":
        return "danger";
      case "Exam":
        return "warning";
      case "Holiday":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <Container fluid className="p-4">

      {/* Gradient Header */}
      <div className="notice-header text-white text-center py-5 mb-5">
        <h2 className="fw-bold">📢 Student Noticeboard</h2>
        <p className="opacity-75">
          Stay updated with latest announcements from Admin
        </p>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && notices.length === 0 && (
        <div className="text-center text-muted">
          <h5>No notices available</h5>
        </div>
      )}

      <Row>
        {notices.map((notice) => (
          <Col md={6} lg={4} key={notice._id} className="mb-4">
            <Card className="notice-card border-0 h-100">
              <Card.Body>

                <div className="d-flex justify-content-between mb-3">
                  <Badge bg={getCategoryColor(notice.category)}>
                    {notice.category || "General"}
                  </Badge>

                  {isNew(notice.createdAt) && (
                    <Badge bg="success">NEW</Badge>
                  )}
                </div>

                 <Card.Title className="fw-bold mb-2">
                  {notice.title ? notice.title : "Notice"}
                 </Card.Title>

                <Card.Text className="text-muted">
                 {notice.text?.replace(notice.title, "")}
                </Card.Text>

              </Card.Body>

              <Card.Footer className="bg-transparent border-0 text-end small text-muted">
                {new Date(notice.createdAt).toLocaleString()}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Styles */}
      <style>
        {`
        .notice-header {
          background: linear-gradient(90deg, #7084f3, #766fe0);
          border-radius: 15px;
        }

        .notice-card {
          backdrop-filter: blur(10px);
          background: rgba(255,255,255,0.8);
          border-radius: 18px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .notice-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        `}
      </style>

    </Container>
  );
};

export default StudentNoticeboard;
