import React from "react";

export const RedirectToSignIn: React.FC = () => null;

export const SignedIn: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <>{children}</>
);

export const UserButton: React.FC = () => (
  <button className="px-3 py-1 rounded bg-gray-800 text-white">User</button>
);

export const AuthView: React.FC<{ pathname?: string | null }> = ({ pathname }) => (
  <div style={{ padding: 24 }}>
    <h2>Auth View</h2>
    <p>pathname: {String(pathname)}</p>
  </div>
);

export const AccountView: React.FC<{ pathname?: string | null }> = ({ pathname }) => (
  <div style={{ padding: 24 }}>
    <h2>Account View</h2>
    <p>pathname: {String(pathname)}</p>
  </div>
);

export default {};
