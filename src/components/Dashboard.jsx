import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { loadCSVData } from "../utils/loadData";

const COLORS = ["#1976d2", "#2e7d32", "#d32f2f", "#ed6c02", "#9c27b0"];

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [topMakes, setTopMakes] = useState([]);
  const [growthByYear, setGrowthByYear] = useState([]);
  const [evTypes, setEvTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCSVData().then((res) => {
        console.log(data);
        
      setData(res);

      // Total EVs
      const totalEVs = res.length;

      // Unique Makes
      const uniqueMakes = new Set(res.map((d) => d.Make)).size;

      // Unique States
      const uniqueStates = new Set(res.map((d) => d.State)).size;

      setMetrics({ totalEVs, uniqueMakes, uniqueStates });

      // Top 5 Makes
      const makeCount = {};
      res.forEach((d) => {
        if (d.Make) makeCount[d.Make] = (makeCount[d.Make] || 0) + 1;
      });
      const sortedMakes = Object.entries(makeCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setTopMakes(sortedMakes);

      // Growth by Year
      const yearCount = {};
      res.forEach((d) => {
        const year = d["Model Year"];
        if (year) yearCount[year] = (yearCount[year] || 0) + 1;
      });
      const sortedYears = Object.entries(yearCount)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => +a.year - +b.year);
      setGrowthByYear(sortedYears);

      // EV Type Distribution
      const typeCount = {};
      res.forEach((d) => {
        if (d["Electric Vehicle Type"]) {
          typeCount[d["Electric Vehicle Type"]] =
            (typeCount[d["Electric Vehicle Type"]] || 0) + 1;
        }
      });
      const typeData = Object.entries(typeCount).map(([name, value]) => ({
        name,
        value,
      }));
      setEvTypes(typeData);

      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Navbar */}
      <AppBar position="static" color="primary" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            EV Analytics Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Metrics Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={4} >
            <Card sx={{ bgcolor: "#1976d2", color: "white" }} elevation={4}>
              <CardContent>
                <Typography variant="h6">Total EVs</Typography>
                <Typography variant="h4">{metrics.totalEVs}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: "#2e7d32", color: "white" }} elevation={4}>
              <CardContent>
                <Typography variant="h6">Unique Makes</Typography>
                <Typography variant="h4">{metrics.uniqueMakes}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: "#9c27b0", color: "white" }} elevation={4}>
              <CardContent>
                <Typography variant="h6">Unique States</Typography>
                <Typography variant="h4">{metrics.uniqueStates}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={10}>
          <Grid item xs={12} md={5} width={400}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top 5 EV Makes
                </Typography>
                <ResponsiveContainer width="130%" height={250}>
                  <BarChart data={topMakes}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} width={500}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  EV Growth by Year
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={growthByYear}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#2e7d32"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} width={500}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  EV Type Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={evTypes}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {evTypes.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
