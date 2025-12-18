import './globals.css';

export const metadata = {
  title: 'AI Architecture Advisor',
  description: 'Portfolio demo for Cloud Solutions Architecture AI assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
