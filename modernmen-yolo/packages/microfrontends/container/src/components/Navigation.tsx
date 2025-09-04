import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Briefcase, Settings, Home } from 'lucide-react';

interface NavigationProps {
  mobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ mobile = false }) => {
  const location = useLocation();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/customer', label: 'Customer Portal', icon: User },
    { href: '/barber', label: 'Barber Portal', icon: Briefcase },
    { href: '/admin', label: 'Admin Portal', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const linkClass = mobile
    ? "block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-100 rounded-md"
    : "text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200";

  const activeClass = mobile
    ? "bg-blue-100 text-blue-700"
    : "text-blue-600 border-b-2 border-blue-600";

  return (
    <nav className={mobile ? "space-y-1" : "flex items-center space-x-4"}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            to={href}
            className={`${linkClass} ${active ? activeClass : ''} flex items-center`}
          >
            <Icon className={`${mobile ? 'mr-3' : 'mr-1'} h-4 w-4`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
