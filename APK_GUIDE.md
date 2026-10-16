# YRCS Hodeidah HR Management System - PWA to APK Guide

## 📱 تطبيق PWA قابل للتثبيت

تم تحويل التطبيق إلى **Progressive Web App (PWA)** يمكن تثبيته مباشرة على أندرويد كتطبيق بدون الحاجة لملف APK.

### ✅ التثبيت المباشر (الأسهل)

1. افتح رابط التطبيق في **Chrome** على هاتفك الأندرويد
2. اضغط على القائمة (⋮) في الزاوية العلوية
3. اختر **"Add to Home screen"** أو **"Install app"**
4. سيتم تثبيت التطبيق كتطبيق عادي على شاشتك الرئيسية!

---

## 🔨 تحويل إلى APK

إذا كنت تريد ملف APK حقيقي، اتبع إحدى الطرق التالية:

### الطريقة 1: PWABuilder (الأسهل - موصى بها)

1. اذهب إلى [pwabuilder.com](https://www.pwabuilder.com/)
2. أدخل رابط التطبيق المنشور
3. اضغط "Start" لتحليل التطبيق
4. اضغط "Package for stores" → "Android"
5. حمّل ملف APK المولد
6. وقّع الملف باستخدام keystore

**المميزات:**
- ✅ سهل جداً
- ✅ لا يحتاج أدوات تطوير
- ✅ جاهز لـ Google Play Store

---

### الطريقة 2: Bubblewrap CLI (للمطورين)

```bash
# تثبيت Bubblewrap
npm install -g @bubblewrap/cli

# تهيئة المشروع
bubblewrap init --manifest=https://your-domain.com/manifest.json

# بناء APK
bubblewrap build
```

**المتطلبات:**
- Java JDK 11+
- Android SDK
- Node.js 14+

---

### الطريقة 3: Capacitor (تطبيق أصلي كامل)

```bash
# تثبيت Capacitor
npm install @capacitor/core @capacitor/cli

# تهيئة المشروع
npx cap init "YRCS HR" "org.yrcs.hodeidah.hr"

# بناء التطبيق
npm run build

# إضافة منصة أندرويد
npx cap add android

# مزامنة الملفات
npx cap sync android

# فتح في Android Studio
npx cap open android
```

ثم من Android Studio:
- Build → Build Bundle(s) / APK(s) → Build APK(s)

**المميزات:**
- ✅ وصول كامل لميزات الجهاز
- ✅ إمكانية إضافة كود أصلي
- ✅ نشر على Google Play Store

---

## 📋 معلومات التطبيق

| الحقل | القيمة |
|------|--------|
| **اسم التطبيق** | YRCS Hodeidah HR |
| **اسم الحزمة** | org.yrcs.hodeidah.hr |
| **الإصدار** | 2.0.0 |
| **أقل إصدار أندرويد** | Android 5.0 (API 21) |
| **الإصدار المستهدف** | Android 14 (API 34) |

---

## 🎨 الأيقونات

الأيقونات متاحة بالأحجام التالية:
- 192x192 (للتطبيق)
- 512x512 (لـ Play Store)
- SVG (قابل للتغيير)

لتحميل الأيقونات بصيغة PNG:
1. افتح التطبيق
2. اذهب إلى تبويب "Build APK"
3. اضغط "Download Icons (PNG)"

---

## 🚀 النشر

### نشر التطبيق على الويب

يمكنك نشر التطبيق على أي استضافة ثابتة (static hosting):

```bash
# بناء التطبيق
npm run build

# الملفات في مجلد dist/ جاهزة للنشر
```

**خيارات الاستضافة المجانية:**
- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [Firebase Hosting](https://firebase.google.com/products/hosting)

---

## 📞 الدعم

للمساعدة في تحويل التطبيق إلى APK أو أي استفسارات أخرى، تواصل مع فريق التطوير.

---

## 📄 الترخيص

Yemen Red Crescent Society - Hodeidah Branch  
جميع الحقوق محفوظة © 2024
