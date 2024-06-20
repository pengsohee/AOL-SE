import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import auth from '@react-native-firebase/auth'
import LoginPage from '../login';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the auth module
jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(), // Mock the signInWithEmailAndPassword method
  })),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('LoginPage Component', () => {
  it('updates email and password state when typing', async () => {
    const { getByPlaceholderText } = render(<LoginPage />);

    const emailInput = getByPlaceholderText('youremail@mail.com');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });
  

  it('navigates to Index screen on successful login', async () => {
    // auth.signInWithEmailAndPassword.mockResolvedValueOnce({});

    const navigation = { reset: jest.fn() };
    const { getByTestId, getByPlaceholderText } = render(<LoginPage navigation={navigation} />);

    const emailInput = getByPlaceholderText('youremail@mail.com');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByTestId('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Index' }],
      });
    });
  });
});
