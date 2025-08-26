// Returns true if the phone number is valid, false otherwise
export function validatePhone(phone: string): boolean {
    // Simple international format: allows +, digits, spaces, dashes, parentheses, min 7 chars
    const phoneRegex = /^\+?[0-9\s\-().]{7,}$/;
    return phoneRegex.test(phone);
}
