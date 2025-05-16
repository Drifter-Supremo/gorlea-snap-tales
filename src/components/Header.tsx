import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import NavigationDrawer from "./NavigationDrawer";
import { Button } from "./ui/button";
import { Home } from "lucide-react";

interface HeaderProps {
  showMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showMenu = true }) => {
  const location = useLocation();
  const isPublicView = location.pathname.startsWith("/story/public/");

  return (
    <header className="w-full py-4 px-4 flex justify-between items-center border-b border-gorlea-tertiary bg-gorlea-background/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center">
        {showMenu && !isPublicView && <NavigationDrawer />}
        <Link 
          to={isPublicView ? "/" : "/app"} 
          className="flex items-center ml-2"
        >
          <Logo size="sm" />
        </Link>
      </div>
      
      {isPublicView && (
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            asChild
          >
            <Link to="/signup">
              Sign Up
            </Link>
          </Button>
          <Button asChild>
            <Link to="/login">
              Log In
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
