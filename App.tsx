import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ForumPage from './pages/ForumPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ThemeProvider>
          <DataProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="forum" element={<ForumPage />} />
                <Route path="chat" element={<ChatPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;