import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";

const EditProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingProject, setFetchingProject] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    estimatedTime: "",
    totalCost: 0,
    tags: "",
    materials: [{ name: "", quantity: "", estimatedCost: 0 }],
    tools: [{ name: "", required: true }],
    steps: [{ stepNumber: 1, title: "", description: "", imageUrl: "" }],
    images: [{ url: "", isMainImage: true, caption: "" }],
    isPublished: true,
<<<<<<< HEAD
    isFeatured: false,
  });
=======
    isFeatured: false,  });
>>>>>>> 360e473c2e640a4a356de71de506bfd95c3e0647

  // Stabilize authentication data to prevent unnecessary re-renders
  const authData = useMemo(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  }, []); // Empty dependency array means this only runs once

  // API base URL
  const API_BASE = "http://localhost:5000/api";
  // Fetch project data on component mount
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !authData.token || !authData.user) {
        setFetchingProject(false);
        return;
      }

      try {
        setFetchingProject(true);
        setError("");

        const authHeaders = {
          headers: { Authorization: `Bearer ${authData.token}` },
        };

        const response = await axios.get(
          `${API_BASE}/projects/${projectId}`,
          authHeaders
        );

        const project = response.data;

        // Check if user is the author
        if (project.author._id !== authData.user.id) {
          setError("You are not authorized to edit this project.");
          setFetchingProject(false);
          return;
        }

        // Populate form with existing data
        setFormData({
          title: project.title || "",
          description: project.description || "",
          category: project.category || "",
          difficulty: project.difficulty || "Beginner",
          estimatedTime: project.estimatedTime || "",
          totalCost: project.totalCost || 0,
          tags: project.tags ? project.tags.join(", ") : "",
          materials:
            project.materials && project.materials.length > 0
              ? project.materials
              : [{ name: "", quantity: "", estimatedCost: 0 }],
          tools:
            project.tools && project.tools.length > 0
              ? project.tools
              : [{ name: "", required: true }],
          steps:
            project.steps && project.steps.length > 0
              ? project.steps
              : [{ stepNumber: 1, title: "", description: "", imageUrl: "" }],
          images:
            project.images && project.images.length > 0
              ? project.images
              : [{ url: "", isMainImage: true, caption: "" }],
<<<<<<< HEAD
          isPublished:
            project.isPublished !== undefined ? project.isPublished : true,
          isFeatured:
            project.isFeatured !== undefined ? project.isFeatured : false,
=======
          isPublished: project.isPublished !== undefined ? project.isPublished : true,
          isFeatured: project.isFeatured !== undefined ? project.isFeatured : false,
>>>>>>> 360e473c2e640a4a356de71de506bfd95c3e0647
        });
      } catch (err) {
        console.error("Fetch project error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load project. Please try again."
        );
      } finally {
        setFetchingProject(false);
<<<<<<< HEAD
      }
    };
=======
      }    };
