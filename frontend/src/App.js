import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import Login from './pages/Login';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Events from './pages/Events';
import Plays from './pages/Plays';

const ProtectedLayout = ({ children }) => {
  const { role } = useApp();
  if (!role) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ToastContainer />
    </>
  );
};

const AppRoutes = () => {
  const { role } = useApp();
  return (
    <Routes>
      <Route
        path="/login"
        element={role ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={<ProtectedLayout><Home /></ProtectedLayout>}
      />
      <Route
        path="/movies"
        element={<ProtectedLayout><Home /></ProtectedLayout>}
      />
      <Route
        path="/movie/:id"
        element={<ProtectedLayout><MovieDetail /></ProtectedLayout>}
      />
      <Route
        path="/events"
        element={<ProtectedLayout><Events /></ProtectedLayout>}
      />
      <Route
        path="/plays"
        element={<ProtectedLayout><Plays /></ProtectedLayout>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AppProvider>
);

export default App;
