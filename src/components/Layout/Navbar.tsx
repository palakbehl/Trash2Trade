import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/ui/logo';
import { 
  User, 
  Bell, 
  LogOut,
  Home,
  Calendar,
  Gift,
  Trophy,
  Truck,
  MapPin,
  DollarSign,
  Heart,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Role-based navigation items
  const getNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'user':
        if (user.subType === 'trash-generator') {
          return [
            { path: '/dashboard', label: 'Dashboard', icon: Home },
            { path: '/trash-generator', label: 'Book Pickup', icon: Calendar },
            { path: '/profile', label: 'Profile', icon: User },
            { path: '/eco-store', label: 'Eco Store', icon: Gift },
          ];
        } else if (user.subType === 'ngo-business') {
          return [
            { path: '/dashboard', label: 'Dashboard', icon: Home },
            { path: '/ngo-business', label: 'Partnerships', icon: Heart },
            { path: '/profile', label: 'Profile', icon: User },
            { path: '/eco-store', label: 'Eco Store', icon: Gift },
          ];
        } else if (user.subType === 'diy-marketplace') {
          return [
            { path: '/dashboard', label: 'Dashboard', icon: Home },
            { path: '/diy-marketplace', label: 'My Products', icon: BarChart3 },
            { path: '/profile', label: 'Profile', icon: User },
            { path: '/eco-store', label: 'Eco Store', icon: Gift },
          ];
        }
        return [];
      case 'collector':
        return [
          { path: '/collector', label: 'Dashboard', icon: Home },
          { path: '/collector/requests', label: 'Pickup Requests', icon: Truck },
          { path: '/collector/active', label: 'Active Route', icon: MapPin },
          { path: '/collector/earnings', label: 'Earnings', icon: DollarSign },
        ];
      default:
        return [];
    }
  };

  if (!user) {
    return (
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/about">About Us</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/admin">Admin Panel</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navItems = getNavItems();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-2">
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=10b981&textColor=ffffff`} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-primary capitalize">{user.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;