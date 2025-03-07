import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import '../styles/globals.css';
import SessionWrapper from '@components/SessionWrapper';
import RootLayout from '@components/layout/RootLayout';
import { ServiceContextType, ServiceProvider } from '@/contexts/ServiceContext';
import { FetchService } from '@/services/fetchService';
import { PlaylistsService } from '@/services/playlistsService';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const fetchService = new FetchService();
const playlistsService = new PlaylistsService(fetchService);

const servicesValue: ServiceContextType = {
  playlistsService,
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionWrapper>
      <ServiceProvider value={servicesValue}>
        <main className={poppins.className}>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </main>
      </ServiceProvider>
    </SessionWrapper>
  );
}
