import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Feed = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    difficulty: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [stats, setStats] = useState(null);

  // Get authentication token
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // API base URL
  const API_BASE = "http://localhost:5000/api";

  // Headers for authenticated requests
  const authHeaders = {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
    fetchStats();
  }, [filters, pagination.currentPage]);

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...filters,
      });
      const response = await axios.get(
        `${API_BASE}/projects?${params}`,
        authHeaders
      );
      console.log("Fetched projects:", response);
      console.log("Response data:", response.data);
      console.log("Projects array:", response.data.projects);
      console.log("Full URL:", `${API_BASE}/projects?${params}`);

      setProjects(response.data.projects || []);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalProjects: response.data.totalProjects,
        hasNextPage: response.data.hasNextPage,
        hasPrevPage: response.data.hasPrevPage,
      });
    } catch (err) {
      setError("Failed to load projects. Please try again.");
      console.error("Fetch projects error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/projects/categories/list`);
      setCategories(response.data);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/projects/stats/overview`);
      setStats(response.data);
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects(1);
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

      setProjects((prev) =>
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

      setProjects((prev) =>
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
            </div>{" "}
            <nav className="nav-links">
              <Link to="/feed" className="nav-link active">
                Feed
              </Link>
              <Link to="/create" className="nav-link">
                Create Project
              </Link>
              {user ? (
                <div className="user-menu">
                  <span className="user-greeting">Hello, {user.username}!</span>
                  <Link to="/saved" className="nav-link">
                    Saved
                  </Link>
                  <Link to={`/profile/${user.id}`} className="nav-link">
                    Profile
                  </Link>
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

      {/* Stats Banner */}
      {stats && (
        <div className="stats-banner">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{stats.totalProjects}</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.totalUsers}</div>
                <div className="stat-label">Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.recentProjects}</div>
                <div className="stat-label">This Month</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-content">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-group">
                <input
                  type="text"
                  placeholder="Search projects, materials, or categories..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  🔍
                </button>
              </div>
            </form>

            {/* Filter Controls */}
            <div className="filter-controls">
              <div className="filter-group">
                <label className="filter-label">Category:</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Difficulty:</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) =>
                    handleFilterChange("difficulty", e.target.value)
                  }
                  className="filter-select"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort by:</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="filter-select"
                >
                  <option value="createdAt">Newest</option>
                  <option value="likes">Most Liked</option>
                  <option value="views">Most Viewed</option>
                  <option value="totalCost">Cost</option>
                </select>
              </div>
            </div>
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
              <p className="loading-text">Loading amazing projects...</p>
            </div>
          ) : (
            <>
              {/* Projects Grid */}
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project._id} className="project-card">
                    {" "}
                    <div className="project-image">
                      <img
                        src={
                          project.images.find((img) => img.isMainImage)?.url ||
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
                          <span>{project.views}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-icon">💬</span>
                          <span>{project.commentCount}</span>
                        </div>
                      </div>{" "}
                      <div className="project-author">
                        <span className="author-text">
                          by{" "}
                          <Link
                            to={`/profile/${project.author._id}`}
                            className="author-link"
                          >
                            <strong>{project.author.username}</strong>
                          </Link>
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
                          {project.isLiked ? "❤️" : "🤍"} {project.likeCount}
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => fetchProjects(pagination.currentPage - 1)}
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
                    onClick={() => fetchProjects(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}

              {projects.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No projects found</h3>
                  <p>Try adjusting your filters or search terms.</p>
                  <Link to="/create" className="btn btn-primary">
                    Create First Project
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

export default Feed;
