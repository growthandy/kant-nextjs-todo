import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'My Todo', template: '%s | My Todo' },
  description: '회원 전용 할 일 관리',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  );
}
