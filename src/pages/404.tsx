// pages/404.tsx
import { usePageFound } from '@/utils/hooks/usePageFound';
import Link from 'next/link';

const Custom404 = () => {
  const isPageFound = usePageFound();

  if (isPageFound) return null;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">
        <button>Go to Home Page</button>
      </Link>
    </div>
  );
};

export default Custom404;
