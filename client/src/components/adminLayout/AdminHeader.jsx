<header
  style={{
    background: "linear-gradient(90deg, #0f172a, #1e293b)",
    padding: "15px 30px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  }}
>
  {/* Left */}
  <h1 style={{ fontSize: "22px", fontWeight: "bold", letterSpacing: "1px" }}>
    🎓 Admin Dashboard
  </h1>

  {/* Right */}
  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
    
    {/* Search */}
    <input
      type="text"
      placeholder="Search..."
      style={{
        padding: "6px 12px",
        borderRadius: "6px",
        border: "none",
        outline: "none",
      }}
    />

    {/* Notification */}
    <div style={{ position: "relative", cursor: "pointer" }}>
      🔔
      <span
        style={{
          position: "absolute",
          top: "-6px",
          right: "-8px",
          background: "red",
          color: "white",
          borderRadius: "50%",
          fontSize: "10px",
          padding: "3px 6px",
        }}
      >
        3
      </span>
    </div>

    {/* Profile */}
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img
        src="https://i.pravatar.cc/40"
        alt="Admin"
        style={{
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          border: "2px solid white",
        }}
      />
      <span>Admin</span>
    </div>

  </div>
</header>