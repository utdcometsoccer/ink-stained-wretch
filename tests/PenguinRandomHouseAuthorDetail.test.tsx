import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { PenguinRandomHouseAuthorDetail } from "../src/components/PenguinRandomHouseAuthorDetail";
import type { AuthorResult } from "../src/types/PenguinRandomHouse";
import type { PenguinRandomHouseAuthorDetailText } from "../src/types/LocalizedText";

describe("PenguinRandomHouseAuthorDetail", () => {
    const mockAuthor: AuthorResult = {
        docType: "author",
        id: "1",
        key: "key-1",
        name: "John Doe",
        score: 98,
        url: "authors/john-doe",
        domain: ["penguinrandomhouse.com"],
        title: "Author Title",
        description: "A famous author.",
        author: null,
        authorFirst: "John",
        authorLast: "Doe",
        photoCredit: "PRH",
        onTour: true,
        seriesAuthor: "Series Author",
        seriesIsbn: "1234567890",
        seriesCount: 3,
        keywordId: "keyword-1",
        _embeds: null,
        _links: []
    };

        const mockText: PenguinRandomHouseAuthorDetailText = {
            title: "Penguin Random House Author Details",
            name: "Name",
            score: "Score",
            url: "URL",
            domain: "Domain",
            titleField: "Title",
            description: "Description",
            authorFirst: "First Name",
            authorLast: "Last Name",
            photoCredit: "Photo Credit",
            onTour: "On Tour",
            seriesAuthor: "Series Author",
            seriesIsbn: "Series ISBN",
            seriesCount: "Series Count",
            keywordId: "Keyword ID",
            save: "Save",
            cancel: "Cancel"
        };

    it("renders all author fields and localized labels", () => {
        render(
            <PenguinRandomHouseAuthorDetail
                author={mockAuthor}
                onSave={vi.fn()}
                onCancel={vi.fn()}
            />
        );
        expect(screen.getByText(mockText.title)).toBeInTheDocument();
        expect(screen.getByText(mockText.name)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.name)).toBeInTheDocument();
        expect(screen.getByText(mockText.score)).toBeInTheDocument();
        expect(screen.getByText(String(mockAuthor.score))).toBeInTheDocument();
        expect(screen.getByText(mockText.url)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.url)).toBeInTheDocument();
        expect(screen.getByText(mockText.domain)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.domain.join(', '))).toBeInTheDocument();
        expect(screen.getByText(mockText.titleField)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.title ?? '')).toBeInTheDocument();
        expect(screen.getByText(mockText.description)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.description ?? '')).toBeInTheDocument();
        expect(screen.getByText(mockText.authorFirst)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.authorFirst ?? '')).toBeInTheDocument();
        expect(screen.getByText(mockText.authorLast)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.authorLast ?? '')).toBeInTheDocument();
        expect(screen.getByText(mockText.photoCredit)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.photoCredit ?? '')).toBeInTheDocument();
        expect(screen.getByText(mockText.onTour)).toBeInTheDocument();
        expect(screen.getByText("Yes")).toBeInTheDocument();
        expect(screen.getByText(mockText.seriesAuthor)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.seriesAuthor ?? '')).toBeInTheDocument();
        expect(screen.getByText(mockText.seriesIsbn)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.seriesIsbn ?? '')).toBeInTheDocument();
        expect(screen.getByText(mockText.seriesCount)).toBeInTheDocument();
        expect(screen.getByText(String(mockAuthor.seriesCount))).toBeInTheDocument();
        expect(screen.getByText(mockText.keywordId)).toBeInTheDocument();
        expect(screen.getByText(mockAuthor.keywordId ?? '')).toBeInTheDocument();
    });

    it("calls onSave and onCancel when buttons are clicked", () => {
        const onSave = vi.fn();
        const onCancel = vi.fn();
        render(
            <PenguinRandomHouseAuthorDetail
                author={mockAuthor}
                onSave={onSave}
                onCancel={onCancel}
            />
        );
        fireEvent.click(screen.getByText(mockText.save));
        expect(onSave).toHaveBeenCalled();
        fireEvent.click(screen.getByText(mockText.cancel));
        expect(onCancel).toHaveBeenCalled();
    });
});
