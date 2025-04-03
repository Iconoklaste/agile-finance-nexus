
import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, FolderKanban, Calculator, Users, FileText, Settings, PanelLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type MainLayoutProps = {
  children: ReactNode;
};

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Projets', path: '/projects', icon: FolderKanban },
  { name: 'Comptabilité', path: '/accounting', icon: Calculator },
  { name: 'CRM', path: '/crm', icon: Users },
  { name: 'Whiteboard', path: '/whiteboard', icon: FileText },
  { name: 'Paramètres', path: '/settings', icon: Settings },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // On mobile, close the sidebar when a link is clicked
  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-0 md:w-16",
          isMobile && !isSidebarOpen && "hidden"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between h-16">
          <span className={cn("font-bold text-lg", !isSidebarOpen && "md:hidden")}>
            Agile Finance
          </span>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={cn(
                  "group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    !isSidebarOpen && "md:mr-0"
                  )}
                  aria-hidden="true"
                />
                <span className={cn(!isSidebarOpen && "md:hidden")}>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User profile or footer */}
        <div className={cn("p-4 border-t border-sidebar-border", !isSidebarOpen && "md:hidden")}>
          <p className="text-sm">
            © 2025 Agile Finance Nexus
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white border-b border-border h-16 flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <PanelLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-semibold">
            {navigation.find(item => item.path === location.pathname)?.name || "Dashboard"}
          </h1>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
