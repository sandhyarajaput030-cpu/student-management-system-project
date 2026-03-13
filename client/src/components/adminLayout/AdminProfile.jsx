import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner
} from "react-bootstrap";

const API_BASE = "http://localhost:8000/api/users";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

     const res = await axios.get(`${API_BASE}/admin-profile`, config);

      // ✅ Backend returns user directly
      setProfile(res.data);

      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        contact: res.data.contact || ""
      });

    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");

    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        contact: profile.contact
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.put(
        `${API_BASE}/profile`,
        formData,
        config
      );

      setProfile(res.data.user);
      setSuccess("Profile updated successfully ✅");
      setIsEditing(false);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border border-dark" style={{ borderWidth: "2px" }}>
            <Card.Body>

              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">My Profile</h2>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="success" type="submit">
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                profile && (
                  <>
                    <h5>Name</h5>
                    <p>{profile.name}</p>

                    <h5>Email</h5>
                    <p>{profile.email}</p>

                    <h5>Contact</h5>
                    <p>{profile.contact}</p>

                    <h5>Course</h5>
                    <p>{profile.course}</p>

                    <h5>Role</h5>
                    <p className="text-capitalize">{profile.role}</p>

                    <div className="d-grid mt-3">
                      <Button variant="primary" onClick={handleEdit}>
                        Edit Profile
                      </Button>
                    </div>
                  </>
                )
              )}

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminProfile;