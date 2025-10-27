import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitDomainRegistration } from '../src/services/submitDomainRegistration';
import { UnauthorizedError } from '../src/types/UnauthorizedError';
import type { DomainRegistration } from '../src/types/DomainRegistration';

describe('submitDomainRegistration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Set up default environment for most tests  
  const setupDefaultEnv = () => {
    vi.stubGlobal('import.meta', {
      env: {
        VITE_DOMAIN_REGISTRATION_SUBMIT_API_URL: 'http://localhost:7072/api/domain-registrations'
      }
    });
  };

  const mockDomainRegistration: DomainRegistration = {
    domain: {
      topLevelDomain: 'com',
      secondLevelDomain: 'example'
    },
    contactInformation: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      emailAddress: 'john@example.com',
      telephoneNumber: '555-1234'
    }
  };

  it('should successfully submit domain registration with access token', async () => {
    setupDefaultEnv();
    
    const mockResponse = {
      status: 200,
      ok: true,
      json: vi.fn().mockResolvedValue({ ...mockDomainRegistration, id: '123' })
    } as unknown as Response;
    
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
    
    const result = await submitDomainRegistration(mockDomainRegistration, 'test-token');
    
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:7072/api/domain-registrations',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer test-token'
        }),
        body: JSON.stringify(mockDomainRegistration)
      })
    );
    expect(result).toEqual({ ...mockDomainRegistration, id: '123' });
  });

  it('should successfully submit domain registration without access token', async () => {
    setupDefaultEnv();
    
    const mockResponse = {
      status: 200,
      ok: true,
      json: vi.fn().mockResolvedValue({ ...mockDomainRegistration, id: '456' })
    } as unknown as Response;
    
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
    
    await submitDomainRegistration(mockDomainRegistration);
    
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:7072/api/domain-registrations',
      expect.objectContaining({
        method: 'POST',
        headers: expect.not.objectContaining({
          'Authorization': expect.anything()
        }),
        body: JSON.stringify(mockDomainRegistration)
      })
    );
  });

  it('should throw UnauthorizedError on 401 response', async () => {
    setupDefaultEnv();
    
    const mockResponse = {
      status: 401,
      ok: false
    } as Response;
    
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
    
    await expect(submitDomainRegistration(mockDomainRegistration, 'expired-token'))
      .rejects.toThrow(UnauthorizedError);
  });

  it('should throw error on non-200 response', async () => {
    setupDefaultEnv();
    
    const mockResponse = {
      status: 500,
      ok: false
    } as Response;
    
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
    
    await expect(submitDomainRegistration(mockDomainRegistration, 'test-token'))
      .rejects.toThrow('API error: 500');
  });
});
