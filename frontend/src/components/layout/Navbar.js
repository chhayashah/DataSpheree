// import { useAuth } from "../../context/AuthContext";

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   return (
//     <nav style={styles.nav}>
//       <a href="/dashboard" style={styles.brand}>
//         Mini OneLake
//       </a>

//       <div style={styles.links}>
//         <a href="/dashboard" style={styles.link}>
//           Dashboard
//         </a>
//         <a href="/data" style={styles.link}>
//           Records
//         </a>
//         <a href="/data/upload" style={styles.link}>
//           Upload
//         </a>
//       </div>

//       <div style={styles.right}>
//         <span style={styles.username}>{user?.name}</span>
//         <span style={styles.role}>{user?.role}</span>
//         <button style={styles.logoutBtn} onClick={logout}>
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// const styles = {
//   nav: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 24px",
//     height: "56px",
//     background: "#1e293b",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
//     position: "sticky",
//     top: 0,
//     zIndex: 100,
//   },
//   brand: {
//     fontSize: "16px",
//     fontWeight: "700",
//     color: "#fff",
//     textDecoration: "none",
//     letterSpacing: "0.02em",
//   },
//   links: { display: "flex", gap: "4px" },
//   link: {
//     padding: "6px 14px",
//     color: "#94a3b8",
//     textDecoration: "none",
//     borderRadius: "6px",
//     fontSize: "13px",
//     fontWeight: "500",
//   },
//   right: { display: "flex", alignItems: "center", gap: "12px" },
//   username: { fontSize: "13px", color: "#e2e8f0", fontWeight: "500" },
//   role: {
//     fontSize: "11px",
//     padding: "2px 8px",
//     borderRadius: "10px",
//     background: "#4f46e5",
//     color: "#fff",
//     fontWeight: "500",
//   },
//   logoutBtn: {
//     padding: "6px 14px",
//     background: "transparent",
//     color: "#94a3b8",
//     border: "1px solid #334155",
//     borderRadius: "6px",
//     fontSize: "13px",
//     cursor: "pointer",
//   },
// };

// export default Navbar;

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const path = window.location.pathname;

  const linkStyle = (href) => ({
    padding: "6px 14px",
    color: path === href ? "#fff" : "#94a3b8",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    background: path === href ? "rgba(255,255,255,0.08)" : "transparent",
  });

  return (
    <nav style={styles.nav}>
      <a href="/dashboard" style={styles.brand}>
        <span style={styles.brandIcon}>DS</span>
        DataSphere
      </a>

      <div style={styles.links}>
        <a href="/dashboard" style={linkStyle("/dashboard")}>
          Dashboard
        </a>
        <a href="/data" style={linkStyle("/data")}>
          Records
        </a>
        <a href="/data/upload" style={linkStyle("/data/upload")}>
          Upload
        </a>
        <a href="/insights" style={linkStyle("/insights")}>
          AI Insights
        </a>
        <a href="/activity" style={linkStyle("/activity")}>
          Activity
        </a>
      </div>

      <div style={styles.right}>
        <span style={styles.userName}>{user?.name}</span>
        <span
          style={{
            ...styles.roleBadge,
            background: user?.role === "admin" ? "#4f46e5" : "#0ea5e9",
          }}
        >
          {user?.role}
        </span>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "58px",
    background: "#0f172a",
    position: "sticky",
    top: 0,
    zIndex: 100,
    fontFamily: "sans-serif",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    textDecoration: "none",
  },
  brandIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  links: {
    display: "flex",
    gap: "2px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userName: {
    fontSize: "13px",
    color: "#e2e8f0",
    fontWeight: "500",
  },
  roleBadge: {
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
  },
  logoutBtn: {
    padding: "6px 14px",
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid #1e293b",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },
};

export default Navbar;