import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThankYou } from '../src/components/ThankYou';

describe('ThankYou', () => {
  it('renders thank you message', () => {
    const { getByText } = render(<ThankYou />);
    expect(getByText('Thank You')).toBeInTheDocument();
  });
});
