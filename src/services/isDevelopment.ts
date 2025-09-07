// src/services/isDevelopment.ts
export function isDevelopment() {
  return import.meta.env.MODE === 'development';
}
