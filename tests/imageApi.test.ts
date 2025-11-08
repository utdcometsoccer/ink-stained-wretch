

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as imageApi from '../src/services/imageApi';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('imageApi', () => {
  it('uploadImage calls fetch and returns data', async () => {
    const mockData = { id: '1', url: 'url', name: 'file.png', size: 123 };
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockData)
    };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as Response);
    const file = new File(['dummy'], 'file.png');
    const result = await imageApi.uploadImage(file, 'token');
    expect(fetchMock).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('listUserImages calls fetch and returns data', async () => {
    const mockData = [{ id: '1', url: 'url', name: 'file.png', size: 123, uploadedAt: 'now' }];
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockData)
    };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as Response);
    const result = await imageApi.listUserImages('token');
    expect(fetchMock).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('deleteImage calls fetch', async () => {
    const mockResponse = { ok: true };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse as Response);
    await imageApi.deleteImage('1', 'token');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/1'), expect.objectContaining({ method: 'DELETE' }));
  });
});
