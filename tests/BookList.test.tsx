import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookList } from "../src/components/AuthorRegistration/BookList";
import type { Book } from "../src/types/Book";

const mockBooks: Book[] = [
  {
    id: "1",
    Title: "Test Book 1",
    Description: "Description 1",
    URL: "https://example.com/1",
    Cover: "https://example.com/cover1.jpg"
  },
  {
    id: "2",
    Title: "Test Book 2",
    Description: "Description 2",
    URL: "https://example.com/2",
    Cover: "https://example.com/cover2.jpg"
  }
];

describe("BookList", () => {
  it("renders books and buttons", () => {
    render(
      <BookList
        authorName="Author"
        books={mockBooks}
        importBook={vi.fn()}
        onEdit={vi.fn()}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        openLibraryAuthorKeys={[]}
      />
    );
    expect(screen.getByText("Test Book 1")).toBeInTheDocument();
    expect(screen.getByText("Test Book 2")).toBeInTheDocument();
    expect(screen.getByText("Add Book")).toBeInTheDocument();
    expect(screen.getByText("Import Books Open Library")).toBeInTheDocument();
    expect(screen.getByText("Import Google Books")).toBeInTheDocument();
  });

  it("calls onAdd when Add Book button is clicked", () => {
    const onAdd = vi.fn();
    render(
      <BookList
        authorName="Author"
        books={mockBooks}
        importBook={vi.fn()}
        onEdit={vi.fn()}
        onAdd={onAdd}
        onDelete={vi.fn()}
        openLibraryAuthorKeys={[]}
      />
    );
    fireEvent.click(screen.getByTitle("Add Book"));
    expect(onAdd).toHaveBeenCalled();
  });

  it("calls onEdit when Edit button is clicked", () => {
    const onEdit = vi.fn();
    render(
      <BookList
        authorName="Author"
        books={mockBooks}
        importBook={vi.fn()}
        onEdit={onEdit}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        openLibraryAuthorKeys={[]}
      />
    );
    fireEvent.click(screen.getAllByTitle("Edit")[0]);
    expect(onEdit).toHaveBeenCalled();
  });

  it("calls onDelete when Delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <BookList
        authorName="Author"
        books={mockBooks}
        importBook={vi.fn()}
        onEdit={vi.fn()}
        onAdd={vi.fn()}
        onDelete={onDelete}
        openLibraryAuthorKeys={[]}
      />
    );
    fireEvent.click(screen.getAllByTitle("Delete")[0]);
    expect(onDelete).toHaveBeenCalled();
  });
});
