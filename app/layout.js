import './globals.css';

export const metadata = {
  title: 'Database Practice App',
  description: 'Testing TiDB Cloud with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}