import { useMsal } from '@azure/msal-react';
import { type FC, useEffect, useState } from 'react';
import type { UIStates } from '../../types/UIStates';
import './Navbar.css';
import type { NavbarProps } from './NavbarProps';
import { navItems } from './navItems';

export const Navbar: FC<NavbarProps> = ({ currentState, dispatch }) => {
    const { accounts } = useMsal();

    // Determine authentication state
    const isAuthenticated = accounts && accounts.length > 0;

    // Update reducer state if authentication changes
    useEffect(() => {
        dispatch({ type: 'UPDATE_STATE', payload: { isAuthenticated } });
    }, [isAuthenticated, dispatch]);

    // Clone navItems and update login navitem text/icon based on authentication
    const dynamicNavItems = navItems.map(item => {
        if (item.state === 'login') {
            return {
                ...item,
                label: isAuthenticated ? 'Logout' : 'Login',
                icon: isAuthenticated ? '🚪' : '🔑',
                description: isAuthenticated ? 'Sign Out' : 'Sign In / Sign Up'
            };
        }
        return item;
    });
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleNavigation = (uiState: UIStates) => {
        if (uiState === 'chooseCulture') {
            dispatch({ type: 'SET_UI_STATE', payload: { uiState: 'chooseCulture', autoDetect: false } });
        } else {
            dispatch({ type: 'SET_UI_STATE', payload: uiState });
        }
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen((open) => !open);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <button
                        className="brand-button"
                        onClick={() => handleNavigation('chooseCulture')}
                    >
                        📚 Ink Stained Wretches
                    </button>
                </div>
                <div className="navbar-menu">
                    {dynamicNavItems.map((item) => (
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
                            {dynamicNavItems.map((item) => (
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
    )
}

