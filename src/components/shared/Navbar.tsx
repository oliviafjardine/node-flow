import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Database, Zap, User, ChevronRight } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/data-structures', label: 'Data Structures', icon: Database },
  { to: '/algorithms', label: 'Algorithms', icon: Zap },
  { to: '/about', label: 'About', icon: User },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-surface border-r border-default flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-subtle">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-inverse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Node Flow</h1>
              <p className="text-xs text-tertiary">Learn DSA Visually</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded ${
                    isActive
                      ? 'bg-brand-light text-brand border border-brand/20'
                      : 'text-secondary'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand' : 'text-tertiary'}`} />
                  <span className="font-medium">{label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-brand" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-subtle">
          <div className="text-xs text-tertiary">
            <p>© 2024 Node Flow</p>
            <p>Interactive DSA Learning</p>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-default z-50">
        <div className="flex items-center justify-between h-full px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-inverse" />
            </div>
            <span className="text-lg font-bold text-primary">Node Flow</span>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded relative z-60"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40" 
              onClick={toggleMobileMenu}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute top-full right-4 w-64 bg-surface border border-default rounded-lg shadow-lg z-50">
              <div className="p-4">
                <div className="space-y-2">
                  {navLinks.map(({ to, label, icon: Icon }) => {
                    const isActive = location.pathname === to;
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-3 px-4 py-3 rounded ${
                          isActive
                            ? 'bg-brand-light text-brand border border-brand/20'
                            : 'text-secondary'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-brand' : 'text-tertiary'}`} />
                        <span className="font-medium">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Navbar;