import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LanguageIcon from '@mui/icons-material/Language';
import LoginIcon from '@mui/icons-material/Login';
import PublicIcon from '@mui/icons-material/Public';
import type { NavItem } from '../../types/NavItem';
import type { LocalizedText } from '../../types/LocalizedText';

export function getNavItems(localization: LocalizedText): NavItem[] {
    const localizedNavbar = localization?.Navbar;
    const localized = localizedNavbar?.navItems;
    return [
        { state: 'chooseCulture', label: localized?.chooseCulture.label ?? 'Culture', icon: <LanguageIcon fontSize="small" />, description: localized?.chooseCulture.description ?? 'Choose Language & Region' },
        { state: 'login', label: localized?.login.label ?? 'Login', icon: <LoginIcon fontSize="small" />, description: localized?.login.description ?? 'Sign In / Sign Up' },
        { state: 'domainRegistration', label: localized?.domainRegistration.label ?? 'Domain', icon: <PublicIcon fontSize="small" />, description: localized?.domainRegistration.description ?? 'Register Domain' },
        { state: 'authorPage', label: localized?.authorPage.label ?? 'Author', icon: <EditNoteIcon fontSize="small" />, description: localized?.authorPage.description ?? 'Author Page' },
        { state: 'subscribe', label: localized?.subscribe.label ?? 'Subscribe', icon: <CardMembershipIcon fontSize="small" />, description: localized?.subscribe.description ?? 'Subscribe' },
        { state: 'thankYou', label: localized?.thankYou.label ?? 'Success', icon: <CheckCircleIcon fontSize="small" />, description: localized?.thankYou.description ?? 'Thank You' }
    ];
}
