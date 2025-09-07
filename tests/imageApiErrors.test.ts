
import { describe, it, expect } from 'vitest';
import { getImageApiErrorMessage } from '../src/services/imageApiErrors';

describe('getImageApiErrorMessage', () => {
  it('returns custom error for 400', () => {
    const error = { response: { status: 400, data: { error: 'Custom 400 error' } } };
    expect(getImageApiErrorMessage(error)).toBe('Custom 400 error');
  });

  it('returns default message for 400 if no custom error', () => {
    const error = { response: { status: 400, data: {} } };
    expect(getImageApiErrorMessage(error)).toBe('File too large.');
  });

  it('returns custom error for 403', () => {
    const error = { response: { status: 403, data: { error: 'Custom 403 error' } } };
    expect(getImageApiErrorMessage(error)).toBe('Custom 403 error');
  });

  it('returns default message for 403 if no custom error', () => {
    const error = { response: { status: 403, data: {} } };
    expect(getImageApiErrorMessage(error)).toBe('Upload limit reached.');
  });

  it('returns not found for 404', () => {
    const error = { response: { status: 404 } };
    expect(getImageApiErrorMessage(error)).toBe('Image not found.');
  });

  it('returns unauthorized for 401', () => {
    const error = { response: { status: 401 } };
    expect(getImageApiErrorMessage(error)).toBe('Unauthorized. Please log in.');
  });

  it('returns unknown error for other status', () => {
    const error = { response: { status: 500 } };
    expect(getImageApiErrorMessage(error)).toBe('An unknown error occurred.');
  });

  it('returns unknown error for missing response', () => {
    const error = {};
    expect(getImageApiErrorMessage(error)).toBe('An unknown error occurred.');
  });
});
