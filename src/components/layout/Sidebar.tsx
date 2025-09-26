import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Building2, 
  Shield, 
  Users, 
  Home, 
  AlertTriangle, 
  Database,
  Bell,
  Settings,
  LogOut,
  Activity,
  Search,
  Plus
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  userRole?: 'donor' | 'hospital' | 'blood_bank' | 'admin';
}

export function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
      });
    }
  };

  const getNavigationItems = () => {
    const commonItems = [
      { icon: Home, label: "Dashboard", href: "/" },
      { icon: Bell, label: "Notifications", href: "/notifications" },
    ];

    const roleSpecificItems = {
      donor: [
        { icon: Heart, label: "My Profile", href: "/donor/profile" },
        { icon: Activity, label: "Donation History", href: "/donor/history" },
        { icon: AlertTriangle, label: "SOS Request", href: "/donor/sos" },
        { icon: Search, label: "Find Blood Banks", href: "/donor/search" },
      ],
      hospital: [
        { icon: Building2, label: "Hospital Profile", href: "/hospital/profile" },
        { icon: Database, label: "Inventory", href: "/hospital/inventory" },
        { icon: AlertTriangle, label: "Emergency Requests", href: "/hospital/emergency" },
        { icon: Users, label: "Patient Management", href: "/hospital/patients" },
        { icon: Activity, label: "AI Matches", href: "/hospital/matches" },
      ],
      blood_bank: [
        { icon: Shield, label: "Blood Bank Profile", href: "/blood-bank/profile" },
        { icon: Database, label: "Blood Inventory", href: "/blood-bank/inventory" },
        { icon: AlertTriangle, label: "Emergency Alerts", href: "/blood-bank/alerts" },
        { icon: Plus, label: "Add Blood Units", href: "/blood-bank/add" },
        { icon: Activity, label: "Distribution", href: "/blood-bank/distribution" },
      ],
      admin: [
        { icon: Users, label: "User Management", href: "/admin/users" },
        { icon: Database, label: "System Inventory", href: "/admin/inventory" },
        { icon: Activity, label: "Analytics", href: "/admin/analytics" },
        { icon: AlertTriangle, label: "System Alerts", href: "/admin/alerts" },
        { icon: Settings, label: "System Settings", href: "/admin/settings" },
      ],
    };

    return [
      ...commonItems,
      ...(userRole ? roleSpecificItems[userRole] : []),
      { icon: Settings, label: "Settings", href: "/settings" },
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="p-2 bg-gradient-medical rounded-lg">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sidebar-foreground">BloodLink</h1>
          <p className="text-xs text-sidebar-foreground/70">Healthcare Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}