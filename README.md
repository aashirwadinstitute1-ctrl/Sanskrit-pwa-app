# 📖 संस्कृत शिक्षण App (Sanskrit PWA)

यह एक Progressive Web App (PWA) है, जो बच्चों और विद्यार्थियों को **संस्कृत शब्दरूप** और **धातुरूप** सीखने में मदद करता है। इसे आप सीधे अपने मोबाइल में इंस्टॉल कर सकते हैं।  

---

## 🚀 Features
- 📚 100+ **शब्दरूप** (Noun forms)  
- 🔤 100+ **धातुरूप** (Verb forms)  
- 🌐 इनबिल्ट अनुवाद प्रणाली (Translation system)  
- 📖 शब्दकोश (Dictionary)  
- 🧾 Attractive & polished UI (Devanagari font optimized)  
- 📱 Offline use (Service Worker enabled)  

---

## 📂 Folder Structure
Sanskrit-pwa-app/ │ ├── index.html           
← Main App (UI + Database) ├── manifest.json          
← PWA Manifest ├── service-worker.js      
← Offline Cache Logic │ ├── icons/                  
← App Icons │   ├── icon-192.png │   └── icon-512.png │ └── README.md               
← Project Description
---

## ⚙️ Installation (Mobile)
1. Repo को GitHub Pages पर host करें:  
   - Settings → Pages → Deploy from branch → `main` → `/root` → Save  
   - आपको एक public link मिल जाएगा:  
     ```
     https://your-username.github.io/Sanskrit-pwa-app/
     ```

2. उस link को **Chrome / Edge / Brave** जैसे mobile browser में खोलें।  
3. Browser menu → *Add to Home Screen* चुनें।  
4. अब app आपके मोबाइल में native app की तरह install हो जाएगा।  

---

## 🖼️ Icons
- `icons/icon-192.png`  
- `icons/icon-512.png`  

👉 PWA install करते समय ये app icon show करेंगे।  

---

## 🛠️ Development
- `index.html` → App UI और Sanskrit forms का database  
- `manifest.json` → App settings, name, theme color  
- `service-worker.js` → Offline caching system  

---

## ❤️ Contribution
अगर आप नए **शब्दरूप** या **धातुरूप** जोड़ना चाहते हैं तो:  
1. `index.html` में database section में entry जोड़ें।  
2. Pull request भेजें।
