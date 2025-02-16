import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { TaskDashboard } from './pages/TaskDashboard';
import { TaskHistoryPage } from './pages/TaskHistoryPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

/**
 * The  main application component that sets up the routing for the app.
 * It uses `AuthProvider` to provide authentication context to the entire app.
 * 
 * Routes:
 * - `/login`: Renders the `LoginPage` component.
 * - `/`: Renders the `TaskDashboard` component within a `PrivateRoute`.
 * - `/profile`: Renders the `ProfilePage` component within a `PrivateRoute`.
 * - `/task-history`: Renders the `TaskHistoryPage` component within a `PrivateRoute`.
 * 
 * `PrivateRoute` ensures that the user is authenticated before rendering the component.
 * 
 * @returns {JSX.Element} The main application component with routing.
 */
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <TaskDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/task-history"
          element={
            <PrivateRoute>
              <TaskHistoryPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;