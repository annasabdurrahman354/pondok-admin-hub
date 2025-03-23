
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Settings, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const PondokNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/pondok/dashboard' },
    { icon: FileText, label: 'RAB', path: '/pondok/rab-list' },
    { icon: FileText, label: 'LPJ', path: '/pondok/lpj-list' },
    { icon: Settings, label: 'Settings', path: '/pondok/settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full border-t border-border bg-background/90 backdrop-blur-lg z-50">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="flex justify-around items-center relative h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-16 h-16 transition-all ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute bottom-0 w-12 h-1.5 bg-primary rounded-t-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default PondokNavigation;
