import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitDomainRegistration } from '../src/services/submitDomainRegistration';
import { UnauthorizedError } from '../src/types/UnauthorizedError';
import type { DomainRegistration } from '../src/types/DomainRegistration';

// Mock the getBrowserCultureWithFallback function
vi.mock('../src/services/getBrowserCultureWithFallback', () => ({
  getBrowserCultureWithFallback: vi.fn().mockReturnValue({
    Language: 'en',
    Country: 'US',
    Culture: 'en-US'
  })
}));

describe('submitDomainRegistration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      country: 'US',
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

  describe('Country validation tests', () => {
    beforeEach(() => {
      setupDefaultEnv();
    });

    it('should submit domain registration with country field included', async () => {
      const mockResponse = {
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue({ ...mockDomainRegistration, id: '789' })
      } as unknown as Response;
      
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
      
      await submitDomainRegistration(mockDomainRegistration, 'test-token');
      
      // Verify the request body contains the country field
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

      // Parse the submitted body and verify country is present
      const submittedBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      expect(submittedBody.contactInformation.country).toBe('US');
    });

    it('should handle domain registration with different country codes', async () => {
      const domainRegistrationWithCanada: DomainRegistration = {
        ...mockDomainRegistration,
        contactInformation: {
          ...mockDomainRegistration.contactInformation!,
          country: 'CA',
          state: 'ON'
        }
      };

      const mockResponse = {
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue({ ...domainRegistrationWithCanada, id: '101' })
      } as unknown as Response;
      
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
      
      await submitDomainRegistration(domainRegistrationWithCanada, 'test-token');
      
      const submittedBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      expect(submittedBody.contactInformation.country).toBe('CA');
      expect(submittedBody.contactInformation.state).toBe('ON');
    });

    it('should handle domain registration with undefined country by setting it from browser culture', async () => {
      const domainRegistrationNoCountry: DomainRegistration = {
        ...mockDomainRegistration,
        contactInformation: {
          ...mockDomainRegistration.contactInformation!,
          country: undefined
        }
      };

      const mockResponse = {
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue({ ...domainRegistrationNoCountry, id: '102' })
      } as unknown as Response;
      
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
      
      await submitDomainRegistration(domainRegistrationNoCountry, 'test-token');
      
      const submittedBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      // When country is undefined, it should be automatically set from browser culture (defaults to 'US')
      expect(submittedBody.contactInformation).toHaveProperty('country');
      expect(submittedBody.contactInformation.country).toBe('US');
    });

    it('should handle domain registration with null country', async () => {
      const domainRegistrationNullCountry: DomainRegistration = {
        ...mockDomainRegistration,
        contactInformation: {
          ...mockDomainRegistration.contactInformation!,
          country: null as any // Explicitly set to null
        }
      };

      const mockResponse = {
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue({ ...domainRegistrationNullCountry, id: '103' })
      } as unknown as Response;
      
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
      
      await submitDomainRegistration(domainRegistrationNullCountry, 'test-token');
      
      const submittedBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      // When country is null, JSON.stringify includes it as null
      expect(submittedBody.contactInformation).toHaveProperty('country', null);
    });

    it('should submit all required contact information fields including country', async () => {
      const completeRegistration: DomainRegistration = {
        domain: {
          topLevelDomain: 'org',
          secondLevelDomain: 'nonprofit'
        },
        contactInformation: {
          firstName: 'Jane',
          lastName: 'Smith',
          address: '456 Oak Avenue',
          address2: 'Suite 200',
          city: 'Springfield',
          state: 'IL',
          country: 'US',
          zipCode: '62701',
          emailAddress: 'jane.smith@nonprofit.org',
          telephoneNumber: '555-9876'
        }
      };

      const mockResponse = {
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue({ ...completeRegistration, id: '103' })
      } as unknown as Response;
      
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
      
      await submitDomainRegistration(completeRegistration, 'test-token');
      
      const submittedBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      const contactInfo = submittedBody.contactInformation;
      
      // Verify all contact information fields are present
      expect(contactInfo.firstName).toBe('Jane');
      expect(contactInfo.lastName).toBe('Smith');
      expect(contactInfo.address).toBe('456 Oak Avenue');
      expect(contactInfo.address2).toBe('Suite 200');
      expect(contactInfo.city).toBe('Springfield');
      expect(contactInfo.state).toBe('IL');
      expect(contactInfo.country).toBe('US');
      expect(contactInfo.zipCode).toBe('62701');
      expect(contactInfo.emailAddress).toBe('jane.smith@nonprofit.org');
      expect(contactInfo.telephoneNumber).toBe('555-9876');
    });

    it('should preserve country field through the entire submission process', async () => {
      const registrationWithMexico: DomainRegistration = {
        domain: {
          topLevelDomain: 'mx',
          secondLevelDomain: 'empresa'
        },
        contactInformation: {
          firstName: 'Carlos',
          lastName: 'Rodriguez',
          address: 'Av. Reforma 123',
          city: 'Ciudad de México',
          state: 'CDMX',
          country: 'MX',
          zipCode: '01000',
          emailAddress: 'carlos@empresa.mx',
          telephoneNumber: '+52-55-1234-5678'
        }
      };

      const expectedResponse = { ...registrationWithMexico, id: '104' };
      const mockResponse = {
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue(expectedResponse)
      } as unknown as Response;
      
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
      
      const result = await submitDomainRegistration(registrationWithMexico, 'test-token');
      
      // Verify the request was made with correct country
      const submittedBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      expect(submittedBody.contactInformation.country).toBe('MX');
      
      // Verify the response also includes the country
      expect(result.contactInformation?.country).toBe('MX');
    });

    it('should validate country field is serialized correctly in JSON', async () => {
      const mockResponse = {
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue({ ...mockDomainRegistration, id: '105' })
      } as unknown as Response;
      
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
      
      await submitDomainRegistration(mockDomainRegistration, 'test-token');
      
      // Get the raw body that was sent
      const rawBody = fetchSpy.mock.calls[0][1]?.body as string;
      
      // Verify it's valid JSON
      expect(() => JSON.parse(rawBody)).not.toThrow();
      
      // Verify the country field exists in the JSON string
      expect(rawBody).toContain('"country":"US"');
      
      // Verify the JSON structure is correct
      const parsedBody = JSON.parse(rawBody);
      expect(parsedBody).toHaveProperty('contactInformation');
      expect(parsedBody.contactInformation).toHaveProperty('country', 'US');
    });

    it('should use browser culture country when contactInformation country is undefined', async () => {
      // Get the mocked function and override its implementation for this test
      const getBrowserCultureWithFallback = await import('../src/services/getBrowserCultureWithFallback');
      vi.mocked(getBrowserCultureWithFallback.getBrowserCultureWithFallback).mockReturnValueOnce({
        Language: 'fr',
        Country: 'CA',
        Culture: 'fr-CA'
      });

      const domainRegistrationNoBrowserCountry: DomainRegistration = {
        ...mockDomainRegistration,
        contactInformation: {
          ...mockDomainRegistration.contactInformation!,
          country: undefined // This should trigger browser country detection
        }
      };

      const mockResponse = {
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue({ ...domainRegistrationNoBrowserCountry, id: '104' })
      } as unknown as Response;
      
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);
      
      await submitDomainRegistration(domainRegistrationNoBrowserCountry, 'test-token');
      
      const submittedBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      // Should use the mocked browser country 'CA' instead of default 'US'
      expect(submittedBody.contactInformation).toHaveProperty('country', 'CA');
      expect(getBrowserCultureWithFallback.getBrowserCultureWithFallback).toHaveBeenCalledTimes(1);
    });
  });
});
