
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import NavigationDrawer from "./NavigationDrawer";

interface HeaderProps {
  showMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showMenu = true }) => {
  return (
    <header className="w-full py-4 px-4 flex justify-between items-center border-b border-gorlea-tertiary bg-gorlea-background/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center">
        {showMenu && <NavigationDrawer />}
        <Link to="/app" className="ml-2">
          <Logo size="sm" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
