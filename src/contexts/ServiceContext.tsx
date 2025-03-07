import { FetchService } from '@/services/fetchService';
import { PlaylistsService } from '@/services/playlistsService';
import { createContext, useContext, ReactNode } from 'react';

const fetchService = new FetchService();
const playlistsService = new PlaylistsService(fetchService);

interface ServiceContextType {
  playlistsService: PlaylistsService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

const services: ServiceContextType = {
  playlistsService,
};

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

// Custom hook to access services
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context)
    throw new Error('useServices must be used within a ServiceProvider');
  return context;
};
