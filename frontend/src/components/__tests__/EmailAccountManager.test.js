import { render, screen, fireEvent } from '@testing-library/react';
import EmailAccountManager from '../EmailAccountManager';

describe('EmailAccountManager', () => {
  test('renders email list', () => {
    render(<EmailAccountManager />);
    expect(screen.getByText('Email Accounts')).toBeInTheDocument();
  });
}); 