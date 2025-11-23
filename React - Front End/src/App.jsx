import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute, PublicRoute } from './components/PrivateRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Notifications from './pages/Notifications';
import Schedule from './pages/Schedule';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Reservations from './pages/Reservations';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/rooms" element={
            <PrivateRoute allowedRoles={['coord']}>
              <Layout>
                <Rooms />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/schedule" element={
            <PrivateRoute>
              <Layout>
                <Schedule />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/search" element={
            <PrivateRoute>
              <Layout>
                <Search />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/notifications" element={
            <PrivateRoute>
              <Layout>
                <Notifications />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/settings" element={
            <PrivateRoute>
              <Layout>
                <Settings />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/users" element={
            <PrivateRoute allowedRoles={['coord']}>
              <Layout>
                <Users />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/reservations" element={
            <PrivateRoute allowedRoles={['coord', 'professor']}>
              <Layout>
                <Reservations />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
