import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'rosiewang.com',
  description: "Rosie Wang's personal site.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
