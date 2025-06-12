import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const API_BASE = "http://localhost:5000/api";

  const authHeaders = {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/projects/${id}`,
        authHeaders
      );
      setProject(response.data);
    } catch (err) {
      setError("Failed to load project. Please try again.");
      console.error("Fetch project error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!token) {
      alert("Please sign in to like projects!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/projects/${id}/like`,
        {},
        authHeaders
      );

      setProject((prev) => ({
        ...prev,
        isLiked: response.data.liked,
        likeCount: response.data.likeCount,
      }));
    } catch (err) {
      console.error("Like error:", err);
      alert("Failed to like project. Please try again.");
    }
  };
  const handleSave = async () => {
    if (!token) {
      alert("Please sign in to save projects!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/projects/${id}/save`,
        {},
        authHeaders
      );

      setProject((prev) => ({
        ...prev,
        isSaved: response.data.saved,
      }));
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save project. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/projects/${id}`, authHeaders);
      alert("Project deleted successfully!");
      navigate("/feed");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please sign in to comment!");
      return;
    }

    if (!newComment.trim()) return;

    try {
      setAddingComment(true);
      const response = await axios.post(
        `${API_BASE}/projects/${id}/comments`,
        { text: newComment },
        authHeaders
      );

      setProject((prev) => ({
        ...prev,
        comments: [...prev.comments, response.data],
        commentCount: prev.commentCount + 1,
      }));

      setNewComment("");
    } catch (err) {
      console.error("Add comment error:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setAddingComment(false);
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

  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-container">
        <div className="error-container">
          <h2>Project Not Found</h2>
          <p>{error || "The project you're looking for doesn't exist."}</p>
          <Link to="/feed" className="btn btn-primary">
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      {/* Header */}
      <header className="project-header">
        <div className="container">
          <div className="header-nav">
            <Link to="/feed" className="back-btn">
              ← Back to Feed
            </Link>{" "}
            <div className="header-actions">
              {project.isAuthor ? (
                <>
                  <Link
                    to={`/edit/${project._id}`}
                    className="action-btn edit-btn"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="action-btn delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLike}
                    className={`action-btn ${project.isLiked ? "liked" : ""}`}
                  >
                    {project.isLiked ? "❤️" : "🤍"} {project.likeCount}
                  </button>
                  <button
                    onClick={handleSave}
                    className={`action-btn ${project.isSaved ? "saved" : ""}`}
                  >
                    {project.isSaved ? "🔖" : "📌"} Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Project Content */}
      <main className="project-main">
        <div className="container">
          {/* Hero Section */}
          <section className="project-hero">
            <div className="project-image-container">
              <img
                src={
                  project.images.find((img) => img.isMainImage)?.url ||
                  project.images[0]?.url ||
                  "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800"
                }
                alt={project.title}
                className="project-main-image"
              />
              <div className="project-badges">
                <span
                  className="difficulty-badge"
                  style={{
                    backgroundColor: getDifficultyColor(project.difficulty),
                  }}
                >
                  {project.difficulty}
                </span>
                {project.isFeatured && (
                  <span className="featured-badge">⭐ Featured</span>
                )}
              </div>
            </div>

            <div className="project-info">
              <h1 className="project-title">{project.title}</h1>{" "}
              <div className="project-meta">
                <span className="category">{project.category}</span>
                <span className="author">
                  by{" "}
                  <Link
                    to={`/profile/${project.author._id}`}
                    className="author-link"
                  >
                    <strong>{project.author.username}</strong>
                  </Link>
                </span>
                <span className="date">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-stats">
                <div className="stat">
                  <span className="stat-label">Estimated Time:</span>
                  <span className="stat-value">⏱️ {project.estimatedTime}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total Cost:</span>
                  <span className="stat-value">
                    💰 {formatCost(project.totalCost)}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Views:</span>
                  <span className="stat-value">👁️ {project.views}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Rating:</span>
                  <span className="stat-value">
                    ⭐ {project.averageRating || "No ratings yet"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Materials & Tools */}
          <section className="materials-tools-section">
            <div className="section-grid">
              <div className="materials-section">
                <h2 className="section-title">Materials Needed</h2>
                <ul className="materials-list">
                  {project.materials.map((material, index) => (
                    <li key={index} className="material-item">
                      <span className="material-name">{material.name}</span>
                      <span className="material-quantity">
                        {material.quantity}
                      </span>
                      {material.estimatedCost > 0 && (
                        <span className="material-cost">
                          ${material.estimatedCost}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="tools-section">
                <h2 className="section-title">Tools Required</h2>
                <ul className="tools-list">
                  {project.tools.map((tool, index) => (
                    <li key={index} className="tool-item">
                      <span className="tool-name">{tool.name}</span>
                      <span
                        className={`tool-required ${
                          tool.required ? "required" : "optional"
                        }`}
                      >
                        {tool.required ? "Required" : "Optional"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Steps */}
          <section className="steps-section">
            <h2 className="section-title">Step-by-Step Instructions</h2>
            <div className="steps-list">
              {project.steps.map((step) => (
                <div key={step.stepNumber} className="step-item">
                  <div className="step-number">{step.stepNumber}</div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                    {step.tips && step.tips.length > 0 && (
                      <div className="step-tips">
                        <h4>💡 Tips:</h4>
                        <ul>
                          {step.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Comments */}
          <section className="comments-section">
            <h2 className="section-title">Comments ({project.commentCount})</h2>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="add-comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this project..."
                  className="comment-textarea"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={addingComment || !newComment.trim()}
                  className="btn btn-primary"
                >
                  {addingComment ? "Adding..." : "Add Comment"}
                </button>
              </form>
            ) : (
              <div className="comment-login-prompt">
                <p>
                  <Link to="/login">Sign in</Link> to join the conversation!
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
              {project.comments.length === 0 ? (
                <p className="no-comments">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                project.comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-author">
                      <strong>{comment.user.username}</strong>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
