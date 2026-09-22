import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bconnect.app',
  appName: 'BConnect',
  webDir: 'public',
  server: {
    url: process.env.BCONNECT_APP_URL || 'https://b-connect-git-feat-incident-ops-live-a3bcruz-9374s-projects.vercel.app',
    cleartext: false,
  },
  android: {
    backgroundColor: '#031c19',
  },
};

export default config;
