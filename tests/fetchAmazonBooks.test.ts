import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAmazonBooks } from "../src/services/fetchAmazonBooks";
import type { AmazonProductsApiResponse } from "../src/types/AmazonProductsApi";

describe("fetchAmazonBooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('import.meta', {
      env: {
        VITE_AMAZON_BOOKS_API_URL: "http://localhost:7072/api/amazon/books/author"
      }
    });
  });

  it("should fetch books successfully", async () => {
    const mockResponse: AmazonProductsApiResponse = {
      SearchResult: {
        Items: [
          {
            ASIN: "B001EXAMPLE",
            DetailPageURL: "https://www.amazon.com/dp/B001EXAMPLE",
            Images: {
              Primary: {
                Medium: {
                  URL: "https://m.media-amazon.com/images/I/example.jpg",
                  Height: 160,
                  Width: 107
                }
              }
            },
            ItemInfo: {
              ByLineInfo: {
                Contributors: [
                  {
                    Name: "Stephen King",
                    Role: "Author"
                  }
                ]
              },
              Title: {
                DisplayValue: "The Shining"
              }
            },
            Offers: {
              Listings: [
                {
                  Price: {
                    Amount: 9.99,
                    Currency: "USD",
                    DisplayAmount: "$9.99"
                  }
                }
              ]
            }
          }
        ],
        TotalResultCount: 150
      }
    };

    (vi.mocked(globalThis.fetch)).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const books = await fetchAmazonBooks("Stephen King", "test-token", 1);

    expect(books).toHaveLength(1);
    expect(books[0].ASIN).toBe("B001EXAMPLE");
    expect(books[0].ItemInfo?.Title?.DisplayValue).toBe("The Shining");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:7072/api/amazon/books/author/Stephen%20King?page=1",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: "Bearer test-token"
        })
      })
    );
  });

  it("should throw error on fetch error", async () => {
    (vi.mocked(globalThis.fetch)).mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchAmazonBooks("Stephen King", "test-token", 1)).rejects.toThrow("Network error");
  });

  it("should throw error on non-ok response", async () => {
    (vi.mocked(globalThis.fetch)).mockResolvedValueOnce({
      ok: false,
      status: 404
    } as Response);

    await expect(fetchAmazonBooks("Stephen King", "test-token", 1))
      .rejects.toThrow("Amazon API error: 404");
  });
});
