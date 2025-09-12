import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { PenguinRandomHouseAuthorDetail } from "../src/components/PenguinRandomHouseAuthorDetail";
import type { AuthorResult } from "../src/types/PenguinRandomHouse";
import type { PenguinRandomHouseAuthorDetailText } from "../src/types/LocalizedText";
import { getDefaultLocale } from "../src/services/getDefaultLocale";

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
    const baseURL = 'https://www.penguinrandomhouse.com/';
    const defaultLocale = getDefaultLocale();
    const mockText: PenguinRandomHouseAuthorDetailText = defaultLocale.PenguinRandomHouseAuthorDetail;

    it("renders all author fields and localized labels", async () => {
        render(
            <PenguinRandomHouseAuthorDetail
                author={mockAuthor}
                onSave={vi.fn()}
                onCancel={vi.fn()}
            />
        );
        expect(screen.getByText(mockText.title)).toBeInTheDocument();
        screen.findByText(mockText.name).then((element) => expect(element).toBeInTheDocument());
        expect(screen.getByText(mockAuthor.name)).toBeInTheDocument();
        screen.findByText(mockText.score).then((element) => expect(element).toBeInTheDocument());
        expect(await screen.findByText(String(mockAuthor.score))).toBeInTheDocument();
        screen.findByText(mockText.url).then((element) => expect(element).toBeInTheDocument());
        const anchor = screen.getByRole('link', { name: `${baseURL}${mockAuthor.url}` });
        expect(anchor).toHaveAttribute('href', expect.stringContaining(mockAuthor.url));
        screen.findByText(mockText.domain).then((element) => expect(element).toBeInTheDocument());        
        expect(await screen.findByText(mockAuthor.domain.join(', '))).toBeInTheDocument();
        screen.findByText(mockText.titleField).then((element) => expect(element).toBeInTheDocument());        
        expect(await screen.findByText(mockAuthor.title ?? '')).toBeInTheDocument();
        screen.findByText(mockText.description).then((element) => expect(element).toBeInTheDocument());        
        expect(await screen.findByText(mockAuthor.description ?? '')).toBeInTheDocument();
        screen.findByText(mockText.authorFirst).then((element) => expect(element).toBeInTheDocument());
        expect(await screen.findByText(mockAuthor.authorFirst ?? '')).toBeInTheDocument();
        screen.findByText(mockText.authorLast).then((element) => expect(element).toBeInTheDocument());
        expect(await screen.findByText(mockAuthor.authorLast ?? '')).toBeInTheDocument();
        screen.findByText(mockText.photoCredit).then((element) => expect(element).toBeInTheDocument());
        expect(await screen.findByText(mockAuthor.photoCredit ?? '')).toBeInTheDocument();
        screen.findByText(mockText.onTour).then((element) => expect(element).toBeInTheDocument());
        expect(await screen.findByText("Yes")).toBeInTheDocument();
        expect(await screen.findByText(mockText.seriesAuthor)).toBeInTheDocument();
        expect(await screen.findByText(mockAuthor.seriesAuthor ?? '')).toBeInTheDocument();
        screen.findByText(mockText.seriesIsbn).then((element) => expect(element).toBeInTheDocument());
        expect(await screen.findByText(mockAuthor.seriesIsbn ?? '')).toBeInTheDocument();
        screen.findByText(mockText.seriesCount).then((element) => expect(element).toBeInTheDocument());
        expect(await screen.findByText(String(mockAuthor.seriesCount))).toBeInTheDocument();
        screen.findByText(mockText.keywordId).then((element) => expect(element).toBeInTheDocument());
        expect(await screen.findByText(mockAuthor.keywordId ?? '')).toBeInTheDocument();
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
