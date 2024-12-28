import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { TherapySession } from './components/therapy/TherapySession';
import { supabase } from './lib/supabase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  if (isAuthenticated === null) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#343541]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/therapy" /> : <LoginForm />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/therapy" /> : <RegisterForm />} />
        <Route path="/therapy" element={isAuthenticated ? <TherapySession /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;