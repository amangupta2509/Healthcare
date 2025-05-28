// src/dashboard/master_admin/BasicPage.js
import React from "react";
import { useTheme } from "../../ThemeProvider";

// Import Master Admin layout components
import MasterAdminNavbar from "./components/master_admin_navbar";
import MasterAdminSidebar from "./components/master_admin_sidebar";
import MasterAdminFooter from "./components/master_admin_footer";

// Optional: If you want to style something custom
import "./master_admin.css";

const BasicPage = () => {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>

      <div className="dashboard-layout">
     
        <div className="dashboard-main">
          <h1>Welcome, Master Admin</h1>
          <p>This is a basic page layout using your existing components.</p>
          <p>Use this as a template to build other admin pages.</p>
       
        </div>
      </div>
    </div>
  );
};

export default BasicPage;
