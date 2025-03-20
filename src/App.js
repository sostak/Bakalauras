import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CustomersList from './components/CustomersList';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import Login from './components/Login';
import MechanicsList from './components/MechanicsList';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './components/Settings';
import SignUp from './components/SignUp';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomersList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mechanics"
            element={
              <ProtectedRoute>
                <Layout>
                  <MechanicsList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
