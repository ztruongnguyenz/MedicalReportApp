# 🏥 Health Vault

A high-performance, secure, and multi-language medical report and health analytics mobile application built with **React Native**, **Expo Router**, and a custom **Teal-themed UI system**.

---

## 🚀 Key Features

* **🔒 Secure Authentication & Biometrics**:
  * Standard email/password manual login.
  * Built-in biometric authentication (`expo-local-authentication`) supporting Face ID and Fingerprint scanning.
* **📱 Dynamic Header & Bottom Tabs Navigation**:
  * Built with Expo Router (`Tabs` and `Stack`).
  * Dynamic headers that automatically update their titles when switching between tabs.
  * Customized minimalistic tab bar with responsive Safe Area spacing (`useSafeAreaInsets`).
  * Custom touch feedback (`activeOpacity`) avoiding harsh default ripple effects.
* **🌐 Multi-Language Support ($N \ge 3$ Scaling)**:
  * Powered by `i18n-js` and `expo-localization`.
  * Supports English (`en`), Vietnamese (`vi`), Japanese (`ja`), and French (`fr`).
  * Modern Dropdown selector (`LanguageToggle`) integrated directly into the header.
* **🎨 Teal-Themed UI Palette (Light & Dark Mode)**:
  * Consistent custom color palette (`Palette`) optimized for medical clarity and modern aesthetics.
  * Full automatic synchronization with system color schemes.
* **📦 Modern Vector Icons**:
  * Uses `@react-native-vector-icons/ionicons` for clean, lightweight, and modern tab/UI icons.

---

## 📂 Project Structure

```text
health-vault/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab layout with dynamic headers, safe-area, & custom tab bar
│   │   ├── index.tsx        # Tab 1: Scan & Instant Report Analysis
│   │   └── two.tsx          # Tab 2: Trend Analytics & History
│   ├── _layout.tsx          # Root layout with Stack, LanguageProvider, & ThemeProvider
│   ├── login.tsx            # Login screen with Biometric fallback
│   └── report/
│       └── [id].tsx         # Dynamic Report Details screen
├── components/
│   ├── LanguageToggle.tsx   # Dropdown modal for switching languages
│   ├── Themed.tsx           # Themed Text & View primitives
│   └── useColorScheme.ts    # Color scheme hook wrapper
├── constants/
│   └── Colors.ts            # Custom Teal UI Palette (Light & Dark)
├── locales/
│   ├── en.json              # English translations
│   ├── vi.json              # Vietnamese translations
│   ├── ja.json              # Japanese translations
│   └── fr.json              # French translations
├── services/
│   ├── authService.ts       # Authentication service logic
│   └── i18n.ts              # i18n configuration and locale management
└── app.json                 # Expo project & plugin configuration
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
Ensure you have Node.js (v18+), npm or yarn, and Expo CLI installed.

### 2. Install Dependencies
Run the following commands to install the required packages:

```bash
# Install core native packages via Expo
npx expo install expo-local-authentication expo-localization react-native-safe-area-context

# Install modern vector icons & i18n
npm install @react-native-vector-icons/ionicons i18n-js
```

### 3. Configure `app.json` (Required for Biometrics)
Add the local authentication plugin configuration inside your `app.json`:

```json
{
  "expo": {
    "name": "Health Vault",
    "slug": "health-vault",
    "plugins": [
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow Health Vault to use Face ID for secure medical record access."
        }
      ]
    ]
  }
}
```

### 4. Run the Application
Start your development server:

```bash
npx expo start -c
```

---

## 🌐 Managing Languages

To add a new language (e.g., Spanish `es`):
1. Create a new translation JSON file under `locales/es.json`.
2. Register the file in `services/i18n.ts`.
3. Add the language item into the `LANGUAGES` array inside `components/LanguageToggle.tsx`.

---

## 📝 License
This project is proprietary and confidential.