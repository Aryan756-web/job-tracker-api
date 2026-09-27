import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [isRegister, setIsRegister] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [jobForm, setJobForm] = useState({
    company: "",
    position: "",
    status: "Applied",
  });

  const [editingJobId, setEditingJobId] = useState(null);

  // -----------------------------
  // LOGIN
  // -----------------------------

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      setLoginData({
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // REGISTER
  // -----------------------------

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful. Please login.");

      setRegisterData({
        name: "",
        email: "",
        password: "",
      });

      setIsRegister(false);
    } catch (error) {
      setMessage("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // GET JOBS
  // -----------------------------

  const fetchJobs = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load jobs");
        return;
      }

      setJobs(data.jobs || []);
    } catch (error) {
      setMessage("Failed to load jobs.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  // -----------------------------
  // ADD JOB
  // -----------------------------

  const handleAddJob = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add job");
        return;
      }

      setJobs([...jobs, data.job]);

      setJobForm({
        company: "",
        position: "",
        status: "Applied",
      });

      setShowForm(false);
    } catch (error) {
      setMessage("Failed to add job.");
    }
  };

  // -----------------------------
  // UPDATE JOB
  // -----------------------------

  const handleUpdateJob = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/jobs/${editingJobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update job");
        return;
      }

      setJobs(
        jobs.map((job) =>
          job._id === editingJobId ? data.job : job
        )
      );

      setEditingJobId(null);

      setJobForm({
        company: "",
        position: "",
        status: "Applied",
      });

      setShowForm(false);
    } catch (error) {
      setMessage("Failed to update job.");
    }
  };

  // -----------------------------
  // DELETE JOB
  // -----------------------------

  const handleDeleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete job");
        return;
      }

      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      setMessage("Failed to delete job.");
    }
  };

  // -----------------------------
  // EDIT BUTTON
  // -----------------------------

  const startEdit = (job) => {
    setEditingJobId(job._id);

    setJobForm({
      company: job.company,
      position: job.position,
      status: job.status,
    });

    setShowForm(true);
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setJobs([]);
  };

  // -----------------------------
  // STATISTICS
  // -----------------------------

  const appliedCount = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interviewCount = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const offerCount = jobs.filter(
    (job) => job.status === "Offer"
  ).length;

  const rejectedCount = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  // -----------------------------
  // LOGIN / REGISTER SCREEN
  // -----------------------------

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">

          <h1>JobTrack</h1>

          <p className="subtitle">
            Track your job applications in one place.
          </p>

          <div className="auth-card">

            <div className="tabs">
              <button
                className={!isRegister ? "active-tab" : ""}
                onClick={() => {
                  setIsRegister(false);
                  setMessage("");
                }}
              >
                Login
              </button>

              <button
                className={isRegister ? "active-tab" : ""}
                onClick={() => {
                  setIsRegister(true);
                  setMessage("");
                }}
              >
                Register
              </button>
            </div>

            {message && (
              <div className="message">
                {message}
              </div>
            )}

            {!isRegister ? (
              <form onSubmit={handleLogin}>

                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <button
                  className="primary-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <p className="switch-text">
                  Don't have an account?{" "}
                  <span onClick={() => setIsRegister(true)}>
                    Register
                  </span>
                </p>

              </form>
            ) : (
              <form onSubmit={handleRegister}>

                <label>Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <button
                  className="primary-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>

                <p className="switch-text">
                  Already have an account?{" "}
                  <span onClick={() => setIsRegister(false)}>
                    Login
                  </span>
                </p>

              </form>
            )}

          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // DASHBOARD
  // -----------------------------

  return (
    <div className="dashboard-page">

      <header className="navbar">
        <h2>JobTrack</h2>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard-container">

        <div className="dashboard-heading">

          <div>
            <h1>Dashboard</h1>
            <p>
              Track and manage your job applications.
            </p>
          </div>

          <button
            className="primary-button add-button"
            onClick={() => {
              setEditingJobId(null);

              setJobForm({
                company: "",
                position: "",
                status: "Applied",
              });

              setShowForm(true);
            }}
          >
            + Add Job
          </button>

        </div>

        {message && (
          <div className="message error-message">
            {message}
          </div>
        )}

        {/* ADD / EDIT FORM */}

        {showForm && (
          <div className="job-form-card">

            <h2>
              {editingJobId ? "Edit Job" : "Add Job"}
            </h2>

            <form
              onSubmit={
                editingJobId
                  ? handleUpdateJob
                  : handleAddJob
              }
            >

              <div className="form-row">

                <div>
                  <label>Company</label>

                  <input
                    type="text"
                    placeholder="Company name"
                    value={jobForm.company}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        company: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label>Position</label>

                  <input
                    type="text"
                    placeholder="Job position"
                    value={jobForm.position}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        position: e.target.value,
                      })
                    }
                    required
                  />
                </div>

              </div>

              <label>Status</label>

              <select
                value={jobForm.status}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    status: e.target.value,
                  })
                }
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>

              <div className="form-buttons">

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingJobId
                    ? "Update Job"
                    : "Add Job"}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* STATISTICS */}

        <div className="stats-grid">

          <div className="stat-card">
            <span>Total Applications</span>
            <strong>{jobs.length}</strong>
          </div>

          <div className="stat-card">
            <span>Applied</span>
            <strong>{appliedCount}</strong>
          </div>

          <div className="stat-card">
            <span>Interviews</span>
            <strong>{interviewCount}</strong>
          </div>

          <div className="stat-card">
            <span>Offers</span>
            <strong>{offerCount}</strong>
          </div>

          <div className="stat-card">
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>

        </div>

        {/* JOB LIST */}

        <div className="applications-card">

          <h2>My Applications</h2>

          <p className="application-count">
            {jobs.length} application
            {jobs.length !== 1 ? "s" : ""}
          </p>

          {jobs.length === 0 ? (
            <div className="empty-state">

              <h3>No applications yet</h3>

              <p>
                Add your first job application to start
                tracking.
              </p>

            </div>
          ) : (
            <div className="job-list">

              {jobs.map((job) => (
                <div
                  className="job-card"
                  key={job._id}
                >

                  <div className="job-info">

                    <h3>{job.position}</h3>

                    <p>{job.company}</p>

                    <span
                      className={`status ${job.status.toLowerCase()}`}
                    >
                      {job.status}
                    </span>

                  </div>

                  <div className="job-actions">

                    <button
                      className="edit-button"
                      onClick={() => startEdit(job)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteJob(job._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default App;