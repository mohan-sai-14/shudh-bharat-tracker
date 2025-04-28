
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  MapPin, 
  Camera, 
  Trophy, 
  Users, 
  ChartLine, 
  Newspaper, 
  User, 
  Settings,
  Leaf
} from "lucide-react";

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Sidebar = ({ open }: SidebarProps) => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Pollution Map", path: "/map", icon: MapPin },
    { name: "Report Pollution", path: "/report", icon: Camera },
    { name: "State AQI/WQI Ranking", path: "/leaderboard", icon: Trophy },
    { name: "Pollution Hotspots", path: "/pollution-alerts", icon: Users },
    { name: "Trends & Analysis", path: "/trends", icon: ChartLine },
    { name: "Eco News", path: "/news", icon: Newspaper },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-20 items-center justify-center border-b">
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-eco-green" />
          <div>
            <h1 className="text-xl font-bold text-eco-dark-green">
              Bharat Shudh
            </h1>
            <p className="text-xs text-eco-green">Real-Time Pollution Tracker</p>
          </div>
        </div>
      </div>

      <nav className="flex h-[calc(100vh-5rem)] flex-col justify-between p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive
                    ? "bg-eco-light-green text-eco-dark-green font-medium"
                    : "text-gray-600 hover:bg-eco-light-green/50"
                )
              }
              end={item.path === "/"}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto rounded-lg bg-eco-light-green p-4">
          <h3 className="font-medium text-eco-dark-green">Make India Clean</h3>
          <p className="mt-1 text-sm text-gray-600">
            Join the movement to make Bharat clean and green!
          </p>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
