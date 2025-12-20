import './globals.css';

export const metadata = {
  title: 'AI Architecture Advisor',
  description: 'Portfolio demo for Cloud Solutions Architecture AI assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
