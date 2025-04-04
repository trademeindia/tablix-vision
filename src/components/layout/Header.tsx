
import React, { useState } from 'react';
import { Bell, Search, Menu, X, Moon, Sun, LogOut, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, userRoles, signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Mobile navigation items (for the drawer)
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Menu Management", path: "/menu" },
    { label: "QR Codes", path: "/qr-codes" },
    { label: "Table Management", path: "/tables" },
    { label: "Orders", path: "/orders" },
    { label: "Staff Management", path: "/staff" },
    { label: "Analytics", path: "/analytics" },
    { label: "Invoices", path: "/invoices" },
    { label: "Settings", path: "/settings" },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual dark mode toggling with a theme provider
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const userDisplayName = user?.user_metadata?.full_name || user?.email || 'User';
  // Use the first letters of the name for the avatar
  const initials = userDisplayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  const userRole = userRoles && userRoles.length > 0 
    ? userRoles[0].charAt(0).toUpperCase() + userRoles[0].slice(1)
    : 'User';

  return (
    <div className="h-14 md:h-16 border-b border-slate-200 flex items-center justify-between px-3 md:px-6 bg-white shadow-sm">
      {isMobile ? (
        // Mobile header
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-1 p-1">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[80vh]">
                <div className="p-4 pt-0">
                  <div className="flex justify-between items-center mb-4 mt-8 border-b pb-4">
                    <h2 className="text-xl font-bold">Ristorante</h2>
                  </div>
                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                      <Button 
                        key={item.path}
                        variant="ghost" 
                        className="justify-start h-10 text-base" 
                        onClick={() => navigate(item.path)}
                      >
                        {item.label}
                      </Button>
                    ))}
                    <Button 
                      variant="destructive" 
                      className="justify-start h-10 text-base mt-4" 
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </nav>
                </div>
              </DrawerContent>
            </Drawer>
            <h1 className="text-base font-bold ml-1">Ristorante</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="absolute inset-0 h-14 bg-white flex items-center px-4 z-20">
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  className="flex-1 h-8"
                  autoFocus
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-1 p-1"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="p-1" 
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <button className="relative p-1" aria-label="Notifications">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 ml-1 cursor-pointer">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{userDisplayName}</span>
                    <span className="text-xs text-muted-foreground">{userRole}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate('/settings')}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleSignOut} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        // Desktop header 
        <>
          <div className="flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-8 bg-slate-50 border-slate-200 w-full max-w-md"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-slate-500" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
              <Moon className="h-4 w-4 text-slate-500" />
            </div>
            
            <button className="relative p-2 rounded-full hover:bg-slate-100">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded-md">
                  <div className="text-right mr-2 hidden md:block">
                    <p className="text-sm font-medium">{userDisplayName}</p>
                    <p className="text-xs text-slate-500">{userRole}</p>
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => navigate('/settings')}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
