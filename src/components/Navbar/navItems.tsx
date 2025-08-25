import type { NavItem } from './NavItem';

export const navItems: NavItem[] = [
    { state: 'chooseCulture', label: 'Culture', icon: '🌍', description: 'Choose Language & Region' },
    { state: 'createAccount', label: 'Sign Up', icon: '👤', description: 'Create Account' },
    { state: 'login', label: 'Login', icon: '🔑', description: 'Sign In' },
    { state: 'domainRegistration', label: 'Domain', icon: '🌐', description: 'Register Domain' },
    { state: 'authorPage', label: 'Author', icon: '✍️', description: 'Author Page' },
    { state: 'chooseSubscription', label: 'Plans', icon: '💎', description: 'Choose Plan' },
    { state: 'checkout', label: 'Checkout', icon: '💳', description: 'Complete Purchase' },
    { state: 'thankYou', label: 'Success', icon: '✅', description: 'Thank You' }
];
