import React, { useEffect, useState } from "react";
import { Repeat, Edit3 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../master_admin/master_admin.css";

const CounselorCompletedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  const [reassigningAppt, setReassigningAppt] = useState(null);
  const [reassignDate, setReassignDate] = useState("");
  const [reassignTime, setReassignTime] = useState("");

  const [editingNoteAppt, setEditingNoteAppt] = useState(null);
  const [editedNote, setEditedNote] = useState("");

  const API_URL = "http://localhost:5000/counselorAppointments";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) =>
        setAppointments(data.filter((a) => a.status === "Completed"))
      );
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(search) ||
      a.mrn.toLowerCase().includes(search)
  );

  const handleReassign = (appt) => {
    setReassigningAppt(appt);
    setReassignDate("");
    setReassignTime("");
  };

  const confirmReassign = () => {
    if (!reassignDate || !reassignTime) {
      toast.error("Please select both date and time.");
      return;
    }

    const newAppt = {
      ...reassigningAppt,
      id: Date.now(),
      date: reassignDate,
      time: reassignTime,
      status: "Pending",
      meetingLink: "",
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAppt),
    }).then(() => {
      toast.success("Appointment reassigned");
      setReassigningAppt(null);
      setReassignDate("");
      setReassignTime("");
    });
  };

  const handleEditNote = (appt) => {
    setEditingNoteAppt(appt);
    setEditedNote(appt.notes || "");
  };

  const confirmEditNote = () => {
    const updated = appointments.map((a) =>
      a.id === editingNoteAppt.id ? { ...a, notes: editedNote } : a
    );
    setAppointments(updated);

    fetch(`${API_URL}/${editingNoteAppt.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated.find((a) => a.id === editingNoteAppt.id)),
    }).then(() => {
      toast.success("Remarks updated");
      setEditingNoteAppt(null);
      setEditedNote("");
    });
  };

  return (
    <div className="dashboard-main">
      <ToastContainer position="top-center" autoClose={2000} />
      <h1>Completed Appointments</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name or MRN..."
          className="search-input"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No completed appointments found.</p>
      ) : (
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>MRN No.</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.mrn}</td>
                  <td>{a.patientName}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditNote(a)}
                      title="Edit Remarks"
                    >
                      <Edit3 size={14} />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleReassign(a)}
                      title="Reassign"
                    >
                      <Repeat size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reassign Modal */}
      {reassigningAppt && (
        <div className="modal-overlay">
          <div
            className="modalsc-box"
            style={{
              border: "1px solid #cc5500",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h2>Reassign Appointment</h2>
            <p>
              Patient: <strong>{reassigningAppt.patientName}</strong>
            </p>
            <div className="form-group">
              <label>Date:</label>
              <input
                className="search-input"
                type="date"
                value={reassignDate}
                onChange={(e) => setReassignDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                className="search-input"
                type="time"
                value={reassignTime}
                onChange={(e) => setReassignTime(e.target.value)}
                required
              />
            </div>
            <div className="center-btn" style={{ marginTop: "1rem" }}>
              <center>
                {" "}
                <button className="btn btn-primary" onClick={confirmReassign}>
                  Confirm
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setReassigningAppt(null)}
                >
                  Cancel
                </button>
              </center>
            </div>
          </div>
        </div>
      )}

      {/* Edit Remarks Modal */}
      {editingNoteAppt && (
        <div className="modal-overlay">
          <div
            className="modalsc-box"
            style={{
              border: "1px solid #cc5500",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h2>Edit Remarks</h2>
            <p>
              Patient: <strong>{editingNoteAppt.patientName}</strong>
            </p>
            <div className="form-group">
              <label>Remarks:</label>
              <textarea
                className="search-input"
                value={editedNote}
                onChange={(e) => setEditedNote(e.target.value)}
                rows={4}
                style={{ width: "100%", fontSize: "14px" }}
              />
            </div>
            <div className="center-btn" style={{ marginTop: "1rem" }}>
              <center>
                {" "}
                <button className="btn btn-primary" onClick={confirmEditNote}>
                  Save
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setEditingNoteAppt(null)}
                >
                  Cancel
                </button>
              </center>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorCompletedAppointments;
