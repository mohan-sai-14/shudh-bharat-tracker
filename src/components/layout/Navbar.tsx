import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";

type NavbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur-sm px-4 transition-all duration-300",
        sidebarOpen && !isMobile ? "ml-64" : "ml-0"
      )}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:bg-eco-light-green/20"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Logo and Title */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-eco-green" />
            <div>
              <h1 className="text-lg font-bold text-eco-dark-green">
                Bharat Shudh
              </h1>
              <p className="text-[10px] text-eco-green -mt-1">
                Real-Time Pollution Tracker
              </p>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
