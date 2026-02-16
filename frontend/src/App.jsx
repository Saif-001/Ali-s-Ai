import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Generator from './pages/Generator'; // Your image generator code

function App() {
  // Global state to track if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Route: The Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Public Route: The Login/Signup Page */}
        <Route 
          path="/auth" 
          element={<Auth setIsAuthenticated={setIsAuthenticated} />} 
        />

        {/* Protected Route: The Image Generator */}
        <Route 
          path="/generate" 
          element={
            isAuthenticated ? (
              <Generator /> 
            ) : (
              // If they aren't authenticated, kick them back to the landing page
              <Navigate to="/" replace /> 
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;