>>>>>>> 360e473c2e640a4a356de71de506bfd95c3e0647

    fetchProject();
  }, [projectId, authData.token, authData.user?.id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayInputChange = (arrayName, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (arrayName, template) => {
    setFormData((prev) => {
      const newItem = { ...template };

      // Auto-increment stepNumber for steps
      if (arrayName === "steps") {
        newItem.stepNumber = prev[arrayName].length + 1;
      }

      return {
        ...prev,
        [arrayName]: [...prev[arrayName], newItem],
      };
    });
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData((prev) => {
      const newArray = prev[arrayName].filter((_, i) => i !== index);

      // Re-number steps after removal
      if (arrayName === "steps") {
        newArray.forEach((step, i) => {
          step.stepNumber = i + 1;
        });
      }

      return {
        ...prev,
        [arrayName]: newArray,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Process tags (convert string to array)
      const processedData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        totalCost: parseFloat(formData.totalCost) || 0,
      };

      console.log(
        "Updating project data:",
        JSON.stringify(processedData, null, 2)
<<<<<<< HEAD
      );
      const authHeaders = {
=======
      );      const authHeaders = {
>>>>>>> 360e473c2e640a4a356de71de506bfd95c3e0647
        headers: { Authorization: `Bearer ${authData.token}` },
      };

      await axios.put(
        `${API_BASE}/projects/${projectId}`,
        processedData,
        authHeaders
      );

      setSuccess(true);
      setTimeout(() => {
        navigate(`/project/${projectId}`);
      }, 2000);
    } catch (err) {
      console.error("Update project error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Woodworking",
    "Electronics",
    "Crafts & Arts",
    "Home Decor",
    "Jewelry Making",
    "Gardening",
    "Cooking & Baking",
    "Sewing & Textiles",
    "Automotive",
    "3D Printing",
    "Metalworking",
    "Photography",
    "Other",
  ];
  // Check if user is authenticated
  if (!authData.token || !authData.user) {
    return (
      <div className="create-project-container">
        <div className="auth-required">
          <div className="auth-required-content">
            <h2>Sign In Required</h2>
            <p>You need to be signed in to edit projects.</p>
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
      </div>
    );
  }

  if (fetchingProject) {
    return (
      <div className="create-project-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="create-project-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/feed" className="btn btn-primary">
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="create-project-container">
        <div className="success-message">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Project Updated Successfully!</h2>
            <p>Your DIY project has been updated.</p>
            <p>Redirecting to your project...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-project-container">
      {/* Header */}
      <header className="create-header">
        <div className="container">
          <div className="header-content">
            <Link to={`/project/${projectId}`} className="back-link">
              ← Back to Project
            </Link>
            <h1>Edit DIY Project</h1>
            <p>Update your project details!</p>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="create-main">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="create-form">
            {/* Basic Information */}
            <section className="form-section">
              <h2 className="section-title">📝 Basic Information</h2>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Handmade Wooden Coffee Table"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Describe your project, what inspired you, and what makes it special..."
                  rows="5"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty" className="form-label">
                    Difficulty Level *
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="estimatedTime" className="form-label">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    id="estimatedTime"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 2-3 hours, 1 weekend"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="totalCost" className="form-label">
                    Estimated Cost ($)
                  </label>
                  <input
                    type="number"
                    id="totalCost"
                    name="totalCost"
                    value={formData.totalCost}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tags" className="form-label">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="wooden, handmade, furniture, beginner (separate with commas)"
                />
                <small className="form-help">
                  Add tags to help others find your project (separate with
                  commas)
                </small>
              </div>
            </section>

            {/* Images */}
            <section className="form-section">
              <h2 className="section-title">📸 Project Images</h2>
              {formData.images.map((image, index) => (
                <div key={index} className="image-item">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Image URL {index === 0 ? "(Main Image) *" : ""}
                      </label>
                      <input
                        type="url"
                        value={image.url}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "images",
                            index,
                            "url",
                            e.target.value
                          )
                        }
                        className="form-input"
                        placeholder="https://example.com/image.jpg"
                        required={index === 0}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Caption</label>
                      <input
                        type="text"
                        value={image.caption}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "images",
                            index,
                            "caption",
                            e.target.value
                          )
                        }
                        className="form-input"
                        placeholder="Describe this image..."
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("images", index)}
                      className="remove-btn"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  addArrayItem("images", {
                    url: "",
                    isMainImage: false,
                    caption: "",
                  })
                }
                className="add-btn"
              >
                + Add Another Image
              </button>
            </section>

            {/* Materials */}
            <section className="form-section">
              <h2 className="section-title">🔧 Materials Needed</h2>
              {formData.materials.map((material, index) => (
                <div key={index} className="material-item">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Material Name *</label>
                      <input
                        type="text"
                        value={material.name}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "materials",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className="form-input"
                        placeholder="e.g., Wood glue"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity</label>
                      <input
                        type="text"
                        value={material.quantity}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "materials",
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="form-input"
                        placeholder="e.g., 1 bottle, 2 pieces"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estimated Cost ($)</label>
                    <input
                      type="number"
                      value={material.estimatedCost}
                      onChange={(e) =>
                        handleArrayInputChange(
                          "materials",
                          index,
                          "estimatedCost",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {formData.materials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("materials", index)}
                      className="remove-btn"
                    >
                      Remove Material
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  addArrayItem("materials", {
                    name: "",
                    quantity: "",
                    estimatedCost: 0,
                  })
                }
                className="add-btn"
              >
                + Add Material
              </button>
            </section>

            {/* Tools */}
            <section className="form-section">
              <h2 className="section-title">⚒️ Tools Required</h2>
              {formData.tools.map((tool, index) => (
                <div key={index} className="tool-item">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Tool Name *</label>
                      <input
                        type="text"
                        value={tool.name}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "tools",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className="form-input"
                        placeholder="e.g., Drill, Screwdriver"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={tool.required}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "tools",
                              index,
                              "required",
                              e.target.checked
                            )
                          }
                        />
                        <span className="checkbox-text">Required Tool</span>
                      </label>
                    </div>
                  </div>
                  {formData.tools.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("tools", index)}
                      className="remove-btn"
                    >
                      Remove Tool
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  addArrayItem("tools", { name: "", required: true })
                }
                className="add-btn"
              >
                + Add Tool
              </button>
            </section>

            {/* Steps */}
            <section className="form-section">
              <h2 className="section-title">📋 Step-by-Step Instructions</h2>
              {formData.steps.map((step, index) => (
                <div key={index} className="step-item">
                  <h3 className="step-number">Step {index + 1}</h3>
                  <div className="form-group">
                    <label className="form-label">Step Title *</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        handleArrayInputChange(
                          "steps",
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="form-input"
                      placeholder="e.g., Cut the wood pieces"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Instructions *</label>
                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        handleArrayInputChange(
                          "steps",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="form-textarea"
                      placeholder="Provide detailed instructions for this step..."
                      rows="4"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Step Image URL</label>
                    <input
                      type="url"
                      value={step.imageUrl}
                      onChange={(e) =>
                        handleArrayInputChange(
                          "steps",
                          index,
                          "imageUrl",
                          e.target.value
                        )
                      }
                      className="form-input"
                      placeholder="https://example.com/step-image.jpg"
                    />
                  </div>
                  {formData.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("steps", index)}
                      className="remove-btn"
                    >
                      Remove Step
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  addArrayItem("steps", {
                    title: "",
                    description: "",
                    imageUrl: "",
                  })
                }
                className="add-btn"
              >
                + Add Step
              </button>
            </section>

            {/* Publishing Options */}
            <section className="form-section">
              <h2 className="section-title">🚀 Publishing Options</h2>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-text">
                    Publish immediately (make visible to everyone)
                  </span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-text">
                    Submit for featuring (community showcase)
                  </span>
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(`/project/${projectId}`)}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading"></span>
                    Updating Project...
                  </>
                ) : (
                  "Update Project"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProject;
