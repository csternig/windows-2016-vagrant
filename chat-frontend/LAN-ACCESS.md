# LAN-Zugriff auf Claude Chat Backend

Diese Anleitung zeigt, wie Sie das Claude Chat Backend so konfigurieren, dass andere Geräte im lokalen Netzwerk (LAN) darauf zugreifen können.

## 🌐 Was wurde konfiguriert

Das Backend ist bereits so konfiguriert, dass es auf allen Netzwerk-Interfaces lauscht (`0.0.0.0`), nicht nur auf `localhost`. Das bedeutet:

- ✅ Zugriff vom gleichen PC: `http://localhost:3000`
- ✅ Zugriff von anderen Geräten im LAN: `http://IHRE_IP:3000`

## 🚀 Server starten

1. **Backend starten:**
   ```bash
   cd chat-frontend/backend
   npm start
   ```

2. **IP-Adresse notieren:**
   Der Server zeigt beim Start automatisch die LAN-IP-Adresse an:
   ```
   🌐 LAN access (from other devices):
      http://192.168.1.100:3000
   ```

## 📱 Von anderen Geräten zugreifen

### Web-Browser (PC, Smartphone, Tablet)

Öffnen Sie auf dem anderen Gerät einen Browser und navigieren Sie zu:
```
http://192.168.1.100:3000
```
(Ersetzen Sie `192.168.1.100` durch Ihre angezeigte IP-Adresse)

### Android App

Ändern Sie in der Android App die API URL:

**Datei:** `android/app/build.gradle`

```gradle
defaultConfig {
    // Ändern Sie diese Zeile:
    buildConfigField "String", "API_BASE_URL", "\"http://192.168.1.100:3000/api/\""
}
```

Dann:
1. Gradle Sync durchführen
2. App neu bauen und installieren

## 🔧 IP-Adresse manuell ermitteln

### Windows 11/10

**PowerShell:**
```powershell
ipconfig
```

Suchen Sie nach "IPv4-Adresse" unter Ihrem aktiven Netzwerkadapter (z.B. "Ethernet" oder "WLAN"):
```
IPv4-Adresse. . . . . . . . . . : 192.168.1.100
```

**Alternative:**
```powershell
# Nur die IP-Adresse anzeigen
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}).IPAddress
```

### Linux/macOS

```bash
# Linux
ip addr show | grep "inet " | grep -v 127.0.0.1

# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## 🛡️ Windows Firewall konfigurieren

### Option 1: Regel für Node.js erstellen (empfohlen)

1. Öffnen Sie "Windows Defender Firewall mit erweiterter Sicherheit"
   - Drücken Sie `Win + R`
   - Geben Sie ein: `wf.msc`
   - Enter drücken

2. Klicken Sie auf "Eingehende Regeln" → "Neue Regel..."

3. Wählen Sie:
   - Regeltyp: **Programm**
   - Programmpfad: `C:\Program Files\nodejs\node.exe`
   - Aktion: **Verbindung zulassen**
   - Profile: **Privat** und **Domäne** (NICHT Öffentlich)
   - Name: **Node.js Claude Chat Backend**

### Option 2: Regel für Port erstellen

1. Öffnen Sie "Windows Defender Firewall mit erweiterter Sicherheit"
2. Klicken Sie auf "Eingehende Regeln" → "Neue Regel..."
3. Wählen Sie:
   - Regeltyp: **Port**
   - Protokoll: **TCP**
   - Port: **3000** (oder Ihr konfigurierter Port)
   - Aktion: **Verbindung zulassen**
   - Profile: **Privat** und **Domäne**
   - Name: **Claude Chat Backend Port 3000**

### Option 3: Schnell-Befehl (PowerShell als Administrator)

```powershell
# Firewall-Regel für Port 3000 hinzufügen
New-NetFirewallRule -DisplayName "Claude Chat Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -Profile Private,Domain
```

### Firewall-Popup beim ersten Start

Wenn Sie den Server das erste Mal starten, erscheint eventuell ein Windows-Popup:

✅ **Klicken Sie auf "Zugriff zulassen"** für:
- ✅ Private Netzwerke (z.B. Heimnetzwerk)
- ❌ Öffentliche Netzwerke (aus Sicherheitsgründen)

## 🧪 Verbindung testen

### Von einem anderen Gerät:

1. **Browser-Test:**
   ```
   http://192.168.1.100:3000/api/health
   ```

   Erwartete Antwort:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-06T12:00:00.000Z"
   }
   ```

2. **Ping-Test (optional):**
   ```bash
   ping 192.168.1.100
   ```

