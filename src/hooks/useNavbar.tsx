import { useMsal } from '@azure/msal-react';
import { useEffect, useState, type Dispatch } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import type { UIStates } from '../types/UIStates';
import type { Action } from '../reducers/appReducer';
import type { State } from '../types/State';
import { getNavItems } from '../components/Navbar/navItems';
import type { NavItem } from '../types/NavItem';


export function useNavbarLogic(state: State, dispatch: Dispatch<Action>) {
    const { accounts } = useMsal();
    const isAuthenticated = accounts && accounts.length > 0;
    const [dynamicNavItems, setDynamicNavItems] = useState<NavItem[]>([]);
    useEffect(() => {
        (async () => {
            const navItems = await getNavItems(state.cultureInfo?.Culture || 'en-US');
            setDynamicNavItems(navItems.map(item => {
                if (item.state === 'login') {
                    return {
                        ...item,
                        label: isAuthenticated ? 'Logout' : 'Login',
                        icon: isAuthenticated ? <LogoutIcon fontSize="small" /> : <LoginIcon fontSize="small" />,
                        description: isAuthenticated ? 'Sign Out' : 'Sign In / Sign Up'
                    };
                }
                return item;

            }));
        })();
        dispatch({ type: 'UPDATE_STATE', payload: { isAuthenticated } });
    }, [isAuthenticated, dispatch]);


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
