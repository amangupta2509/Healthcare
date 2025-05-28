import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../ThemeProvider";
import "./master_admin.css";

const roles = ["All", "doctor", "physio", "dietitian", "lab", "phlebotomist"];

const Toast = ({ message, type, onClose, onConfirm, onCancel }) => {
  if (!message) return null;

  return (
    <div className={`toast-message ${type}`} style={{ zIndex: 9999 }}>
      <i
        className={`fa ${
          type === "error"
            ? "fa-times-circle"
            : type === "success"
            ? "fa-check-circle"
            : "fa-question-circle"
        }`}
        style={{ marginRight: "8px" }}
      ></i>
      <span>{message}</span>

      {type === "confirm" ? (
        <div className="toast-actions">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>No</button>
          <button className="btn btn-primary btn-sm" onClick={onConfirm}>Yes</button>
        </div>
      ) : (
        <button className="close-toast" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

const UserManagement = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor",
  });
  const [editingUser, setEditingUser] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "", // success, error, confirm
    onConfirm: null,
    onCancel: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    setFormData(
      user
        ? { ...user, password: "" }
        : { name: "", email: "", password: "", role: "doctor" }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:3001/users/${editingUser.id}`,
          formData
        );
        showToast("User updated successfully", "success");
      } else {
        await axios.post("http://localhost:3001/users", formData);
        showToast("User added successfully", "success");
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      showToast("Error saving user", "error");
    }
  };

  const handleDelete = (id) => {
    setToast({
      message: "Are you sure you want to delete this user?",
      type: "confirm",
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:3001/users/${id}`);
          fetchUsers();
          showToast("User deleted successfully", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          showToast("Error deleting user", "error");
        }
      },
      onCancel: () => {
        showToast("User deletion cancelled", "info");
      },
    });
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type, onConfirm: null, onCancel: null });
    setTimeout(() => {
      setToast({ message: "", type: "", onConfirm: null, onCancel: null });
    }, 3000);
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      activeRole === "All" ||
      (typeof user.role === "string" &&
        user.role.toLowerCase() === activeRole.toLowerCase());

    return matchSearch && matchRole;
  });

  return (
    <div className={`dashboard-main ${theme}`}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ message: "", type: "", onConfirm: null, onCancel: null })
        }
        onConfirm={toast.onConfirm}
        onCancel={toast.onCancel}
      />

      <h1>User Management</h1>

      <div className="user-actions">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="role-filters">
          {roles.map((role) => (
            <button
              key={role}
              className={`filter-btn ${activeRole === role ? "active" : ""}`}
              onClick={() => setActiveRole(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          Add New User
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => openModal(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-remove"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
              <button className="close-modal" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="doctor">Doctor</option>
                  <option value="physio">Physio</option>
                  <option value="dietitian">Dietitian</option>
                  <option value="lab">Lab</option>
                  <option value="phlebotomist">Phlebotomist</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagement;