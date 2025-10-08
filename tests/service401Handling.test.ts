import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAuthorsByDomain } from '../src/services/fetchAuthorsByDomain';
import { fetchDomainRegistrations } from '../src/services/fetchDomainRegistrations';
import { fetchStatesProvinces } from '../src/services/fetchStatesProvinces';
import { fetchSubscriptionPlans } from '../src/services/subscriptionApi';
import { uploadImage, listUserImages, deleteImage } from '../src/services/imageApi';
import { UnauthorizedError } from '../src/types/UnauthorizedError';

describe('Service functions 401 handling', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock environment variables
    import.meta.env.VITE_AUTHOR_API_URL = 'http://test.com/api/authors';
    import.meta.env.VITE_USER_DOMAIN_REGISTRATIONS_API_URL = 'http://test.com/api/domains';
    import.meta.env.VITE_STATES_PROVINCES_API_URL = 'http://test.com/api/states';
    import.meta.env.VITE_SUBSCRIPTION_PLANS_API_URL = 'http://test.com/api/plans';
  });

  describe('fetchAuthorsByDomain', () => {
    it('should throw UnauthorizedError on 401 response', async () => {
      const mockResponse = {
        status: 401,
        ok: false
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as any);
      
      await expect(fetchAuthorsByDomain('token', 'example', 'com'))
        .rejects.toThrow(UnauthorizedError);
    });

    it('should not throw UnauthorizedError on 200 response', async () => {
      const mockResponse = {
        status: 200,
        ok: true,
        json: vi.fn().mockResolvedValue([{ id: '1', AuthorName: 'Test' }])
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as any);
      
      const result = await fetchAuthorsByDomain('token', 'example', 'com');
      expect(result).toEqual([{ id: '1', AuthorName: 'Test' }]);
    });
  });

  describe('fetchDomainRegistrations', () => {
    it('should throw UnauthorizedError on 401 response', async () => {
      const mockResponse = {
        status: 401,
        ok: false
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as any);
      
      await expect(fetchDomainRegistrations('token'))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe('fetchStatesProvinces', () => {
    it('should throw UnauthorizedError on 401 response', async () => {
      const mockResponse = {
        status: 401,
        ok: false
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as any);
      
      await expect(fetchStatesProvinces('en-us', 'token'))
        .rejects.toThrow(UnauthorizedError);
    });

    it('should preserve UnauthorizedError through catch block', async () => {
      const mockResponse = {
        status: 401,
        ok: false
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as any);
      
      try {
        await fetchStatesProvinces('en-us', 'token');
        expect.fail('Should have thrown UnauthorizedError');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
      }
    });
  });

  describe('fetchSubscriptionPlans', () => {
    it('should throw UnauthorizedError on 401 response', async () => {
      const mockResponse = {
        status: 401,
        ok: false
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as any);
      
      await expect(fetchSubscriptionPlans({ active: true }, 'token'))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe('imageApi functions', () => {
    it('uploadImage should throw UnauthorizedError on 401 response', async () => {
      const mockResponse = {
        status: 401,
        ok: false
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as any);
      
      const file = new File(['dummy'], 'test.png');
      await expect(uploadImage(file, 'token'))
        .rejects.toThrow(UnauthorizedError);
    });

    it('listUserImages should throw UnauthorizedError on 401 response', async () => {
      const mockResponse = {
        status: 401,
        ok: false
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as any);
      
      await expect(listUserImages('token'))
        .rejects.toThrow(UnauthorizedError);
    });

    it('deleteImage should throw UnauthorizedError on 401 response', async () => {
      const mockResponse = {
        status: 401,
        ok: false
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as any);
      
      await expect(deleteImage('image-id', 'token'))
        .rejects.toThrow(UnauthorizedError);
    });
  });
});
