import type { FC } from 'react';
import type { AuthorResult } from '../../types/PenguinRandomHouse';
import { useGetLocalizedText } from '../../hooks/useGetLocalizedText';
import './PenguinRandomHouseAuthorDetail.css';

export interface PenguinRandomHouseAuthorDetailProps {
  author: AuthorResult;
  onSave: (author: AuthorResult) => void;
  onCancel: () => void;
  culture?: string;
}

const PenguinRandomHouseAuthorDetail: FC<PenguinRandomHouseAuthorDetailProps> = ({ author, onSave, onCancel, culture }) => {
  const text = useGetLocalizedText(culture ?? 'en-us')?.PenguinRandomHouseAuthorDetail || {
    title: 'Penguin Random House Author Details',
    name: 'Name',
    score: 'Score',
    url: 'URL',
    domain: 'Domain',
    titleField: 'Title',
    description: 'Description',
    authorFirst: 'First Name',
    authorLast: 'Last Name',
    photoCredit: 'Photo Credit',
    onTour: 'On Tour',
    seriesAuthor: 'Series Author',
    seriesIsbn: 'Series ISBN',
    seriesCount: 'Series Count',
    keywordId: 'Keyword ID',
    save: 'Save',
    cancel: 'Cancel',
  };
  const penguinUrl = import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_URL || 'https://www.penguinrandomhouse.com/';
  return (
    <div className="prh-author-detail-container">
      <h2>{text.title}</h2>
      <div className="prh-author-detail-fields">
        <div><strong>{text.name}:</strong> {author.name}</div>
        <div><strong>{text.score}:</strong> {author.score}</div>
        <div><strong>{text.url}:</strong> <a href={author.url} target="_blank" rel="noopener noreferrer">{`${penguinUrl}${author.url}`}</a></div>
        <div><strong>{text.domain}:</strong> {author.domain.join(', ')}</div>
        <div><strong>{text.titleField}:</strong> {author.title ?? ''}</div>
        <div><strong>{text.description}:</strong> {author.description ?? ''}</div>
        <div><strong>{text.authorFirst}:</strong> {author.authorFirst ?? ''}</div>
        <div><strong>{text.authorLast}:</strong> {author.authorLast ?? ''}</div>
        <div><strong>{text.photoCredit}:</strong> {author.photoCredit ?? ''}</div>
        <div><strong>{text.onTour}:</strong> {author.onTour ? 'Yes' : 'No'}</div>
        <div><strong>{text.seriesAuthor}:</strong> {author.seriesAuthor ?? ''}</div>
        <div><strong>{text.seriesIsbn}:</strong> {author.seriesIsbn ?? ''}</div>
        <div><strong>{text.seriesCount}:</strong> {author.seriesCount ?? ''}</div>
        <div><strong>{text.keywordId}:</strong> {author.keywordId ?? ''}</div>
      </div>
      <div className="prh-author-detail-actions">
        <button className="app-btn" onClick={() => onSave(author)}>{text.save}</button>
        <button className="app-btn cancel" onClick={onCancel}>{text.cancel}</button>
      </div>
    </div>
  );
};

export { PenguinRandomHouseAuthorDetail };
