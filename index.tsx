
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("BuddyGuard: Initializing application...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("BuddyGuard: Could not find root element to mount to.");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("BuddyGuard: App mounted successfully.");
} catch (error) {
  console.error("BuddyGuard: Mounting failed:", error);
}
