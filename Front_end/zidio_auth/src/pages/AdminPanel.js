import React from "react";
import { FaUsers, FaTasks, FaSignOutAlt } from "react-icons/fa";
import "./AdminPanel.css";

const AdminPanel = () => {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><FaUsers /> Manage Users</li>
          <li><FaTasks /> Manage Tasks</li>
          <li className="logout"><FaSignOutAlt /> Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <h1>Dashboard</h1>
        </header>

        <section className="admin-stats">
          <div className="stat-box">Total Users: 100</div>
          <div className="stat-box">Total Tasks: 500</div>
        </section>

        <section className="admin-users">
          <h2>User Management</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Guest</td>
                <td>Guest@example.com</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