### Von Windows 11 PC (wo der Server läuft):

**PowerShell:**
```powershell
# Test auf localhost
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET

# Test auf LAN-IP
Invoke-WebRequest -Uri "http://192.168.1.100:3000/api/health" -Method GET
```

## ⚠️ Troubleshooting

### Problem: Verbindung wird abgelehnt

**Mögliche Ursachen:**

1. **Server läuft nicht:**
   - Überprüfen Sie, ob `npm start` läuft
   - Keine Fehlermeldungen im Terminal?

2. **Firewall blockiert:**
   - Siehe [Firewall-Konfiguration](#windows-firewall-konfigurieren)
   - Temporär testen: Firewall kurz deaktivieren (nicht empfohlen für längere Zeit)

3. **Falsche IP-Adresse:**
   - Überprüfen Sie mit `ipconfig`
   - Server zeigt die richtige IP beim Start an

4. **Router-Isolation (AP Isolation):**
   - Manche Router isolieren WLAN-Clients voneinander
   - Überprüfen Sie Router-Einstellungen
   - Verbinden Sie beide Geräte per Kabel oder deaktivieren Sie AP-Isolation

### Problem: CORS-Fehler im Browser

Das sollte nicht passieren, da `cors()` ohne Einschränkungen konfiguriert ist. Falls doch:

**In `backend/server.js`:**
```javascript
// Ersetzen Sie:
app.use(cors());

// Mit:
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
```

### Problem: "Cannot GET /"

Wenn Sie die Root-URL aufrufen und einen Fehler sehen:
- Das ist normal, wenn nur die API läuft
- Rufen Sie stattdessen `/api/health` auf
- Oder öffnen Sie die Frontend-HTML-Dateien

## 🔒 Sicherheitshinweise

⚠️ **Wichtig für den Produktionsbetrieb:**

1. **Verwenden Sie HTTPS** statt HTTP in Produktion
2. **Setzen Sie CORS-Restriktionen** für Produktionsumgebungen
3. **Verwenden Sie Authentifizierung** wenn von außen zugänglich
4. **Aktivieren Sie Firewall** nur für vertrauenswürdige Netzwerke
5. **API-Key schützen** - niemals im Frontend hardcoden

### Beispiel: CORS nur für bestimmte Domains

```javascript
app.use(cors({
    origin: [
        'http://192.168.1.100:3000',
        'http://localhost:3000'
    ]
}));
```

## 📊 Netzwerk-Topologie

```
┌─────────────────────┐
│   Windows 11 PC     │
│  (Server läuft)     │
│  192.168.1.100:3000 │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │   Router    │
    └──────┬──────┘
           │
    ┌──────┴────────────────┬─────────────┐
    │                       │             │
┌───┴────┐          ┌───────┴──┐    ┌────┴─────┐
│Laptop  │          │Smartphone│    │ Tablet   │
│192...  │          │192...    │    │192...    │
└────────┘          └──────────┘    └──────────┘
```

Alle Geräte können auf `http://192.168.1.100:3000` zugreifen.

## ✅ Checkliste

- [ ] Server läuft mit `npm start`
- [ ] LAN-IP-Adresse notiert (wird beim Start angezeigt)
- [ ] Windows Firewall-Regel erstellt
- [ ] Von anderem Gerät `/api/health` erfolgreich aufgerufen
- [ ] Chat-Interface funktioniert

## 🎯 Nächste Schritte

- Testen Sie die Web-App von verschiedenen Geräten
- Konfigurieren Sie die Android App mit der LAN-IP
- Bei Bedarf: Richten Sie einen Reverse-Proxy (nginx) ein
- Für Produktion: HTTPS-Zertifikat einrichten

## 💡 Tipps

1. **Statische IP vergeben:**
   Konfigurieren Sie in Ihrem Router eine statische IP für Ihren PC, damit sich die Adresse nicht ändert.

2. **Port-Forwarding (für Internet-Zugriff):**
   Falls Sie von außerhalb Ihres Heimnetzwerks zugreifen möchten, konfigurieren Sie Port-Forwarding im Router. **Achtung:** Nur mit HTTPS und Authentifizierung!

3. **Dynamisches DNS:**
   Für Internet-Zugriff mit wechselnder IP können Sie DynDNS-Dienste wie No-IP oder DuckDNS nutzen.

## 📞 Support

Bei Problemen:
1. Überprüfen Sie die Server-Logs im Terminal
2. Testen Sie mit `curl` oder PowerShell
3. Deaktivieren Sie temporär die Firewall zum Testen
4. Erstellen Sie ein Issue im Repository
