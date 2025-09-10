import type { NavItem } from '../../types/NavItem';
import LanguageIcon from '@mui/icons-material/Language';
import LoginIcon from '@mui/icons-material/Login';
import PublicIcon from '@mui/icons-material/Public';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DiamondIcon from '@mui/icons-material/Diamond';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getLocalizedText } from '../../services/localization';

export async function getNavItems(culture: string = 'en-US'): Promise<NavItem[]> {
    const cultureText = await getLocalizedText(culture);
    const localizedNavbar = cultureText?.Navbar;
    const localized = localizedNavbar?.navItems;
    return [
        { state: 'chooseCulture', label: localized?.chooseCulture.label ?? 'Culture', icon: <LanguageIcon fontSize="small" />, description: localized?.chooseCulture.description ?? 'Choose Language & Region' },
        { state: 'login', label: localized?.login.label ?? 'Login', icon: <LoginIcon fontSize="small" />, description: localized?.login.description ?? 'Sign In / Sign Up' },
        { state: 'domainRegistration', label: localized?.domainRegistration.label ?? 'Domain', icon: <PublicIcon fontSize="small" />, description: localized?.domainRegistration.description ?? 'Register Domain' },
        { state: 'authorPage', label: localized?.authorPage.label ?? 'Author', icon: <EditNoteIcon fontSize="small" />, description: localized?.authorPage.description ?? 'Author Page' },
        { state: 'chooseSubscription', label: localized?.chooseSubscription.label ?? 'Plans', icon: <DiamondIcon fontSize="small" />, description: localized?.chooseSubscription.description ?? 'Choose Plan' },
        { state: 'checkout', label: localized?.checkout.label ?? 'Checkout', icon: <CreditCardIcon fontSize="small" />, description: localized?.checkout.description ?? 'Complete Purchase' },
        { state: 'thankYou', label: localized?.thankYou.label ?? 'Success', icon: <CheckCircleIcon fontSize="small" />, description: localized?.thankYou.description ?? 'Thank You' }
    ];
}
