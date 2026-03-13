import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner
} from 'react-bootstrap';

// Use singular `student` route to match server mounting
const API_BASE = "http://localhost:8000/api/student";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // ✅ Correct token handling (NO JSON.parse)
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.get(`${API_BASE}/profile`, config);

      const userData = res.data.user || res.data;

      setProfile(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        contact: userData.contact || ''
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');

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
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.put(`${API_BASE}/profile`, formData, config);

      const updatedUser = res.data.user || res.data;

      setProfile(updatedUser);
      setSuccess('Profile updated successfully ✅');
      setIsEditing(false);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
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
          <Card className="shadow">
            <Card.Body>
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Student Profile</h2>
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
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contact</Form.Label>
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
                    <div className="mb-4">
                      <h6 className="text-muted">Full Name</h6>
                      <p className="fs-5">{profile.name}</p>

                      <h6 className="text-muted">Email</h6>
                      <p className="fs-5">{profile.email}</p>

                      <h6 className="text-muted">Contact</h6>
                      <p className="fs-5">{profile.contact}</p>

                      <h6 className="text-muted">Role</h6>
                      <p className="fs-5 text-capitalize">{profile.role}</p>
                  

                      <h6 className="text-muted">Course</h6>
                      <p className="fs-5 text-capitalize">{profile.course}</p>
                     </div>

                      

                    <div className="d-grid">
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

export default StudentProfile;