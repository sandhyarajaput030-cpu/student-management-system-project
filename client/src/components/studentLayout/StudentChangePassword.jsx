import React from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from "react-bootstrap";

const API_BASE = "http://localhost:8000/api/student"; // FIXED http

export default class ChangePassword extends React.Component {
  state = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    loading: false,
    error: "",
    success: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({ error: "", success: "" });

    const { currentPassword, newPassword, confirmPassword } = this.state;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return this.setState({ error: "Please fill all fields." });
    }

    if (newPassword.length < 6) {
      return this.setState({ error: "New password must be at least 6 characters." });
    }

    if (newPassword !== confirmPassword) {
      return this.setState({ error: "Passwords do not match." });
    }

    // ✅ Get token instead of email
    const token = localStorage.getItem("token");

    if (!token) {
      return this.setState({ error: "Session expired. Please login again." });
    }

    this.setState({ loading: true });

    try {
      const res = await axios.post(
        `${API_BASE}/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      this.setState({
        success: res.data?.message || "Password changed successfully.",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to change password. Try again.";
      this.setState({ error: msg });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { currentPassword, newPassword, confirmPassword, loading, error, success } = this.state;

    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={9} lg={7}>
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="mb-3 text-center">Change Password</h4>

                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={this.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={currentPassword}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={newPassword}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-grid">
                    <Button type="submit" variant="success" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner size="sm" /> Updating...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </div>
                </Form>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}