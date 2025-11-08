import { type FC } from 'react';
import { useLocalizationContext } from '../../hooks/useLocalizationContext.ts';
import { useNavbarLogic } from '../../hooks/useNavbar.tsx';
import { useTrackComponent } from '../../hooks/useTrackComponent.ts';
import { useCultureInfo } from '../../hooks/useCultureInfo';
import './Navbar.css';
import type { NavbarProps } from './NavbarProps';

export const Navbar: FC<NavbarProps> = ({ currentState, dispatch, state }) => {
    const { culture } = useCultureInfo();
    const localizedNavbar = useLocalizationContext().Navbar;
    useTrackComponent('Navbar', { currentState, dispatch, state, culture });
    const {
        dynamicNavItems,
        isMenuOpen,
        handleNavigation,
        toggleMenu,
        closeMenu,
    } = useNavbarLogic(state, dispatch);
    
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <button
                        className="brand-button"
                        onClick={() => handleNavigation('chooseCulture')}
                    >
                        📚 {localizedNavbar?.brand ?? 'Ink Stained Wretches'}
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
                            <h3>{localizedNavbar?.navigation ?? 'Navigation'}</h3>
                            <button className="close-button" onClick={closeMenu}>
                                {localizedNavbar?.close ?? '✕'}
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

