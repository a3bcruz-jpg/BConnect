import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BConnect',
    short_name: 'BConnect',
    description: 'Barangay incident reporting and response coordination platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f8fc',
    theme_color: '#0b66c3',
    orientation: 'portrait',
  };
}
