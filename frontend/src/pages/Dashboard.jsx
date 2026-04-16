import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: ""
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: ""
    });
    setEditingTaskId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingTaskId) {
        await API.patch(`/tasks/${editingTaskId}`, formData);
        setMessage("Task updated successfully");
      } else {
        await API.post("/tasks", formData);
        setMessage("Task created successfully");
      }

      resetForm();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task action failed");
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
    });
    setEditingTaskId(task._id);
    setMessage("");
    setError("");
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
    setMessage("");
    setError("");
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!taskToDelete?._id) return;

    try {
      await API.delete(`/tasks/${taskToDelete._id}`);
      setMessage("Task deleted successfully");

      if (editingTaskId === taskToDelete._id) {
        resetForm();
      }

      closeDeleteModal();
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
      closeDeleteModal();
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "completed").length;
    const pending = tasks.filter((task) => task.status === "pending").length;
    const inProgress = tasks.filter((task) => task.status === "in-progress").length;
    return { total, completed, pending, inProgress };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ? true : task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlowOne}></div>
      <div style={styles.backgroundGlowTwo}></div>

      <div style={styles.container}>
        <div style={styles.headerCard}>
          <div>
            <div style={styles.heroBadge}>Secure Task API</div>
            <h1 style={styles.mainTitle}>Task Dashboard</h1>
            <p style={styles.subtitle}>
              Welcome back, <strong>{user?.name || "User"}</strong>
              {user?.role ? ` • ${user.role}` : ""}. Manage your workflow with a
              cleaner, smarter interface.
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Logout
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Tasks</div>
            <div style={styles.statValue}>{stats.total}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Pending</div>
            <div style={styles.statValue}>{stats.pending}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>In Progress</div>
            <div style={styles.statValue}>{stats.inProgress}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Completed</div>
            <div style={styles.statValue}>{stats.completed}</div>
          </div>
        </div>

        <div style={styles.dashboardGrid}>
          <div style={styles.formCard}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                {editingTaskId ? "Edit Task" : "Create New Task"}
              </h2>
              <p style={styles.sectionText}>
                {editingTaskId
                  ? "You are editing an existing task. Update the details and save changes."
                  : "Add a new task with status, priority, and deadline."}
              </p>
            </div>

            {editingTaskId && (
              <div style={styles.editModeBanner}>
                <span style={styles.editModeDot}></span>
                Edit mode is active
              </div>
            )}

            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Task Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  placeholder="Write short task description"
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows={4}
                />
              </div>

              <div style={styles.twoCol}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formActions}>
                <button
                  type="submit"
                  style={styles.primaryBtn}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {editingTaskId ? "Update Task" : "Create Task"}
                </button>

                {editingTaskId && (
                  <button
                    type="button"
                    style={styles.secondaryBtn}
                    onClick={resetForm}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {message && <div style={styles.successBox}>{message}</div>}
            {error && <div style={styles.errorBox}>{error}</div>}
          </div>

          <div style={styles.sideCard}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Quick Overview</h2>
              <p style={styles.sectionText}>
                Your current dashboard summary at a glance.
              </p>
            </div>

            <div style={styles.overviewList}>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Active User</span>
                <span style={styles.overviewValue}>{user?.name || "Unknown"}</span>
              </div>

              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Role</span>
                <span style={styles.overviewValue}>{user?.role || "N/A"}</span>
              </div>

              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Open Tasks</span>
                <span style={styles.overviewValue}>
                  {stats.pending + stats.inProgress}
                </span>
              </div>

              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Completed Tasks</span>
                <span style={styles.overviewValue}>{stats.completed}</span>
              </div>
            </div>

            <div style={styles.tipBox}>
              <div style={styles.tipTitle}>Productivity Tip</div>
              <div style={styles.tipText}>
                Keep high-priority tasks updated and assign due dates to make your
                dashboard more actionable.
              </div>
            </div>
          </div>
        </div>

        <div style={styles.tasksSection}>
          <div style={styles.tasksHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Your Tasks</h2>
              <p style={styles.sectionText}>
                Search, filter, edit, and manage all your tasks in one place.
              </p>
            </div>

            <div style={styles.taskCountPill}>
              Showing {filteredTasks.length} of {tasks.length}
            </div>
          </div>

          <div style={styles.filterBar}>
            <div style={styles.searchWrap}>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.filterControls}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Priority</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <button
                type="button"
                style={styles.clearFilterBtn}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🗂️</div>
              <h3 style={styles.emptyTitle}>No matching tasks found</h3>
              <p style={styles.emptyText}>
                Try changing your search or filter options.
              </p>
            </div>
          ) : (
            <div style={styles.taskGrid}>
              {filteredTasks.map((task) => (
                <div key={task._id} style={styles.taskCard}>
                  <div style={styles.taskTop}>
                    <div style={styles.taskHeadingWrap}>
                      <h3 style={styles.taskTitle}>{task.title}</h3>
                      <p style={styles.taskDescription}>
                        {task.description || "No description added for this task."}
                      </p>
                    </div>

                    <div style={styles.badgesWrap}>
                      <span style={getStatusBadgeStyle(task.status)}>
                        {formatStatus(task.status)}
                      </span>
                      <span style={getPriorityBadgeStyle(task.priority)}>
                        {formatPriority(task.priority)}
                      </span>
                    </div>
                  </div>

                  <div style={styles.taskMetaRow}>
                    <div style={styles.metaBox}>
                      <span style={styles.metaLabel}>Due Date</span>
                      <span style={styles.metaValue}>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "Not set"}
                      </span>
                    </div>

                    <div style={styles.metaBox}>
                      <span style={styles.metaLabel}>Task ID</span>
                      <span style={styles.metaValue}>
                        {task._id?.slice(-6) || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <button
                      onClick={() => handleEdit(task)}
                      style={styles.editBtn}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => openDeleteModal(task)}
                      style={styles.deleteBtn}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalIcon}>⚠️</div>
            <h3 style={styles.modalTitle}>Delete Task?</h3>
            <p style={styles.modalText}>
              Are you sure you want to delete{" "}
              <strong>{taskToDelete?.title || "this task"}</strong>? This action
              cannot be undone.
            </p>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={closeDeleteModal}
                style={styles.modalCancelBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={styles.modalDeleteBtn}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatStatus = (status) => {
  if (status === "in-progress") return "In Progress";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatPriority = (priority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const getStatusBadgeStyle = (status) => {
  const base = {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    border: "1px solid transparent",
    whiteSpace: "nowrap"
  };

  if (status === "completed") {
    return {
      ...base,
      background: "rgba(34,197,94,0.16)",
      color: "#86efac",
      border: "1px solid rgba(34,197,94,0.24)"
    };
  }

  if (status === "in-progress") {
    return {
      ...base,
      background: "rgba(59,130,246,0.16)",
      color: "#93c5fd",
      border: "1px solid rgba(59,130,246,0.24)"
    };
  }

  return {
    ...base,
    background: "rgba(245,158,11,0.16)",
    color: "#fcd34d",
    border: "1px solid rgba(245,158,11,0.24)"
  };
};

const getPriorityBadgeStyle = (priority) => {
  const base = {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    border: "1px solid transparent",
    whiteSpace: "nowrap"
  };

  if (priority === "high") {
    return {
      ...base,
      background: "rgba(239,68,68,0.16)",
      color: "#fca5a5",
      border: "1px solid rgba(239,68,68,0.24)"
    };
  }

  if (priority === "medium") {
    return {
      ...base,
      background: "rgba(168,85,247,0.16)",
      color: "#d8b4fe",
      border: "1px solid rgba(168,85,247,0.24)"
    };
  }

  return {
    ...base,
    background: "rgba(20,184,166,0.16)",
    color: "#99f6e4",
    border: "1px solid rgba(20,184,166,0.24)"
  };
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)",
    padding: "28px 18px",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "'Inter', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
  },
  backgroundGlowOne: {
    position: "absolute",
    top: "-120px",
    left: "-80px",
    width: "320px",
    height: "320px",
    background: "rgba(34,197,94,0.14)",
    filter: "blur(100px)",
    borderRadius: "50%",
    pointerEvents: "none"
  },
  backgroundGlowTwo: {
    position: "absolute",
    bottom: "-140px",
    right: "-100px",
    width: "360px",
    height: "360px",
    background: "rgba(59,130,246,0.14)",
    filter: "blur(110px)",
    borderRadius: "50%",
    pointerEvents: "none"
  },
  container: {
    maxWidth: "1240px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1
  },
  headerCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
    padding: "28px",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow: "0 22px 60px rgba(0,0,0,0.30)",
    marginBottom: "22px"
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#86efac",
    background: "rgba(34,197,94,0.14)",
    border: "1px solid rgba(34,197,94,0.22)",
    marginBottom: "12px"
  },
  mainTitle: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    margin: "10px 0 0 0",
    color: "#cbd5e1",
    lineHeight: "1.65",
    fontSize: "15px",
    maxWidth: "700px"
  },
  logoutBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    padding: "13px 18px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 14px 30px rgba(239,68,68,0.22)"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "22px"
  },
  statCard: {
    padding: "22px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 16px 35px rgba(0,0,0,0.24)"
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "10px"
  },
  statValue: {
    color: "#f8fafc",
    fontSize: "30px",
    fontWeight: "800"
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1.55fr 0.95fr",
    gap: "20px",
    marginBottom: "22px"
  },
  formCard: {
    padding: "24px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow: "0 22px 55px rgba(0,0,0,0.28)"
  },
  sideCard: {
    padding: "24px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow: "0 22px 55px rgba(0,0,0,0.28)"
  },
  sectionHeader: {
    marginBottom: "18px"
  },
  sectionTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "22px",
    fontWeight: "800"
  },
  sectionText: {
    margin: "8px 0 0 0",
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.6"
  },
  editModeBanner: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    marginBottom: "16px",
    background: "rgba(59,130,246,0.14)",
    color: "#bfdbfe",
    border: "1px solid rgba(59,130,246,0.22)",
    fontSize: "13px",
    fontWeight: "700"
  },
  editModeDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#60a5fa"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#e2e8f0"
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    outline: "none",
    fontSize: "14px",
    transition: "0.25s ease",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    outline: "none",
    fontSize: "14px",
    resize: "vertical",
    minHeight: "110px",
    boxSizing: "border-box"
  },
  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px"
  },
  formActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "4px"
  },
  primaryBtn: {
    padding: "14px 18px",
    border: "none",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    fontWeight: "800",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 14px 30px rgba(34,197,94,0.24)"
  },
  secondaryBtn: {
    padding: "14px 18px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#e2e8f0",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.25s ease"
  },
  successBox: {
    marginTop: "16px",
    padding: "12px 14px",
    borderRadius: "14px",
    background: "rgba(34,197,94,0.14)",
    color: "#86efac",
    border: "1px solid rgba(34,197,94,0.22)",
    fontSize: "14px",
    fontWeight: "600"
  },
  errorBox: {
    marginTop: "16px",
    padding: "12px 14px",
    borderRadius: "14px",
    background: "rgba(239,68,68,0.14)",
    color: "#fca5a5",
    border: "1px solid rgba(239,68,68,0.22)",
    fontSize: "14px",
    fontWeight: "600"
  },
  overviewList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  overviewItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)"
  },
  overviewLabel: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "700"
  },
  overviewValue: {
    color: "#f8fafc",
    fontSize: "14px",
    fontWeight: "700"
  },
  tipBox: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, rgba(34,197,94,0.14), rgba(59,130,246,0.10))",
    border: "1px solid rgba(255,255,255,0.10)"
  },
  tipTitle: {
    color: "#f8fafc",
    fontSize: "15px",
    fontWeight: "800",
    marginBottom: "8px"
  },
  tipText: {
    color: "#cbd5e1",
    lineHeight: "1.6",
    fontSize: "14px"
  },
  tasksSection: {
    padding: "24px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow: "0 22px 55px rgba(0,0,0,0.28)"
  },
  tasksHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px"
  },
  taskCountPill: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    color: "#e2e8f0",
    border: "1px solid rgba(255,255,255,0.10)",
    fontSize: "13px",
    fontWeight: "700"
  },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "18px",
    padding: "16px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)"
  },
  searchWrap: {
    flex: "1 1 280px"
  },
  searchInput: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  filterControls: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  filterSelect: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    outline: "none",
    fontSize: "14px",
    minWidth: "160px"
  },
  clearFilterBtn: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#e2e8f0",
    fontWeight: "700",
    cursor: "pointer"
  },
  emptyState: {
    textAlign: "center",
    padding: "42px 18px 34px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.04)",
    border: "1px dashed rgba(255,255,255,0.12)"
  },
  emptyIcon: {
    fontSize: "36px",
    marginBottom: "12px"
  },
  emptyTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "22px",
    fontWeight: "800"
  },
  emptyText: {
    color: "#94a3b8",
    lineHeight: "1.6",
    maxWidth: "420px",
    margin: "10px auto 0"
  },
  taskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px"
  },
  taskCard: {
    padding: "20px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 14px 35px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    transition: "all 0.25s ease"
  },
  taskTop: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  taskHeadingWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  taskTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "20px",
    fontWeight: "800",
    lineHeight: "1.3"
  },
  taskDescription: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.7"
  },
  badgesWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  taskMetaRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },
  metaBox: {
    padding: "12px 14px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  metaLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "700"
  },
  metaValue: {
    color: "#f8fafc",
    fontSize: "14px",
    fontWeight: "700",
    wordBreak: "break-word"
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },
  editBtn: {
    flex: 1,
    minWidth: "120px",
    padding: "12px 14px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 12px 24px rgba(59,130,246,0.22)"
  },
  deleteBtn: {
    flex: 1,
    minWidth: "120px",
    padding: "12px 14px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 12px 24px rgba(239,68,68,0.20)"
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.70)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "18px",
    zIndex: 9999,
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)"
  },
  modalCard: {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "24px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.40)",
    padding: "28px",
    textAlign: "center"
  },
  modalIcon: {
    fontSize: "34px",
    marginBottom: "12px"
  },
  modalTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "24px",
    fontWeight: "800"
  },
  modalText: {
    margin: "12px 0 0 0",
    color: "#cbd5e1",
    lineHeight: "1.7",
    fontSize: "15px"
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "22px",
    flexWrap: "wrap"
  },
  modalCancelBtn: {
    padding: "13px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#e2e8f0",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "130px"
  },
  modalDeleteBtn: {
    padding: "13px 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    minWidth: "130px",
    boxShadow: "0 12px 24px rgba(239,68,68,0.22)"
  }
};

export default Dashboard;