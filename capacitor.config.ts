import { CapacitorConfig } from '@capacitor/cli';

// Cyber Tavla (Klasik) — Android native uygulama sarmalayıcısı yapılandırması.
// `npx cap sync android` ve GitHub Actions'daki APK derleme adımı bu dosyayı
// kullanır. webDir, `npm run build` (Vite) ile üretilen statik çıktı
// klasörünü gösterir.
const config: CapacitorConfig = {
  appId: 'com.cybertavlaklasik.app',
  appName: 'Cyber Tavla',
  webDir: 'dist',
};

export default config;