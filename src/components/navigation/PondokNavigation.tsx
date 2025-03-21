import { Link, useLocation } from 'react-router-dom';
import { FileText, BarChart3, Plus, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const PondokNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/pondok/dashboard' },
    { icon: FileText, label: 'RAB', path: '/pondok/rab' },
    { null: true }, // Empty slot for FAB
    { icon: FileText, label: 'LPJ', path: '/pondok/lpj' },
    { icon: Settings, label: 'Settings', path: '/pondok/settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full border-t border-border bg-background/80 backdrop-blur-lg z-50">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="flex justify-around items-center relative h-16">
          {navItems.map((item, index) => {
            if (item.null) {
              return <div key={`spacer-${index}`} className="w-16" />;
            }
            
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
                <span className="text-xs mt-1">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          
          {/* Floating Action Button */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Link to="/pondok/create" aria-label="Create new">
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg transform transition-transform hover:scale-105">
                <Plus className="h-6 w-6" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PondokNavigation;
