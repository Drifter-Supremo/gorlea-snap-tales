
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated) {
      navigate("/app");
    } else {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  // This component doesn't render anything meaningful as it just redirects
  return null;
};

export default Index;
