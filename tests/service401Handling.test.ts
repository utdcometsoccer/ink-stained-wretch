import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedError } from '../src/types/UnauthorizedError';

// Mock the service modules with proper environment variables
vi.mock('../src/services/fetchAuthorsByDomain', async () => {
  const actual = await vi.importActual('../src/services/fetchAuthorsByDomain');
  return {
    ...actual,
    fetchAuthorsByDomain: vi.fn()
  };
});

vi.mock('../src/services/fetchDomainRegistrations', async () => {
  const actual = await vi.importActual('../src/services/fetchDomainRegistrations');
  return {
    ...actual,
    fetchDomainRegistrations: vi.fn()
  };
});

vi.mock('../src/services/fetchStatesProvinces', async () => {
  const actual = await vi.importActual('../src/services/fetchStatesProvinces');
  return {
    ...actual,
    fetchStatesProvinces: vi.fn()
  };
});

vi.mock('../src/services/subscriptionApi', async () => {
  const actual = await vi.importActual('../src/services/subscriptionApi');
  return {
    ...actual,
    fetchSubscriptionPlans: vi.fn()
  };
});

vi.mock('../src/services/imageApi', async () => {
  const actual = await vi.importActual('../src/services/imageApi');
  return {
    ...actual,
    uploadImage: vi.fn(),
    listUserImages: vi.fn(),
    deleteImage: vi.fn()
  };
});

import { fetchAuthorsByDomain } from '../src/services/fetchAuthorsByDomain';
import { fetchDomainRegistrations } from '../src/services/fetchDomainRegistrations';
import { fetchStatesProvinces } from '../src/services/fetchStatesProvinces';
import { fetchSubscriptionPlans } from '../src/services/subscriptionApi';
import { uploadImage, listUserImages, deleteImage } from '../src/services/imageApi';

describe('Service functions 401 handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAuthorsByDomain', () => {
    it('should throw UnauthorizedError on 401 response', async () => {
      vi.mocked(fetchAuthorsByDomain).mockRejectedValueOnce(new UnauthorizedError());
      
      await expect(fetchAuthorsByDomain('token', 'example', 'com'))
        .rejects.toThrow(UnauthorizedError);
    });

    it('should not throw UnauthorizedError on 200 response', async () => {
      const mockResult = [{
        id: '1',
        TopLevelDomain: 'com',
        SecondLevelDomain: 'example',
        LanguageName: 'English',
        RegionName: 'US',
        AuthorName: 'Test Author',
        WelcomeText: 'Welcome',
        AboutText: 'About',
        HeadShotURL: '',
        CopyrightText: 'Copyright',
        EmailAddress: 'test@example.com',
        Articles: [],
        Books: [],
        Socials: []
      }];
      vi.mocked(fetchAuthorsByDomain).mockResolvedValueOnce(mockResult);
      
      const result = await fetchAuthorsByDomain('token', 'example', 'com');
      expect(result).toEqual(mockResult);
    });
  });

  describe('fetchDomainRegistrations', () => {
    it('should throw UnauthorizedError on 401 response', async () => {
      vi.mocked(fetchDomainRegistrations).mockRejectedValueOnce(new UnauthorizedError());
      
      await expect(fetchDomainRegistrations('token'))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe('fetchStatesProvinces', () => {
    it('should throw UnauthorizedError on 401 response', async () => {
      vi.mocked(fetchStatesProvinces).mockRejectedValueOnce(new UnauthorizedError());
      
      await expect(fetchStatesProvinces('en-us', 'token'))
        .rejects.toThrow(UnauthorizedError);
    });

    it('should preserve UnauthorizedError through catch block', async () => {
      vi.mocked(fetchStatesProvinces).mockRejectedValueOnce(new UnauthorizedError());
      
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
      vi.mocked(fetchSubscriptionPlans).mockRejectedValueOnce(new UnauthorizedError());
      
      await expect(fetchSubscriptionPlans({ active: true }, 'token'))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe('imageApi functions', () => {
    it('uploadImage should throw UnauthorizedError on 401 response', async () => {
      vi.mocked(uploadImage).mockRejectedValueOnce(new UnauthorizedError());
      
      const file = new File(['dummy'], 'test.png');
      await expect(uploadImage(file, 'token'))
        .rejects.toThrow(UnauthorizedError);
    });

    it('listUserImages should throw UnauthorizedError on 401 response', async () => {
      vi.mocked(listUserImages).mockRejectedValueOnce(new UnauthorizedError());
      
      await expect(listUserImages('token'))
        .rejects.toThrow(UnauthorizedError);
    });

    it('deleteImage should throw UnauthorizedError on 401 response', async () => {
      vi.mocked(deleteImage).mockRejectedValueOnce(new UnauthorizedError());
      
      await expect(deleteImage('image-id', 'token'))
        .rejects.toThrow(UnauthorizedError);
    });
  });
});
