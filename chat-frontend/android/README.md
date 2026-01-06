# Claude Chat - Android App

Eine native Android App für die Claude API mit moderner Jetpack Compose UI.

## Features

- 📱 Native Android App mit Kotlin
- 🎨 Moderne UI mit Jetpack Compose und Material Design 3
- 💬 Echtzeit-Chat mit Claude API
- 🔄 MVVM Architektur für sauberen Code
- ⚡ Retrofit für effiziente API-Kommunikation
- 🎯 Typing-Indikatoren und Animationen
- 📊 Zeichenzähler und Eingabevalidierung
- 🌐 Offline-Fehlerbehandlung

## Technologie-Stack

- **Sprache**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architektur**: MVVM (Model-View-ViewModel)
- **Networking**: Retrofit + OkHttp
- **JSON Parsing**: Gson
- **Async**: Kotlin Coroutines
- **Dependency Injection**: Manual DI (kann zu Hilt erweitert werden)
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)

## Projektstruktur

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/claude/chat/
│   │       │   ├── model/              # Data Models
│   │       │   │   ├── Message.kt
│   │       │   │   ├── ChatRequest.kt
│   │       │   │   └── ChatResponse.kt
│   │       │   ├── network/            # API Service
│   │       │   │   ├── ClaudeApiService.kt
│   │       │   │   └── RetrofitInstance.kt
│   │       │   ├── repository/         # Data Repository
│   │       │   │   └── ChatRepository.kt
│   │       │   ├── viewmodel/          # ViewModels
│   │       │   │   └── ChatViewModel.kt
│   │       │   ├── ui/                 # UI Components
│   │       │   │   ├── ChatScreen.kt
│   │       │   │   ├── components/
│   │       │   │   │   ├── ChatMessageItem.kt
│   │       │   │   │   ├── MessageInputField.kt
│   │       │   │   │   ├── WelcomeMessage.kt
│   │       │   │   │   └── TypingIndicator.kt
│   │       │   │   └── theme/
│   │       │   │       ├── Color.kt
│   │       │   │       ├── Theme.kt
│   │       │   │       └── Type.kt
│   │       │   └── MainActivity.kt
│   │       ├── res/
│   │       │   ├── values/
│   │       │   │   ├── strings.xml
│   │       │   │   └── themes.xml
│   │       │   └── xml/
│   │       └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── settings.gradle
├── gradle.properties
└── README.md
```

## Voraussetzungen

- Android Studio Hedgehog (2023.1.1) oder neuer
- JDK 17
- Android SDK 34
- Ein laufender Backend-Server (siehe `../backend/README.md`)

## Installation

### 1. Projekt in Android Studio öffnen

```bash
cd chat-frontend/android
```

Öffnen Sie diesen Ordner in Android Studio.

### 2. Backend-Server URL konfigurieren

Bearbeiten Sie `app/build.gradle` und ändern Sie die API Base URL:

```gradle
buildConfigField "String", "API_BASE_URL", "\"http://YOUR_SERVER_IP:3000/api/\""
```

**Wichtig für den Emulator:**
- Verwenden Sie `http://10.0.2.2:3000/api/` für den Android Emulator
- Verwenden Sie `http://YOUR_LOCAL_IP:3000/api/` für physische Geräte

### 3. Gradle Sync durchführen

Android Studio wird automatisch eine Gradle Sync durchführen. Falls nicht:
- Klicken Sie auf `File → Sync Project with Gradle Files`

### 4. App ausführen

- Verbinden Sie ein Android-Gerät oder starten Sie einen Emulator
- Klicken Sie auf den "Run" Button (grüner Pfeil)
- Wählen Sie Ihr Gerät aus

## Backend-Server starten

Bevor Sie die App verwenden, stellen Sie sicher, dass der Backend-Server läuft:

```bash
cd ../backend
npm install
cp .env.example .env
# Fügen Sie Ihren ANTHROPIC_API_KEY in .env hinzu
npm start
```

## Verwendung

1. **App starten**: Öffnen Sie die App auf Ihrem Android-Gerät
2. **Nachricht eingeben**: Tippen Sie eine Nachricht in das Eingabefeld
3. **Senden**: Drücken Sie den Send-Button
4. **Antwort erhalten**: Claude antwortet nach wenigen Sekunden

