import React, { useState, useEffect } from 'react';
import axios from 'axios';
const b1 = import.meta.env.VITE_USER_SERVICE_URL;
const b2 = import.meta.env.VITE_PROBLEM_SERVICE_URL;
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Engineering as TechnicianIcon,
  Restaurant as ChefIcon,
  Assignment as ProblemIcon,
  CheckCircle as SolvedIcon,
  Pending as PendingIcon,
  Build as InProgressIcon,
  BarChart as StatsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('all');
  const [problemFilter, setProblemFilter] = useState('all');
  const [availableTechnicians, setAvailableTechnicians] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch statistics
      const statsRes = await axios.get(`${b1}/problems/stats`);
      setStats(statsRes.data);

      // Fetch users
      const usersRes = await axios.get(`${b1}/users`);
      setUsers(usersRes.data);

      // Fetch problems
      const problemsRes = await axios.get(`${b2}/problems`);
      setProblems(problemsRes.data);

      // Fetch recent problems
      const recentRes = await axios.get(`${b1}/problems/recent`);
      setRecentProblems(recentRes.data);

      // Fetch available technicians
      const techRes = await axios.get(`${b1}/techniciens/available`);
      setAvailableTechnicians(techRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const filteredUsers = users.filter(user => {
    if (userFilter === 'all') return true;
    return user.role === userFilter;
  });

  const filteredProblems = problems.filter(problem => {
    if (problemFilter === 'all') return true;
    return problem.status === problemFilter;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'solved':
        return <Chip icon={<SolvedIcon />} label="Solved" color="success" size="small" />;
      case 'progressing':
        return <Chip icon={<InProgressIcon />} label="In Progress" color="warning" size="small" />;
      default:
        return <Chip icon={<PendingIcon />} label="Waiting" color="info" size="small" />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'technicien':
        return <TechnicianIcon />;
      case 'chef':
        return <ChefIcon />;
      case 'assistant':
        return <PeopleIcon />;
      default:
        return <PeopleIcon />;
    }
  };

  const userRoleData = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const roleChartData = Object.keys(userRoleData).map(role => ({
    name: role,
    value: userRoleData[role]
  }));

  const problemTypeData = stats?.byType || [];

  return (
    <Box sx={{ p: 3, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography color="textSecondary" gutterBottom>
                        Total Users
                      </Typography>
                      <Typography variant="h4">{users.length}</Typography>
                    </div>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PeopleIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography color="textSecondary" gutterBottom>
                        Total Problems
                      </Typography>
                      <Typography variant="h4">{problems.length}</Typography>
                    </div>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <ProblemIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography color="textSecondary" gutterBottom>
                        Problems This Month
                      </Typography>
                      <Typography variant="h4">{stats?.currentMonthCount || 0}</Typography>
                    </div>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <StatsIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography color="textSecondary" gutterBottom>
                        Available Technicians
                      </Typography>
                      <Typography variant="h4">{availableTechnicians.length}</Typography>
                    </div>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <TechnicianIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  User Distribution by Role
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {roleChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Problems by Type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={problemTypeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Problem Count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Problems Section */}
          <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Problems
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentProblems.map((problem) => (
                    <TableRow key={problem.id}>
                      <TableCell>{problem.id.substring(0, 6)}...</TableCell>
                      <TableCell>{problem.description}</TableCell>
                      <TableCell>
                        <Chip label={problem.type} size="small" />
                      </TableCell>
                      <TableCell>
                        {getStatusChip(problem.status)}
                      </TableCell>
                      <TableCell>
                        {problem.assignedTechnician ? (
                          <Chip
                            avatar={<Avatar>{problem.assignedTechnician.substring(0, 1)}</Avatar>}
                            label={problem.assignedTechnician.substring(0, 8)}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Not assigned
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Users Section */}
         
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;
