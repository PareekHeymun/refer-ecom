import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem 0 1.5rem 0',
      background: 'linear-gradient(90deg, #232526 0%, #414345 100%)',
      color: '#fff',
      borderTop: 'none',
      fontWeight: 500,
      fontSize: 17,
      letterSpacing: 0.2,
      boxShadow: '0 -2px 16px rgba(0,0,0,0.10)',
      marginTop: 48,
    }}>
      <span>© 2024 Scroll2Ship. All rights reserved.</span>
    </footer>
  );
}
