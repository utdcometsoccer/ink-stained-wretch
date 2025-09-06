import type { NavItem } from './NavItem';
import LanguageIcon from '@mui/icons-material/Language';
import LoginIcon from '@mui/icons-material/Login';
import PublicIcon from '@mui/icons-material/Public';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DiamondIcon from '@mui/icons-material/Diamond';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const navItems: NavItem[] = [
    { state: 'chooseCulture', label: 'Culture', icon: <LanguageIcon fontSize="small" />, description: 'Choose Language & Region' },
    { state: 'login', label: 'Login', icon: <LoginIcon fontSize="small" />, description: 'Sign In / Sign Up' },
    { state: 'domainRegistration', label: 'Domain', icon: <PublicIcon fontSize="small" />, description: 'Register Domain' },
    { state: 'authorPage', label: 'Author', icon: <EditNoteIcon fontSize="small" />, description: 'Author Page' },
    { state: 'chooseSubscription', label: 'Plans', icon: <DiamondIcon fontSize="small" />, description: 'Choose Plan' },
    { state: 'checkout', label: 'Checkout', icon: <CreditCardIcon fontSize="small" />, description: 'Complete Purchase' },
    { state: 'thankYou', label: 'Success', icon: <CheckCircleIcon fontSize="small" />, description: 'Thank You' }
];
