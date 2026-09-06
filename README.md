# Cyber Tavla

**Cyber Tavla**, holografik/neon 3D temalı, tamamen Türkçe bir tavla (backgammon) oyunudur. Klasik/standart tavla kurallarıyla, "Zor" seviyede oynayan bir yapay zeka rakibe karşı oynanır.

Magenta/cyan neon renk paleti, devre kartı dokulu parlayan taşlar, holografik cam bir cihaz üzerinde duran 3D eğik tahta, sentezlenmiş dijital ses efektleri ve zar/taş animasyonlarıyla klasik tavlanın fütüristik bir yorumudur.

## Özellikler

- **Klasik/standart tavla kuralları eksiksiz**: bar (bekleme) bölgesi, taş çıkarma (bear-off), çift zar (double) atıldığında 4 hamle hakkı, ikiye katlama küpü, iki zar birden oynanamıyorsa büyük zarın oynanma zorunluluğu (must-use-larger-die) ve oynanabilir hamle kalmadığında otomatik pas.
- **"Zor" seviyeli yapay zeka rakip**: bar girişini, taş vurmayı, taş çıkarmayı ve nokta yapmayı önceliklendiren gerçek zamanlı bir strateji ile oynar.
- **Seç-ve-onayla hamle akışı**: bir taşı seçin, aydınlanan geçerli kareye dokunun ya da "Hamle Yap" butonuyla onaylayın.
- **Tamamen Türkçe arayüz**: menüler, oyun içi bildirimler ve hata mesajlarının tamamı Türkçe.
- **Holografik neon 3D arayüz**: Tailwind CSS ile inşa edilmiş, camsı panelli ve neon parıltılı bir tasarım.
- **Sentezlenmiş ses efektleri**: Web Audio API ile anlık üretilen (herhangi bir ses dosyası içermeyen) zar, hamle, vuruş, hata ve kazanma sesleri.
- **Zar/taş animasyonları**: zar atma ve taş yerleşme hareketleri canlandırmalarla desteklenir.
- **Android APK desteği**: Capacitor ile native Android uygulaması olarak da paketlenip dağıtılır.

## Teknoloji

- React + TypeScript
- Redux Toolkit (oyun durumu yönetimi)
- Vite
- Tailwind CSS
- Vitest (otomatik test paketi)
- Web Audio API (sentezlenmiş ses efektleri)
- Capacitor (Android)

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın (Vite'ın varsayılan portu).

> **Not:** Bu depoda bir bağımlılık kilit dosyası (`package-lock.json`) commit edilmemiştir; kurulum için `npm ci` değil `npm install` kullanın.

Üretim (production) derlemesi için:

```bash
npm run build
```

Bu komut, statik dosyaları `dist/` klasörüne üretir.

Otomatik test paketini çalıştırmak için:

```bash
npm test
```

## Canlı adres

**https://cyber-tavla-klasik.vercel.app**

Bu proje Vercel'e bağlı (repo: `piyamijj/CyberTavlaKlasik`): `main` dalına yapılan her push, siteyi otomatik olarak yeniden derleyip yayınlar.

## Vercel'e yayınlama (sıfırdan kurulum)

Proje zaten Vercel'e bağlı ve otomatik yayınlanıyor. Bunu kendi Vercel hesabınızda sıfırdan kurmak isterseniz:

1. [vercel.com](https://vercel.com) üzerinde "Add New Project" ile bu GitHub reposunu (`piyamijj/CyberTavlaKlasik`) içe aktarın.
2. Vercel, repodaki `vercel.json` sayesinde ayarları otomatik algılar (framework: Vite, build komutu: `npm run build`, çıktı klasörü: `dist`). Ekstra bir ayar yapmanıza gerek yok.
3. "Deploy" butonuna basın. Birkaç dakika içinde canlı bir adres alırsınız.
4. Sonraki her `git push` otomatik olarak yeni bir yayın (deployment) tetikler.

## Android APK'sı alma

Bu projede Android APK'sı **sizin bilgisayarınızda hiçbir Android SDK kurulumu gerekmeden**, tamamen GitHub Actions üzerinde otomatik olarak derleniyor.

### Yöntem 1 — Hazır APK'yı indirin (en kolay)

En güncel kararlı sürüm, GitHub'ın "Releases" sayfasında yayınlanır:

**https://github.com/piyamijj/CyberTavlaKlasik/releases**

En son sürümün altındaki `app-debug.apk` dosyasına tıklayıp indirin, Android telefonunuza aktarıp kurun (telefonunuzda "bilinmeyen kaynaklardan yükleme" iznini açmanız gerekebilir).

Yeni bir sürüm yayınlamak isterseniz, sadece bir etiket (tag) push etmeniz yeterli — GitHub Actions otomatik olarak APK'yı derleyip bu sayfaya ekler:

```bash
git tag v1.0.1
git push origin v1.0.1
```

### Yöntem 2 — Her push'tan sonra üretilen APK'yı indirin

Etiket atmadan da, `main` dalına her push'ta APK otomatik derlenir ve ilgili çalışmanın (workflow run) sayfasındaki "Artifacts" bölümünde 30 gün boyunca indirilebilir durumda kalır:

**https://github.com/piyamijj/CyberTavlaKlasik/actions/workflows/android-build.yml**

### Yöntem 3 — Kendi bilgisayarınızda derlemek isterseniz

Android Studio, Android SDK, JDK 21 ve Node.js 22 kuruluysa, yerelde de derleyebilirsiniz:

```bash
npm install
npm run build
npx cap add android      # ilk seferde; sonrasında: npx cap sync android
cd android
./gradlew assembleDebug
```

Üretilen APK, `android/app/build/outputs/apk/debug/app-debug.apk` yolunda oluşur.

> **Not:** Bu APK imzasız bir "debug" sürümüdür — test ve kişisel kurulum için uygundur. Google Play'e yüklenebilecek imzalı bir "release" sürüm isterseniz, bir imzalama anahtarı (keystore) oluşturup GitHub repo secret'ı olarak eklemek gerekir — bu adım kurulmamıştır.

## Yapay zekaya karşı oynama

Karşınızdaki "Yapay Zeka (Zor)", sırası geldiğinde zarını otomatik atar ve hamlesini otomatik yapar — herhangi bir işlem yapmanıza gerek yoktur. Hamle seçerken bar girişini, rakip taşını vurmayı, taş çıkarmayı ve nokta yapmayı (aynı karede iki taş bulundurmayı) önceliklendiren bir strateji izler; bu sayede rastgele değil, gerçek bir tavla mantığıyla oynar.

## Kaynak ve teşekkür

Bu proje, [nielslange/react-backgammon](https://github.com/nielslange/react-backgammon) adlı açık kaynak React/TypeScript/Redux tavla motoru temel alınarak geliştirilmiştir. Orijinal projeye ve emeği geçen nielslange'a teşekkür ederiz.

Bu oyun motoru üzerine; holografik 3D neon tema, tam Türkçe lokalizasyon, "Zor" seviyeli yapay zeka rakip, sentezlenmiş ses efektleri, zar/taş animasyonları, seç-onayla hamle akışı ve Android/Vercel dağıtım altyapısı bu proje kapsamında eklenmiştir.

> **Lisans notu:** Kaynak repoda (`nielslange/react-backgammon`) açık bir lisans dosyası bulunmuyor. Kişisel/pratik kullanım için bir sorun teşkil etmez, ancak bu projeyi geniş çapta dağıtmayı veya ticarileştirmeyi düşünürseniz önce orijinal yazarla lisans durumunu netleştirmeniz önerilir.