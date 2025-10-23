import { render, screen } from '@testing-library/react';
import App from './App';

test('renders reading inventory title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Reading Inventory Catalog/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to the Digital Library/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders authentication buttons', () => {
  render(<App />);
  const loginButton = screen.getByRole('button', { name: /🔑 Login/i });
  const studentSignupButton = screen.getByRole('button', { name: /👨‍🎓 Student Signup/i });
  const adminSignupButton = screen.getByRole('button', { name: /👨‍💼 Admin\/Staff Signup/i });
  
  expect(loginButton).toBeInTheDocument();
  expect(studentSignupButton).toBeInTheDocument();
  expect(adminSignupButton).toBeInTheDocument();
});

test('renders book sections', () => {
  render(<App />);
  const educationSection = screen.getByText(/📖 Education/i);
  const englishSection = screen.getByText(/📖 English/i);
  const javaSection = screen.getByText(/^📖 Java$/i);
  const javascriptSection = screen.getByText(/📖 JavaScript/i);
  
  expect(educationSection).toBeInTheDocument();
  expect(englishSection).toBeInTheDocument();
  expect(javaSection).toBeInTheDocument();
  expect(javascriptSection).toBeInTheDocument();
});

test('renders sample books', () => {
  render(<App />);
  const effectiveJava = screen.getByText(/Effective Java/i);
  const animalFarm = screen.getByText(/Animal Farm/i);
  const eloquentJS = screen.getByText(/Eloquent JavaScript/i);
  
  expect(effectiveJava).toBeInTheDocument();
  expect(animalFarm).toBeInTheDocument();
  expect(eloquentJS).toBeInTheDocument();
});
