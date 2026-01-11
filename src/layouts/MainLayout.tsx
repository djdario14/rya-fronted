import React, { PropsWithChildren } from 'react';

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <header style={{ padding: '1rem', background: '#222', color: '#fff' }}>
      <h1>RYA Cobranza</h1>
    </header>
    <main style={{ flex: 1 }}>{children}</main>
    <footer style={{ padding: '1rem', background: '#eee', textAlign: 'center' }}>
      © {new Date().getFullYear()} RYA Cobranza
    </footer>
  </div>
);

export default MainLayout;
