import { redirect } from 'next/navigation';
import LandingPage from '@/components/landing/landing-page';
import AuthRedirect from '@/components/auth/auth-redirect';

export default function Home() {
  return (
    <>
      <AuthRedirect redirectTo="/study" />
      <LandingPage />
    </>
  );
}