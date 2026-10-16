import { useState, useRef, useEffect } from 'react';

export default function APKBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  const [pngGenerated, setPngGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const steps = [
    { title: 'Generate App Icons', desc: 'Create PNG icons from SVG' },
    { title: 'PWABuilder Method', desc: 'Easiest way to create APK' },
    { title: 'Bubblewrap CLI', desc: 'Advanced method for developers' },
    { title: 'Capacitor Method', desc: 'Full native app wrapper' },
  ];

  // Generate PNG from SVG
  useEffect(() => {
    if (pngGenerated) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="96" fill="url(#bg)"/>
        <circle cx="256" cy="256" r="180" fill="#ffffff"/>
        <path d="M 256 120 A 136 136 0 1 1 256 392 A 100 100 0 1 0 256 120 Z" fill="#dc2626"/>
        <text x="256" y="460" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle">YRCS</text>
      </svg>`;

      const img = new Image();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        // 512x512
        canvas.width = 512;
        canvas.height = 512;
        ctx.drawImage(img, 0, 0, 512, 512);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [pngGenerated]);

  const downloadPNG = (size: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="96" fill="url(#bg)"/>
      <circle cx="256" cy="256" r="180" fill="#ffffff"/>
      <path d="M 256 120 A 136 136 0 1 1 256 392 A 100 100 0 1 0 256 120 Z" fill="#dc2626"/>
      <text x="256" y="460" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle">YRCS</text>
    </svg>`;

    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      
      const link = document.createElement('a');
      link.download = `yrsc-icon-${size}x${size}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };

  const downloadAllIcons = () => {
    [192, 512].forEach(size => {
      setTimeout(() => downloadPNG(size), size * 2);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <i className="fab fa-android text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Build APK</h2>
              <p className="text-emerald-100 text-sm">Convert YRCS HR App to Android APK</p>
            </div>
          </div>
        </div>
      </div>

      {/* App Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-mobile-alt text-red-500"></i>
          App Preview & Icons
        </h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Phone mockup */}
          <div className="relative">
            <div className="w-56 h-96 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-gradient-to-b from-red-700 to-red-900 rounded-[2rem] overflow-hidden relative">
                {/* Status bar */}
                <div className="flex items-center justify-between px-4 py-1 text-white text-[10px]">
                  <span>9:41</span>
                  <div className="w-16 h-4 bg-black rounded-full"></div>
                  <div className="flex gap-1">
                    <i className="fas fa-signal text-[8px]"></i>
                    <i className="fas fa-wifi text-[8px]"></i>
                    <i className="fas fa-battery-full text-[8px]"></i>
                  </div>
                </div>
                {/* App content */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-red-700 text-xs font-bold">☪</span>
                    </div>
                    <div>
                      <p className="text-white text-[10px] font-bold">YRCS Hodeidah</p>
                      <p className="text-red-200 text-[8px]">HR Management</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Dashboard', 'Employees', 'Attendance', 'Timesheet', 'Payslip', 'Reports'].map((item, i) => (
                      <div key={i} className="bg-white/15 rounded-lg p-2 backdrop-blur-sm">
                        <p className="text-white text-[8px] font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Generation */}
          <div className="flex-1 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <i className="fas fa-image text-purple-500"></i>
                App Icons
              </h4>
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-4 items-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg mb-1">
                    <svg viewBox="0 0 512 512" className="w-14 h-14">
                      <circle cx="256" cy="256" r="180" fill="#ffffff"/>
                      <path d="M 256 120 A 136 136 0 1 1 256 392 A 100 100 0 1 0 256 120 Z" fill="#dc2626"/>
                    </svg>
                  </div>
                  <p className="text-[10px] text-gray-500">512x512</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg mb-1">
                    <svg viewBox="0 0 512 512" className="w-8 h-8">
                      <circle cx="256" cy="256" r="180" fill="#ffffff"/>
                      <path d="M 256 120 A 136 136 0 1 1 256 392 A 100 100 0 1 0 256 120 Z" fill="#dc2626"/>
                    </svg>
                  </div>
                  <p className="text-[10px] text-gray-500">192x192</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg mb-1">
                    <svg viewBox="0 0 512 512" className="w-5 h-5">
                      <circle cx="256" cy="256" r="180" fill="#ffffff"/>
                      <path d="M 256 120 A 136 136 0 1 1 256 392 A 100 100 0 1 0 256 120 Z" fill="#dc2626"/>
                    </svg>
                  </div>
                  <p className="text-[10px] text-gray-500">Favicon</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setPngGenerated(true); downloadAllIcons(); }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 flex items-center gap-2"
                >
                  <i className="fas fa-download"></i>
                  Download Icons (PNG)
                </button>
              </div>
            </div>

            {/* Quick Install */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <i className="fas fa-bolt text-blue-500"></i>
                Quick Install (No APK needed)
              </h4>
              <p className="text-xs text-blue-600 mb-3">
                This app is a Progressive Web App (PWA). You can install it directly on Android without an APK:
              </p>
              <ol className="text-xs text-blue-700 space-y-1">
                <li>1. Open this URL in Chrome on your Android phone</li>
                <li>2. Tap the menu (⋮) → "Add to Home screen"</li>
                <li>3. The app will install like a native app!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Steps to Build APK */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-list-ol text-emerald-500"></i>
          Steps to Build APK
        </h3>

        {/* Step Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeStep === i
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{i + 1}.</span> {step.title}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-gray-50 rounded-xl p-6">
          {activeStep === 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800">Generate App Icons</h4>
              <p className="text-sm text-gray-600">Download the app icons in PNG format for use in APK building tools.</p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2">Required Icon Sizes:</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { size: '48x48', desc: 'MDPI' },
                    { size: '72x72', desc: 'HDPI' },
                    { size: '96x96', desc: 'XHDPI' },
                    { size: '144x144', desc: 'XXHDPI' },
                    { size: '192x192', desc: 'XXXHDPI' },
                    { size: '512x512', desc: 'Play Store' },
                    { size: '1024x1024', desc: 'Feature Graphic' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-sm font-bold text-gray-700">{item.size}</p>
                      <p className="text-[10px] text-gray-400">{item.desc}</p>
                      <button
                        onClick={() => downloadPNG(parseInt(item.size))}
                        className="mt-1 text-[10px] text-blue-600 hover:text-blue-800"
                      >
                        <i className="fas fa-download"></i> Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800">PWABuilder Method (Recommended)</h4>
              <p className="text-sm text-gray-600">The easiest way to convert your PWA to an APK.</p>
              <div className="space-y-3">
                {[
                  { step: 1, text: 'Go to pwabuilder.com', icon: 'fa-globe' },
                  { step: 2, text: 'Enter your deployed app URL', icon: 'fa-link' },
                  { step: 3, text: 'Click "Start" to analyze your PWA', icon: 'fa-search' },
                  { step: 4, text: 'Click "Package for stores" → "Android"', icon: 'fa-box' },
                  { step: 5, text: 'Download the generated APK', icon: 'fa-download' },
                  { step: 6, text: 'Sign the APK with your keystore', icon: 'fa-key' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-bold text-sm">{item.step}</span>
                    </div>
                    <i className={`fas ${item.icon} text-emerald-500`}></i>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://www.pwabuilder.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 shadow-lg"
              >
                <i className="fas fa-external-link-alt"></i>
                Open PWABuilder
              </a>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800">Bubblewrap CLI Method</h4>
              <p className="text-sm text-gray-600">For developers who want more control over the APK build process.</p>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 space-y-2 overflow-x-auto">
                <p className="text-gray-400"># Install Bubblewrap CLI</p>
                <p>npm install -g @bubblewrap/cli</p>
                <p className="text-gray-400 mt-3"># Initialize project with your manifest URL</p>
                <p>bubblewrap init --manifest=https://your-domain.com/manifest.json</p>
                <p className="text-gray-400 mt-3"># Build the APK</p>
                <p>bubblewrap build</p>
                <p className="text-gray-400 mt-3"># The APK will be in the ./app/build/outputs/apk/ folder</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="flex items-start gap-2">
                  <i className="fas fa-exclamation-triangle text-amber-500 mt-0.5"></i>
                  <div className="text-xs text-amber-700">
                    <p className="font-medium">Prerequisites:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Java JDK 11+</li>
                      <li>• Android SDK</li>
                      <li>• Node.js 14+</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800">Capacitor Method</h4>
              <p className="text-sm text-gray-600">Convert to a full native Android app with Capacitor.</p>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 space-y-2 overflow-x-auto">
                <p className="text-gray-400"># Install Capacitor</p>
                <p>npm install @capacitor/core @capacitor/cli</p>
                <p>npx cap init "YRCS HR" "org.yrcs.hodeidah.hr"</p>
                <p className="text-gray-400 mt-3"># Build your web app first</p>
                <p>npm run build</p>
                <p className="text-gray-400 mt-3"># Add Android platform</p>
                <p>npx cap add android</p>
                <p className="text-gray-400 mt-3"># Sync web assets</p>
                <p>npx cap sync android</p>
                <p className="text-gray-400 mt-3"># Open in Android Studio</p>
                <p>npx cap open android</p>
                <p className="text-gray-400 mt-3"># Build APK from Android Studio:</p>
                <p># Build → Build Bundle(s) / APK(s) → Build APK(s)</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-start gap-2">
                  <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
                  <div className="text-xs text-blue-700">
                    <p className="font-medium">Benefits of Capacitor:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Full native device access (camera, GPS, notifications)</li>
                      <li>• Custom native code integration</li>
                      <li>• Publish to Google Play Store</li>
                      <li>• Better performance for complex apps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* App Configuration */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-cog text-gray-500"></i>
          App Configuration for APK
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-3">App Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">App Name:</span>
                <span className="font-medium text-gray-700">YRCS Hodeidah HR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Package Name:</span>
                <span className="font-medium text-gray-700">org.yrcs.hodeidah.hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Version:</span>
                <span className="font-medium text-gray-700">2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Min SDK:</span>
                <span className="font-medium text-gray-700">Android 5.0 (API 21)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Target SDK:</span>
                <span className="font-medium text-gray-700">Android 14 (API 34)</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-3">Permissions</h4>
            <div className="space-y-2">
              {[
                { perm: 'Internet', desc: 'Required for data sync', required: true },
                { perm: 'Notifications', desc: 'HR alerts & reminders', required: false },
                { perm: 'Camera', desc: 'Document scanning', required: false },
                { perm: 'Location', desc: 'Attendance geo-tagging', required: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.required ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-700 flex-1">{item.perm}</span>
                  <span className="text-xs text-gray-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-table text-indigo-500"></i>
          Method Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Feature</th>
                <th className="text-center px-4 py-3 font-semibold text-emerald-600">PWA Install</th>
                <th className="text-center px-4 py-3 font-semibold text-blue-600">PWABuilder</th>
                <th className="text-center px-4 py-3 font-semibold text-purple-600">Bubblewrap</th>
                <th className="text-center px-4 py-3 font-semibold text-amber-600">Capacitor</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Difficulty', pwa: '⭐', pwab: '⭐⭐', bw: '⭐⭐⭐', cap: '⭐⭐⭐⭐' },
                { feature: 'Setup Time', pwa: '1 min', pwab: '5 min', bw: '30 min', cap: '2 hours' },
                { feature: 'Offline Support', pwa: '✅', pwab: '✅', bw: '✅', cap: '✅' },
                { feature: 'Play Store Ready', pwa: '❌', pwab: '✅', bw: '✅', cap: '✅' },
                { feature: 'Native Features', pwa: 'Limited', pwab: 'Basic', bw: 'Basic', cap: 'Full' },
                { feature: 'Auto Updates', pwa: '✅', pwab: '✅', bw: '✅', cap: 'Manual' },
                { feature: 'Custom Native Code', pwa: '❌', pwab: '❌', bw: '❌', cap: '✅' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-700">{row.feature}</td>
                  <td className="px-4 py-3 text-center">{row.pwa}</td>
                  <td className="px-4 py-3 text-center">{row.pwab}</td>
                  <td className="px-4 py-3 text-center">{row.bw}</td>
                  <td className="px-4 py-3 text-center">{row.cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
