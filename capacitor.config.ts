import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ph.bconnect.app',
  appName: 'BConnect',
  // Capacitor requires a valid local web directory during sync. The Android
  // preview loads the deployed Next.js app when CAPACITOR_SERVER_URL is set.
  webDir: 'public',
  server: {
    url: process.env.CAPACITOR_SERVER_URL,
    cleartext: false,
  },
  android: {
    backgroundColor: '#f5f8fc',
  },
};

export default config;
