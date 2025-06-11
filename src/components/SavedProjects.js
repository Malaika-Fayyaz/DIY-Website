import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SavedProjects = () => {
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API base URL
  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    console.log("SavedProjects mounted");
    // Get authentication token and user inside useEffect to avoid re-renders
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
      fetchSavedProjects(token);
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array to run only once on mount
  const fetchSavedProjects = async (token) => {
    try {
      setLoading(true);
      const authHeaders = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
      const response = await axios.get(
        `${API_BASE}/projects/saved/list`,
        authHeaders
      );
      setSavedProjects(response.data);
    } catch (err) {
      setError("Failed to load saved projects. Please try again.");
      console.error("Fetch saved projects error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleUnsave = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const authHeaders = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      await axios.post(
        `${API_BASE}/projects/${projectId}/save`,
        {},
        authHeaders
      );

      // Remove the project from the saved list
      setSavedProjects((prev) =>
        prev.filter((project) => project._id !== projectId)
      );
    } catch (err) {
      console.error("Unsave error:", err);
      alert("Failed to remove project from saved. Please try again.");
    }
  };
  const handleLike = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const authHeaders = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      const response = await axios.post(
        `${API_BASE}/projects/${projectId}/like`,
        {},
        authHeaders
      );

      setSavedProjects((prev) =>
        prev.map((project) =>
          project._id === projectId
            ? {
                ...project,
                isLiked: response.data.liked,
                likeCount: response.data.likeCount,
              }
            : project
        )
      );
    } catch (err) {
      console.error("Like error:", err);
      alert("Failed to like project. Please try again.");
    }
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const formatCost = (cost) => {
    return cost > 0 ? `$${cost}` : "Free";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#8CB369";
      case "Intermediate":
        return "#F4A259";
      case "Advanced":
        return "#BC4B51";
      default:
        return "#5B8E7D";
    }
  };

  // Check authentication status for rendering
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // If user is not authenticated, show auth required message
  if (!token || !user) {
    return (
      <div className="auth-required">
        <div className="auth-required-content">
          <div className="diy-icon">🔖</div>
          <h2>Sign In Required</h2>
          <p>Please sign in to view your saved projects.</p>
          <div className="auth-actions">
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {/* Header */}
      <header className="feed-header">
        <div className="container">
          <div className="header-content">
            <div className="brand">
              <Link to="/" className="brand-link">
                <span className="brand-icon">🛠️</span>
                <span className="brand-text">DIY Community</span>
              </Link>
            </div>
            <nav className="nav-links">
              <Link to="/feed" className="nav-link">
                Feed
              </Link>
              <Link to="/create" className="nav-link">
                Create Project
              </Link>
              <Link to="/saved" className="nav-link active">
                Saved
              </Link>
              <div className="user-menu">
                <span className="user-greeting">Hello, {user.username}!</span>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/";
                  }}
                  className="btn btn-outline"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="create-header">
        <div className="container">
          <div className="header-content">
            <Link to="/feed" className="back-link">
              ← Back to Feed
            </Link>
            <h1>🔖 My Saved Projects</h1>
            <p>Your collection of inspiring DIY projects</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="feed-main">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your saved projects...</p>
            </div>
          ) : (
            <>
              {savedProjects.length > 0 ? (
                <>
                  {/* Projects Count */}
                  <div className="saved-projects-header">
                    <h2 className="section-title">
                      You have {savedProjects.length} saved project
                      {savedProjects.length !== 1 ? "s" : ""}
                    </h2>
                  </div>

                  {/* Projects Grid */}
                  <div className="projects-grid">
                    {savedProjects.map((project) => (
                      <div key={project._id} className="project-card">
                        <div className="project-image">
                          <img
                            src={
                              project.images.find((img) => img.isMainImage)
                                ?.url ||
                              project.images[0]?.url ||
                              "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400"
                            }
                            alt={project.title}
                          />
                          <div className="project-badges">
                            <span
                              className="difficulty-badge"
                              style={{
                                backgroundColor: getDifficultyColor(
                                  project.difficulty
                                ),
                              }}
                            >
                              {project.difficulty}
                            </span>
                            {project.isFeatured && (
                              <span className="featured-badge">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="project-content">
                          <div className="project-header">
                            <h3 className="project-title">{project.title}</h3>
                            <div className="project-meta">
                              <span className="project-category">
                                {project.category}
                              </span>
                              <span className="project-time">
                                ⏱️ {formatTime(project.estimatedTime)}
                              </span>
                            </div>
                          </div>

                          <p className="project-description">
                            {project.description}
                          </p>

                          <div className="project-stats">
                            <div className="stat">
                              <span className="stat-icon">💰</span>
                              <span>{formatCost(project.totalCost)}</span>
                            </div>
                            <div className="stat">
                              <span className="stat-icon">👁️</span>
                              <span>{project.views || 0}</span>
                            </div>
                            <div className="stat">
                              <span className="stat-icon">💬</span>
                              <span>{project.commentCount || 0}</span>
                            </div>
                          </div>

                          <div className="project-author">
                            <span className="author-text">
                              by <strong>{project.author.username}</strong>
                            </span>
                            <span className="project-date">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="project-actions">
                            <button
                              onClick={() => handleLike(project._id)}
                              className={`action-btn ${
                                project.isLiked ? "liked" : ""
                              }`}
                            >
                              {project.isLiked ? "❤️" : "🤍"}{" "}
                              {project.likeCount || 0}
                            </button>
                            <button
                              onClick={() => handleUnsave(project._id)}
                              className="action-btn saved"
                              title="Remove from saved"
                            >
                              🗑️ Remove
                            </button>
                            <Link
                              to={`/project/${project._id}`}
                              className="btn btn-primary btn-small"
                            >
                              View Project
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔖</div>
                  <h3>No saved projects yet</h3>
                  <p>
                    Start exploring projects in the feed and save the ones that
                    inspire you!
                  </p>
                  <Link to="/feed" className="btn btn-primary">
                    Browse Projects
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedProjects;
