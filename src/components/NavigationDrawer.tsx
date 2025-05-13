
import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Camera, HeartIcon, Settings, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";

const NavigationDrawer = () => {
  const { user, logout } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gorlea-text">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-gorlea-background border-gorlea-tertiary">
        <SheetHeader className="mb-6">
          <Logo />
        </SheetHeader>

        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gorlea-accent flex-shrink-0">
              <img
                src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                alt="Profile"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-medium truncate">{user?.displayName || "User"}</h3>
              <p className="text-sm text-gorlea-text/70 truncate">{user?.email || ""}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-gorlea-tertiary my-4" />

        <div className="flex flex-col space-y-2">
          <Link to="/app">
            <Button variant="ghost" className="w-full justify-start text-gorlea-text hover:bg-gorlea-tertiary hover:text-gorlea-text">
              <Camera className="mr-2 h-5 w-5" />
              New Story
            </Button>
          </Link>
          <Link to="/favorites">
            <Button variant="ghost" className="w-full justify-start text-gorlea-text hover:bg-gorlea-tertiary hover:text-gorlea-text">
              <HeartIcon className="mr-2 h-5 w-5" />
              My Stories
            </Button>
          </Link>
        </div>

        <Separator className="bg-gorlea-tertiary my-4" />

        <div className="flex flex-col space-y-2">
          <Link to="/settings">
            <Button variant="ghost" className="w-full justify-start text-gorlea-text hover:bg-gorlea-tertiary hover:text-gorlea-text">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-gorlea-text hover:bg-gorlea-tertiary hover:text-gorlea-text"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
        </div>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <p className="text-xs text-center text-gorlea-text/50">
            © {new Date().getFullYear()} Gorlea Snaps
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
