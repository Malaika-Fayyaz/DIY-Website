import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const API_BASE = "http://localhost:5000/api";

  const authHeaders = {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };

  // If no userId provided and user is logged in, redirect to their own profile
  useEffect(() => {
    if (!userId && currentUser) {
      navigate(`/profile/${currentUser.id}`);
    }
  }, [userId, currentUser, navigate]);

  useEffect(() => {
    if (userId) {
      fetchProfileData();
      fetchUserProjects();
    }
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/projects/profile/${userId}`,
        authHeaders
      );
      setProfileData(response.data);
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async (page = 1) => {
    try {
      setProjectsLoading(true);
      const response = await axios.get(
        `${API_BASE}/projects/user/${userId}?page=${page}&limit=12`,
        authHeaders
      );
      setUserProjects(response.data.projects || []);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalProjects: response.data.totalProjects,
        hasNextPage: response.data.hasNextPage,
        hasPrevPage: response.data.hasPrevPage,
      });
    } catch (err) {
      console.error("Fetch user projects error:", err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleLike = async (projectId) => {
    if (!token) {
      alert("Please sign in to like projects!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/projects/${projectId}/like`,
        {},
        authHeaders
      );

      setUserProjects((prev) =>
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
  const handleSave = async (projectId) => {
    if (!token) {
      alert("Please sign in to save projects!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/projects/${projectId}/save`,
        {},
        authHeaders
      );

      setUserProjects((prev) =>
        prev.map((project) =>
          project._id === projectId
            ? { ...project, isSaved: response.data.saved }
            : project
        )
      );
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save project. Please try again.");
    }
  };

  const handleDelete = async (projectId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/projects/${projectId}`, authHeaders);

      // Remove the project from the list
      setUserProjects((prev) =>
        prev.filter((project) => project._id !== projectId)
      );

      // Update pagination stats
      setPagination((prev) => ({
        ...prev,
        totalProjects: prev.totalProjects - 1,
      }));

      // Update profile stats
      if (profileData) {
        setProfileData((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            totalProjects: prev.stats.totalProjects - 1,
          },
        }));
      }

      alert("Project deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete project. Please try again.");
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!userId && !currentUser) {
    return (
      <div className="auth-required">
        <div className="auth-required-content">
          <div className="diy-icon">👤</div>
          <h2>Sign In Required</h2>
          <p>Please sign in to view profiles.</p>
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

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <h2>Profile Not Found</h2>
          <p>{error || "The profile you're looking for doesn't exist."}</p>
          <Link to="/feed" className="btn btn-primary">
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
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
              {currentUser && (
                <>
                  <Link to="/saved" className="nav-link">
                    Saved
                  </Link>
                  <Link
                    to={`/profile/${currentUser.id}`}
                    className={`nav-link ${
                      profileData.user.isOwnProfile ? "active" : ""
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
              {currentUser ? (
                <div className="user-menu">
                  <span className="user-greeting">
                    Hello, {currentUser.username}!
                  </span>
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
              ) : (
                <div className="auth-links">
                  <Link to="/login" className="btn btn-outline">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Join Now
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="container">
          <div className="profile-header-content">
            <Link to="/feed" className="back-link">
              ← Back to Feed
            </Link>
            <div className="profile-info">
              <div className="profile-avatar">
                <span className="avatar-icon">👤</span>
              </div>
              <div className="profile-details">
                <h1 className="profile-username">
                  {profileData.user.username}
                </h1>
                <p className="profile-joined">
                  Member since {formatDate(profileData.user.createdAt)}
                </p>
                {profileData.user.isOwnProfile && (
                  <p className="profile-email">{profileData.user.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="profile-stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">
                {profileData.stats.totalProjects}
              </div>
              <div className="stat-label">Projects Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{profileData.stats.totalLikes}</div>
              <div className="stat-label">Total Likes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{profileData.stats.totalViews}</div>
              <div className="stat-label">Total Views</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {profileData.stats.totalComments}
              </div>
              <div className="stat-label">Comments Received</div>
            </div>
            {profileData.user.isOwnProfile && (
              <div className="stat-card">
                <div className="stat-number">
                  {profileData.stats.savedProjectsCount}
                </div>
                <div className="stat-label">Saved Projects</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <main className="profile-main">
        <div className="container">
          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              All Projects ({profileData.stats.totalProjects})
            </button>
            <button
              className={`tab-btn ${activeTab === "recent" ? "active" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Recent Projects
            </button>
            <button
              className={`tab-btn ${
                activeTab === "categories" ? "active" : ""
              }`}
              onClick={() => setActiveTab("categories")}
            >
              Categories
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "projects" && (
            <div className="tab-content">
              {projectsLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading projects...</p>
                </div>
              ) : userProjects.length > 0 ? (
                <>
                  <div className="projects-grid">
                    {userProjects.map((project) => (
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
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400";
                            }}
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
                                ⏱️ {project.estimatedTime}
                              </span>
                              <span className="project-cost">
                                💰 {formatCost(project.totalCost)}
                              </span>
                            </div>
                          </div>
                          <p className="project-description">
                            {project.description}
                          </p>
                          <div className="project-stats">
                            <div className="stat-item">
                              <span>
                                ❤️{" "}
                                {project.likeCount ||
                                  project.likes?.length ||
                                  0}
                              </span>
                            </div>
                            <div className="stat-item">
                              <span>
                                💬{" "}
                                {project.commentCount ||
                                  project.comments?.length ||
                                  0}
                              </span>
                            </div>
                            <div className="stat-item">
                              <span>👁️ {project.views || 0}</span>
                            </div>
                          </div>{" "}
                          <div className="project-actions">
                            {profileData.user.isOwnProfile ? (
                              <>
                                <Link
                                  to={`/edit/${project._id}`}
                                  className="action-btn edit-btn"
                                >
                                  ✏️ Edit
                                </Link>
                                <button
                                  onClick={() => handleDelete(project._id)}
                                  className="action-btn delete-btn"
                                >
                                  🗑️ Delete
                                </button>
                                <Link
                                  to={`/project/${project._id}`}
                                  className="btn btn-primary btn-small"
                                >
                                  View Project
                                </Link>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleLike(project._id)}
                                  className={`action-btn ${
                                    project.isLiked ? "liked" : ""
                                  }`}
                                >
                                  {project.isLiked ? "❤️" : "🤍"} Like
                                </button>
                                <button
                                  onClick={() => handleSave(project._id)}
                                  className={`action-btn ${
                                    project.isSaved ? "saved" : ""
                                  }`}
                                >
                                  {project.isSaved ? "🔖" : "📌"} Save
                                </button>
                                <Link
                                  to={`/project/${project._id}`}
                                  className="btn btn-primary btn-small"
                                >
                                  View Project
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() =>
                          fetchUserProjects(pagination.currentPage - 1)
                        }
                        disabled={!pagination.hasPrevPage}
                        className="pagination-btn"
                      >
                        ← Previous
                      </button>

                      <div className="pagination-info">
                        Page {pagination.currentPage} of {pagination.totalPages}
                        <span className="pagination-total">
                          ({pagination.totalProjects} projects)
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          fetchUserProjects(pagination.currentPage + 1)
                        }
                        disabled={!pagination.hasNextPage}
                        className="pagination-btn"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📁</div>
                  <h3>No projects yet</h3>
                  <p>
                    {profileData.user.isOwnProfile
                      ? "You haven't created any projects yet. Start sharing your creativity!"
                      : `${profileData.user.username} hasn't shared any projects yet.`}
                  </p>
                  {profileData.user.isOwnProfile && (
                    <Link to="/create" className="btn btn-primary">
                      Create Your First Project
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "recent" && (
            <div className="tab-content">
              {profileData.recentProjects.length > 0 ? (
                <div className="projects-grid">
                  {profileData.recentProjects.map((project) => (
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
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400";
                          }}
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
                            <span className="featured-badge">⭐ Featured</span>
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
                            <span className="project-date">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="project-description">
                          {project.description}
                        </p>

                        <div className="project-stats">
                          <div className="stat-item">
                            <span>
                              ❤️{" "}
                              {project.likeCount || project.likes?.length || 0}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span>
                              💬{" "}
                              {project.commentCount ||
                                project.comments?.length ||
                                0}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span>👁️ {project.views || 0}</span>
                          </div>
                        </div>

                        <div className="project-actions">
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
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>No recent projects</h3>
                  <p>No projects created recently.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "categories" && (
            <div className="tab-content">
              {profileData.categoryStats.length > 0 ? (
                <div className="categories-stats">
                  <h3>Project Categories</h3>
                  <div className="category-list">
                    {profileData.categoryStats.map((category) => (
                      <div key={category._id} className="category-stat-item">
                        <div className="category-info">
                          <span className="category-name">{category._id}</span>
                          <span className="category-count">
                            {category.count} projects
                          </span>
                        </div>
                        <div className="category-bar">
                          <div
                            className="category-fill"
                            style={{
                              width: `${
                                (category.count /
                                  profileData.stats.totalProjects) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>No category data</h3>
                  <p>No projects to analyze yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
