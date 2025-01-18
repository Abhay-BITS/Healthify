import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FindHospitals from './pages/FindHospitals';
import Appointments from './pages/Appointments';
import Reminders from './pages/Reminders';
import Community from './pages/Community';
import SymptomChecker from './pages/SymptomChecker';
import Emergency from './pages/Emergency';
import Settings from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/hospitals" element={<FindHospitals />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/reminders" element={<Reminders />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/symptoms" element={<SymptomChecker />} />
                    <Route path="/emergency" element={<Emergency />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;