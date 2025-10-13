import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ErrorPage } from '../src/components/ErrorPage';
import { CultureInfoProvider } from '../src/contexts/CultureInfoContext';


describe('ErrorPage', () => {
    // Mock Vite Development mode environment variable
  it('renders error details and handles dispatch', () => {
    const mockDispatch = vi.fn();
    const mockState = {
      error: 'Test error',
    };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    const { getByText } = render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <ErrorPage state={mockState} dispatch={mockDispatch} isDevelopment={() => true} />
      </CultureInfoProvider>
    );
    expect(getByText('Test error')).toBeInTheDocument();
    // Simulate button click if in development mode
    const tryAgainButton = getByText(/Try Again/i);
    tryAgainButton && tryAgainButton.click();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLEAR_ERROR' });
  });

  it("shows production error message when isDevelopment is false", () => {
    const mockDispatch = vi.fn();
    const mockState = { error: "Test error" };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    const { getByText, queryByText } = render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <ErrorPage state={mockState} dispatch={mockDispatch} isDevelopment={() => false} />
      </CultureInfoProvider>
    );
    expect(getByText("We're sorry, but something went wrong. Please try again later.")).toBeInTheDocument();
    expect(queryByText('Test error')).not.toBeInTheDocument();
    const returnButton = getByText(/Return to App/i);
    returnButton && returnButton.click();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLEAR_ERROR' });
  });
});
