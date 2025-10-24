import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAmazonBooks } from "../src/services/fetchAmazonBooks";
import type { AmazonProductsApiResponse } from "../src/types/AmazonProductsApi";

describe("fetchAmazonBooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
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

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Mock the env var
    import.meta.env.VITE_AMAZON_BOOKS_API_URL = "https://api.example.com";

    const books = await fetchAmazonBooks("Stephen King", 1);

    expect(books).toHaveLength(1);
    expect(books[0].ASIN).toBe("B001EXAMPLE");
    expect(books[0].ItemInfo?.Title?.DisplayValue).toBe("The Shining");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/Stephen%20King?page=1",
      {
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer 1"
        }
      }
    );
  });

  it("should throw error on fetch error", async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));
    import.meta.env.VITE_AMAZON_BOOKS_API_URL = "https://api.example.com";

    await expect(fetchAmazonBooks("Stephen King", 1)).rejects.toThrow("Network error");
  });

  it("should throw error when API URL is not configured", async () => {
    import.meta.env.VITE_AMAZON_BOOKS_API_URL = "";

    await expect(fetchAmazonBooks("Stephen King", 1)).rejects.toThrow("API URL is not defined in VITE_AMAZON_BOOKS_API_URL environment variable");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should throw error for non-ok response", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    });
    import.meta.env.VITE_AMAZON_BOOKS_API_URL = "https://api.example.com";

    await expect(fetchAmazonBooks("Stephen King", 1)).rejects.toThrow("Amazon API error: 404");
  });
});
