import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../ThemeProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./master_admin.css";

const AdminBlogSection = () => {
  const { theme } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    longDesc: "",
    banner: "",
    dateTime: "",
  });
  const [editId, setEditId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const formRef = useRef(null);
  const API_URL = "http://localhost:5000/blogs";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, banner: url }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogData = {
      ...formData,
      dateTime: new Date().toLocaleString(),
    };

    if (editId) {
      fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      })
        .then((res) => res.json())
        .then((updated) => {
          const updatedList = blogs.map((b) => (b.id === editId ? updated : b));
          setBlogs(updatedList);
          setEditId(null);
          toast.info("Blog updated!");
          resetForm();
          setShowForm(false);
        });
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      })
        .then((res) => res.json())
        .then((newBlog) => {
          setBlogs([...blogs, newBlog]);
          toast.success("Blog published successfully!");
          resetForm();
          setShowForm(false);
        });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      shortDesc: "",
      longDesc: "",
      banner: "",
      dateTime: "",
    });
  };

  const handleEdit = (blog) => {
    setFormData(blog);
    setEditId(blog.id);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDelete = (id) => {
    const ConfirmToast = () => (
      <div>
        <p>Are you sure you want to delete this blog?</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => {
              fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => {
                setBlogs((prev) => prev.filter((b) => b.id !== id));
                toast.dismiss();
                toast.error("Blog deleted.");
              });
            }}
            className="btn btn-secondary"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              toast.info("Deletion cancelled.");
            }}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );

    toast(<ConfirmToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    });
  };

  return (
    <div className={`dashboard-main ${theme}`}>
      <ToastContainer position="top-center" autoClose={3000} />
      <h1>Admin Blog Section</h1>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Blog Form" : "Add Blog"}
      </button>

      <div
        ref={formRef}
        style={{
          maxHeight: showForm ? "2000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s ease-in-out",
        }}
      >
        {showForm && (
          <form onSubmit={handleSubmit} className="card" style={{ marginTop: "20px" }}>
            <label>Blog Title</label>
            <input
              name="title"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <label>Short Description</label>
            <input
              name="shortDesc"
              placeholder="Enter short description"
              value={formData.shortDesc}
              onChange={handleChange}
              required
            />
            <label>Long Description</label>
            <textarea
              name="longDesc"
              placeholder="Enter full blog content"
              value={formData.longDesc}
              onChange={handleChange}
              rows={6}
              required
            />
            <label>Banner Image</label>
            <input type="file" accept="image/*" onChange={handleBannerUpload} required={!formData.banner} />
            {formData.banner && (
              <img
                src={formData.banner}
                alt="banner-preview"
                style={{ maxHeight: "150px", marginTop: "10px" }}
              />
            )}
            <div className="center-btn">
              <button type="submit" className="btn">
                {editId ? "Update Blog" : "Publish Blog"}
              </button>
            </div>
          </form>
        )}
      </div>

      <h2 style={{ marginTop: "30px" }}>Published Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blog posts yet.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((b) => (
            <div key={b.id} className="card blog-card">
              <img src={b.banner} alt="banner" style={{ height: "100px", objectFit: "cover", width: "100%" }} />
              <h3>{b.title}</h3>
              <p><strong>{b.dateTime}</strong></p>
              <p><em>{b.shortDesc}</em></p>
              <div className="center-btn">
                <center><button className="btn btn-primary" onClick={() => setSelectedBlog(b)}>View Details</button></center>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {selectedBlog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedBlog.title}</h2>
            
            <img src={selectedBlog.banner} alt="blog" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
            <p><strong>{selectedBlog.dateTime}</strong></p>
            <p><em>{selectedBlog.shortDesc}</em></p>
            <p>{selectedBlog.longDesc}</p>
            <div className="center-btn" style={{ marginTop: "20px" }}>
              <center><button className="btn btn-secondary" onClick={() => setSelectedBlog(null)}>Close</button></center>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogSection;