## Build-Varianten

### Debug Build

```bash
./gradlew assembleDebug
```

Die APK finden Sie unter: `app/build/outputs/apk/debug/app-debug.apk`

### Release Build

```bash
./gradlew assembleRelease
```

Die APK finden Sie unter: `app/build/outputs/apk/release/app-release.apk`

**Hinweis**: Für Production müssen Sie die App signieren. Erstellen Sie einen Keystore:

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
```

Und fügen Sie in `app/build.gradle` hinzu:

```gradle
android {
    signingConfigs {
        release {
            storeFile file("my-release-key.jks")
            storePassword "password"
            keyAlias "my-alias"
            keyPassword "password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ...
        }
    }
}
```

## Konfiguration

### API Base URL ändern

In `app/build.gradle`:

```gradle
buildConfigField "String", "API_BASE_URL", "\"https://your-production-api.com/api/\""
```

### Timeout-Einstellungen

In `network/RetrofitInstance.kt`:

```kotlin
private val okHttpClient = OkHttpClient.Builder()
    .connectTimeout(30, TimeUnit.SECONDS)  // Verbindungs-Timeout
    .readTimeout(30, TimeUnit.SECONDS)     // Lese-Timeout
    .writeTimeout(30, TimeUnit.SECONDS)    // Schreib-Timeout
    .build()
```

### Theme anpassen

Farben in `ui/theme/Color.kt`:

```kotlin
val Purple80 = Color(0xFF667EEA)  // Primärfarbe
val Green80 = Color(0xFF10B981)   // Sekundärfarbe
```

## Testing

### Unit Tests ausführen

```bash
./gradlew test
```

### Instrumented Tests ausführen

```bash
./gradlew connectedAndroidTest
```

## Troubleshooting

### "Unable to resolve host" Fehler

**Problem**: Die App kann den Backend-Server nicht erreichen.

**Lösung**:
- Für Emulator: Verwenden Sie `http://10.0.2.2:3000/api/`
- Für physisches Gerät: Verwenden Sie Ihre lokale IP-Adresse (z.B. `http://192.168.1.100:3000/api/`)
- Stellen Sie sicher, dass der Backend-Server läuft
- Prüfen Sie, ob Firewall-Regeln den Zugriff blockieren

### Gradle Build Fehler

**Problem**: Gradle Sync schlägt fehl.

**Lösung**:
- Führen Sie `File → Invalidate Caches / Restart` aus
- Löschen Sie den `.gradle` Ordner und führen Sie Sync erneut durch
- Stellen Sie sicher, dass JDK 17 konfiguriert ist

### "Cleartext HTTP traffic not permitted"

**Problem**: Android blockiert HTTP-Verbindungen.

**Lösung**: In `AndroidManifest.xml` ist bereits `android:usesCleartextTraffic="true"` gesetzt. Für Production sollten Sie HTTPS verwenden.

### ProGuard Fehler im Release Build

**Problem**: App stürzt nach ProGuard-Obfuscation ab.

**Lösung**: Die `proguard-rules.pro` enthält bereits Regeln für Retrofit und Gson. Falls weitere Probleme auftreten, fügen Sie spezifische Keep-Rules hinzu.

## Performance-Optimierung

### APK-Größe reduzieren

In `app/build.gradle`:

```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
        }
    }
}
```

### App Bundle erstellen (empfohlen für Play Store)

```bash
./gradlew bundleRelease
```

## Erweiterungen

### DataStore für persistente Speicherung

Die Dependencies sind bereits eingebunden. Implementieren Sie in `repository/`:

```kotlin
class PreferencesRepository(context: Context) {
    private val dataStore = context.dataStore

    suspend fun saveConversation(messages: List<Message>) {
        // Implementierung
    }
}
```

### Push-Benachrichtigungen

Fügen Sie Firebase Cloud Messaging hinzu:

```gradle
dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.3.1'
}
```

### Dependency Injection mit Hilt

```gradle
dependencies {
    implementation 'com.google.dagger:hilt-android:2.48'
    kapt 'com.google.dagger:hilt-compiler:2.48'
}
```

## Lizenz

MIT

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository.
