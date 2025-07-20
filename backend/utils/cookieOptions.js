// Utility for dynamic cookie options

const isLocalhost = process.env.NODE_ENV !== 'production';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: !isLocalhost, // Secure only in production
  sameSite: 'strict',
});

module.exports = { getCookieOptions, isLocalhost }; 