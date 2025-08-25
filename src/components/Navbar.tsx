import { useState } from 'react';
import type { UIStates } from '../types/UIStates';
import type { Action } from '../reducers/appReducer';
import './Navbar.css';

interface NavbarProps {
  currentState: UIStates;
  dispatch: React.Dispatch<Action>;
}

interface NavItem {
  state: UIStates;
  label: string;
  icon: string;
  description: string;
}

const navItems: NavItem[] = [
  { state: 'chooseCulture', label: 'Culture', icon: '🌍', description: 'Choose Language & Region' },
  { state: 'createAccount', label: 'Sign Up', icon: '👤', description: 'Create Account' },
  { state: 'login', label: 'Login', icon: '🔑', description: 'Sign In' },
  { state: 'domainRegistration', label: 'Domain', icon: '🌐', description: 'Register Domain' },
  { state: 'authorPage', label: 'Author', icon: '✍️', description: 'Author Page' },
  { state: 'chooseSubscription', label: 'Plans', icon: '💎', description: 'Choose Plan' },
  { state: 'checkout', label: 'Checkout', icon: '💳', description: 'Complete Purchase' },
  { state: 'thankYou', label: 'Success', icon: '✅', description: 'Thank You' }
];

export function Navbar({ currentState, dispatch }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (state: UIStates) => {
    if (state === 'chooseCulture') {
      // Set autodetect to false for culture selection
      dispatch({ type: 'SET_UI_STATE', payload: { uiState: 'chooseCulture', autoDetect: false } });
    } else {
      dispatch({ type: 'SET_UI_STATE', payload: state });
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
    // ...existing code...
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <button 
            className="brand-button"
            onClick={() => handleNavigation('chooseCulture')}
          >
            📚 Ink Stained Wretch
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          {navItems.map((item) => (
            <button
              key={item.state}
              className={`nav-item ${currentState === item.state ? 'active' : ''}`}
              onClick={() => handleNavigation(item.state)}
              title={item.description}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Navigation</h3>
              <button className="close-button" onClick={closeMenu}>
                ✕
              </button>
            </div>
            <div className="mobile-menu-items">
              {navItems.map((item) => (
                <button
                  key={item.state}
                  className={`mobile-nav-item ${currentState === item.state ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.state)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <div className="nav-text">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
