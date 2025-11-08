
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ManagedImage } from '../src/types/ManagedImage';
import { ImageManager } from '../src/components/ImageManager/index.tsx';
import { CultureInfoProvider } from "../src/contexts/CultureInfoContext";
import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";

const mockImages: ManagedImage[] = [
  { id: '1', url: 'url1', name: 'img1.png', size: 2048, uploadedAt: '2023-10-01T12:00:00Z' },
  { id: '2', url: 'url2', name: 'img2.png', size: 4096, uploadedAt: '2023-10-02T12:00:00Z' },
];

const mockListUserImages = vi.fn(async () => new Promise<Array<ManagedImage>>((resolve) => resolve(mockImages)));
const mockDeleteImage = vi.fn(async () => {});

describe('ImageManager', () => {
  it('renders images from mocked API', async () => {
    const mockToken = 'mock-token';
    const mockOnSelect = vi.fn();
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as unknown as CultureInfo;
    const mockUploadImage = vi.fn();
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <ImageManager
          token={mockToken}
          onSelect={mockOnSelect}
          listUserImages={mockListUserImages}
          deleteImage={mockDeleteImage}
          uploadImage={mockUploadImage}
        />
      </CultureInfoProvider>
    );
    expect(mockListUserImages).toHaveBeenCalledWith(mockToken);
    // Wait for images to appear
    const image1 = await screen.findByRole('img', { name: /img1.png/i });
    expect(image1).toHaveAttribute('src', 'url1');
    const image2 = await screen.findByRole('img', { name: /img2.png/i });
    expect(image2).toHaveAttribute('src', 'url2');
  });
});
