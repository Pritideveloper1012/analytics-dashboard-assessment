import React from "react";

import { CssBaseline, Box } from "@mui/material";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      {/* Reset default browser styles */}
      <CssBaseline />

      {/* Background Wrapper */}
      <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", p: 2 }}>
        <Dashboard />
      </Box>
    </>
  );
}

export default App;
