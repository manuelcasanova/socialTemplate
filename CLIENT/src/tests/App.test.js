import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

describe('App component', () => {
  test('toggles navigation menu on click of Hamburger', () => {
    render(<App />);

    // Check if Hamburger button and Navbar are rendered initially
    const hamburgerButton = screen.getByRole('button'); // Assuming Hamburger is a button
    const navbar = screen.getByTestId('navbar'); // Using data-testid="navbar"

    // Initially, the Navbar should not have the 'open' class
    expect(navbar).not.toHaveClass('open');

    // Simulate a click on the Hamburger button to open the Navbar
    fireEvent.click(hamburgerButton);

    // Verify if Navbar now has the 'open' class
    expect(navbar).toHaveClass('open');

    // Simulate another click to close the Navbar
    fireEvent.click(hamburgerButton);

    // Verify if Navbar no longer has the 'open' class
    expect(navbar).not.toHaveClass('open');
  });
});
