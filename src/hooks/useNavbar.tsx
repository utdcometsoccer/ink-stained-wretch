import { useMsal } from '@azure/msal-react';
import { useEffect, useState, type Dispatch } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { navItems } from '../components/Navbar/navItems';
import type { UIStates } from '../types/UIStates';
import type { Action } from '../reducers/appReducer';

export function useNavbarLogic(dispatch: Dispatch<Action>) {
    const { accounts } = useMsal();
    const isAuthenticated = accounts && accounts.length > 0;
    useEffect(() => {
        dispatch({ type: 'UPDATE_STATE', payload: { isAuthenticated } });
    }, [isAuthenticated, dispatch]);

    const dynamicNavItems = navItems.map(item => {
        if (item.state === 'login') {
            return {
                ...item,
                label: isAuthenticated ? 'Logout' : 'Login',
                icon: isAuthenticated ? <LogoutIcon fontSize="small" /> : <LoginIcon fontSize="small" />,
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

    return {
        dynamicNavItems,
        isMenuOpen,
        handleNavigation,
        toggleMenu,
        closeMenu,
        setMenuOpen,
    };
}
