import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ph.bconnect.app',
  appName: 'BConnect',
  webDir: '.next',
  server: {
    // Development/test preview can point the Android shell at the deployed
    // BConnect web app. Keep this disabled for normal web/Vercel builds.
    url: process.env.CAPACITOR_SERVER_URL,
    cleartext: false,
  },
  android: {
    backgroundColor: '#f5f8fc',
  },
};

export default config;
