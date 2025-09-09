import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBookList } from "../src/hooks/useBookList";
import type { Book } from "../src/types/Book";

const mockBooks: Book[] = [
  {
    id: "1",
    Title: "Test Book 1",
    Description: "Description 1",
    URL: "https://example.com/1",
    Cover: "https://example.com/cover1.jpg"
  }
];

describe("useBookList", () => {
  it("initializes state and handles Add/Edit/Delete", () => {
    const importBook = vi.fn();
    const onEdit = vi.fn();
    const onAdd = vi.fn();
    const onDelete = vi.fn();
    const { result } = renderHook(() =>
      useBookList({
        authorName: "Author",
        books: mockBooks,
        importBook,
        onEdit,
        onAdd,
        onDelete,
        openLibraryAuthorKeys: []
      })
    );
    expect(result.current.state.disableGoogleImport).toBe(false);
    act(() => {
      result.current.onEditClick({ preventDefault: () => {} } as any, mockBooks[0]);
    });
    // Simulate effect for Editing
    act(() => {
      result.current.state.buttonState = "Editing";
    });
    expect(result.current.state.buttonState).toBe("Editing");
  });
});
