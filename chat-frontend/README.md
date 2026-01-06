# Claude Chat Frontend

Ein modernes Chat-Interface für die Claude API - verfügbar als Web-App und native Android App.

## 📱 Verfügbare Plattformen

### Web-Frontend
- 💬 Moderne, responsive Chat-Oberfläche
- 🎨 Ansprechendes Design mit Gradient-Styling
- 💾 Automatisches Speichern der Konversationshistorie im Browser
- ⚡ Echtzeit-Feedback mit Typing-Indikatoren
- 📱 Responsive Design für Desktop und Mobile
- 🔄 Auto-resizing Textarea für komfortable Eingabe
- ⌨️ Tastaturkürzel (Enter zum Senden, Shift+Enter für neue Zeile)

### Android App
- 📱 Native Android App mit Kotlin
- 🎨 Moderne UI mit Jetpack Compose und Material Design 3
- 🔄 MVVM Architektur
- ⚡ Effiziente API-Kommunikation mit Retrofit
- 🎯 Animierte Typing-Indikatoren
- 📊 Zeichenzähler und Eingabevalidierung

## Projektstruktur

```
chat-frontend/
├── frontend/           # Web-Frontend
│   ├── index.html      # Hauptseite der Chat-Oberfläche
│   ├── style.css       # CSS-Styling
│   └── app.js          # Frontend-Logik
├── backend/            # Shared Backend für Web & Android
│   ├── server.js       # Express-Server für Claude API Integration
│   ├── package.json    # Node.js Dependencies
│   ├── .env.example    # Beispiel für Umgebungsvariablen
│   └── .gitignore      # Git-Ignore-Datei
├── android/            # Native Android App
│   ├── app/
│   │   └── src/main/java/com/claude/chat/
│   │       ├── model/          # Data Models
│   │       ├── network/        # API Service
│   │       ├── repository/     # Data Layer
│   │       ├── viewmodel/      # ViewModels
│   │       ├── ui/             # Jetpack Compose UI
│   │       └── MainActivity.kt
│   ├── build.gradle
│   └── README.md       # Android-spezifische Dokumentation
└── README.md           # Diese Datei
```

## Quick Start

### Web-Frontend

Siehe den [Web-Frontend Abschnitt](#web-frontend-installation) unten.

### Android App

Siehe [android/README.md](android/README.md) für detaillierte Anweisungen.

---

# Web-Frontend Installation

## Voraussetzungen

- Node.js (Version 16 oder höher)
- npm (kommt mit Node.js)
- Ein Anthropic API-Key ([hier registrieren](https://www.anthropic.com))

## Installation

### 1. Dependencies installieren

```bash
cd chat-frontend/backend
npm install
```

### 2. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env` Datei im `backend` Verzeichnis:

```bash
cp .env.example .env
```

Öffnen Sie die `.env` Datei und fügen Sie Ihren Anthropic API-Key ein:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
PORT=3000
NODE_ENV=development
```

## Verwendung

### Server starten

```bash
cd chat-frontend/backend
npm start
```

Oder für Entwicklung mit Auto-Reload:

```bash
npm run dev
```

### Chat-Oberfläche öffnen

Öffnen Sie Ihren Browser und navigieren Sie zu:

```
http://localhost:3000
```

## API-Endpunkte

### POST /api/chat

Sendet eine Nachricht an Claude und erhält eine Antwort.

**Request Body:**
```json
{
  "message": "Ihre Nachricht hier",
  "conversationHistory": [
    { "role": "user", "content": "Vorherige Nachricht" },
    { "role": "assistant", "content": "Vorherige Antwort" }
  ]
}
```

**Response:**
```json
{
  "response": "Claudes Antwort",
  "model": "claude-3-5-sonnet-20241022",
  "usage": {
    "input_tokens": 123,
    "output_tokens": 456
  }
}
```

### GET /api/health

Überprüft den Server-Status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-06T12:00:00.000Z"
}
```

## Konfiguration

### Claude Modell ändern

In `backend/server.js` können Sie das verwendete Claude-Modell ändern:

```javascript
model: 'claude-3-5-sonnet-20241022',  // Aktuelles Modell
// Alternativen:
// model: 'claude-3-opus-20240229',
// model: 'claude-3-haiku-20240307',
```

### Port ändern

Ändern Sie den Port in der `.env` Datei:

```
PORT=8080
```

Oder setzen Sie ihn beim Start:

```bash
PORT=8080 npm start
```

## Features im Detail

### Konversationshistorie

- Wird automatisch im Browser-LocalStorage gespeichert
- Bleibt auch nach Neuladen der Seite erhalten
- Kann durch Löschen des LocalStorage zurückgesetzt werden

### Zeichenzähler

- Zeigt die aktuelle Zeichenanzahl an
- Maximum: 4000 Zeichen
- Warnung bei Annäherung an das Limit (ab 3800 Zeichen)

### Error Handling

- Automatische Fehlerbehandlung für:
  - Netzwerkfehler
  - API-Fehler
  - Rate Limits
  - Ungültige API-Keys

### Responsive Design

- Optimiert für Desktop (900px max-width)
- Mobile-freundlich mit Touch-Support
- Anpassbare Textarea-Höhe

## Troubleshooting

### "API Key not configured" Fehler

Stellen Sie sicher, dass:
- Die `.env` Datei im `backend` Verzeichnis existiert
- Der `ANTHROPIC_API_KEY` in der `.env` Datei gesetzt ist
- Der Server neu gestartet wurde nach Änderung der `.env` Datei

### "Failed to fetch" Fehler

- Überprüfen Sie, ob der Backend-Server läuft
- Stellen Sie sicher, dass der Port korrekt ist (Standard: 3000)
- Prüfen Sie die Browser-Konsole auf CORS-Fehler

### Rate Limit Fehler

- Warten Sie einen Moment und versuchen Sie es erneut
- Überprüfen Sie Ihr API-Limit bei Anthropic

## Sicherheitshinweise

⚠️ **Wichtig:**

- Teilen Sie niemals Ihren API-Key
- Committen Sie niemals die `.env` Datei ins Repository
- Verwenden Sie für Production einen Reverse-Proxy (nginx, Apache)
- Implementieren Sie Rate-Limiting für Production

## Lizenz

MIT

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository.
