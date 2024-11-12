import { render, screen, fireEvent } from '@testing-library/react';
import Signup from '../components/authComponents/Signup.jsx';  // Adjust path if needed
import axios from '../api/axios.js';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@testing-library/react';

jest.mock('../api/axios.js');


describe('Signup Component', () => {

  beforeEach(() => {
    axios.post.mockClear(); // Clear mock calls before each test
  });

//TEST PASSES
  test('shows validation error for invalid username', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    const usernameInput = screen.getByLabelText(/Name:/i);

    fireEvent.change(usernameInput, { target: { value: 'ab' } }); // Too short
    fireEvent.blur(usernameInput);  // Trigger validation

    const invalidMsg = screen.getByText(/4 to 24 characters/i);
    expect(invalidMsg).toBeVisible();
  });

  //TEST PASSES
  test('shows validation error for invalid email', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/Email:/i);

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } }); // Invalid email format
    fireEvent.blur(emailInput);  // Trigger validation

    const invalidMsg = screen.getByText(/Must be a valid email address/i);
    expect(invalidMsg).toBeVisible();
  });

  test('disables submit button when form is invalid', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    expect(submitButton).toBeDisabled();
  });

  test('enables submit button when form is valid', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  
    const usernameInput = screen.getByLabelText(/Name:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);

  
    // Simulate valid user input
    fireEvent.change(usernameInput, { target: { value: 'ValidUser123' } });
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword1!' } });
  
    // Trigger blur events for validation
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
  
    // Submit button should be enabled now
    expect(submitButton).toBeEnabled();
  });
  

  test('shows error message when form submission fails due to invalid data', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  
    const usernameInput = screen.getByLabelText(/Name:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
  
    // Simulate invalid user input (empty username, invalid email, and mismatched passwords)
    fireEvent.change(usernameInput, { target: { value: '' } });  // Empty username
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });  // Invalid email
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword123' } });  // Mismatched password
  
    // Trigger blur events for validation
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
  
    // Force the submit button to be enabled for testing
    submitButton.disabled = false;  // Manually enable the button for testing
  
    // Trigger the form submission
    fireEvent.click(submitButton);
  
    // Wait for the error message to appear
    const errMsg = await screen.findByText(/Invalid Entry/i);
  
    // Check if the error message is visible
    expect(errMsg).toBeInTheDocument();
    expect(errMsg).toBeVisible();
  });
  
  
  test('shows error message for existing username or email', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 409,  // Conflict (username or email already taken)
      },
    });
  
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  
    const usernameInput = screen.getByLabelText(/Name:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
  
    // Simulate valid user input
    fireEvent.change(usernameInput, { target: { value: 'ExistingUser' } });
    fireEvent.change(emailInput, { target: { value: 'taken@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword1!' } });
  
    // Trigger blur events for validation
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
  
    // Force the submit button to be enabled for testing
    submitButton.disabled = false;
  
    // Trigger the form submission
    fireEvent.click(submitButton);
  
    // Wait for the error message to appear
    const errMsg = await screen.findByText(/Username or Email Taken/i);
  
    // Check if the error message is visible
    expect(errMsg).toBeInTheDocument();
    expect(errMsg).toBeVisible();
  });
  

  test('shows success message on successful form submission', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,  // Successful response
    });
  
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  
    const usernameInput = screen.getByLabelText(/Name:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
  
    // Simulate valid user input
    fireEvent.change(usernameInput, { target: { value: 'ValidUser' } });
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword1!' } });
  
    // Trigger blur events for validation
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
  
    // Force the submit button to be enabled for testing
    submitButton.disabled = false;
  
    // Trigger the form submission
    fireEvent.click(submitButton);
  
    // Wait for the success message to appear
    const successMessage = await screen.findByText(/You're all set!/i);
  
    // Check if the success message is visible
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toBeVisible();
  });

  test('shows error message when username or email is already taken', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 409,  // Conflict error for duplicate username/email
      },
    });
  
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  
    const usernameInput = screen.getByLabelText(/Name:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
  
    // Simulate valid user input, but with a conflicting username or email
    fireEvent.change(usernameInput, { target: { value: 'ValidUser' } });
    fireEvent.change(emailInput, { target: { value: 'taken@example.com' } });  // Assuming this email is already taken
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword1!' } });
  
    // Trigger blur events for validation
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
  
    // Force the submit button to be enabled for testing
    submitButton.disabled = false;
  
    // Trigger the form submission
    fireEvent.click(submitButton);
  
    // Wait for the error message indicating that the username or email is taken
    const errMsg = await screen.findByText(/Username or Email Taken/i);
  
    // Check if the error message is visible
    expect(errMsg).toBeInTheDocument();
    expect(errMsg).toBeVisible();
  });

  test('shows error message when there is no server response', async () => {
    axios.post.mockRejectedValueOnce({
      message: 'Network Error',  // Simulate a network error (server is unreachable)
    });
  
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  
    const usernameInput = screen.getByLabelText(/Name:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const [passwordInput, confirmPasswordInput] = screen.getAllByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
  
    // Simulate valid user input
    fireEvent.change(usernameInput, { target: { value: 'ValidUser' } });
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPassword1!' } });
  
    // Trigger blur events for validation
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
  
    // Force the submit button to be enabled for testing
    submitButton.disabled = false;
  
    // Trigger the form submission
    fireEvent.click(submitButton);
  
    // Wait for the error message indicating no server response
    const errMsg = await screen.findByText(/No Server Response/i);
  
    // Check if the error message is visible
    expect(errMsg).toBeInTheDocument();
    expect(errMsg).toBeVisible();
  });
  
  

  test('shows error message when password and confirm password do not match', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  
    // Use getAllByLabelText since there might be multiple fields with "Password:"
    const passwordInputs = screen.getAllByLabelText(/Password:/i);
    const confirmPasswordInputs = screen.getAllByLabelText(/Confirm Password:/i);
  
    // Use the first match for each field
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = confirmPasswordInputs[0];
  
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword1!' } });
  
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
  
    await waitFor(() => {
      const mismatchError = screen.getByText(/Must match the first password input field/i);
      expect(mismatchError).toBeVisible();
    });
  });

  
  

});
