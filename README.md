# QR Code Generator

A full-featured QR code generator with CLI, web UI, and theming support.

## Features

- **CLI**: Generate QR codes from the command line with customizable options.
- **Web UI**: Beautiful, responsive web interface with real-time QR generation.
- **Theme Support**: 4 built-in themes (Default, Light, Dark, Purple) + custom color picker.
- **Export/Import Themes**: Save and share your custom themes as JSON.
- **HTTPS Support**: Local self-signed certificate for secure development.
- **Unit Tests**: Pytest coverage for core functionality.
- **Integration Tests**: Playwright headless browser tests for the web UI.
- **CI/CD**: GitHub Actions workflow for automated testing.

## Quick Start

### Prerequisites

- Python 3.7+
- Windows PowerShell 5.1+ (for helper scripts)

### Installation

1. Clone or download this repository.
2. Create and activate a virtual environment:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install dependencies:
```powershell
pip install -r requirements.txt
```

### CLI Usage

Generate a QR code from the command line:

```powershell
python generate_qr.py "https://example.com" -o example.png
```

**Options:**
- `text`: Text or URL to encode (required).
- `-o, --output`: Output filename (default: `qrcode.png`).
- `--box-size`: Pixels per box (default: 10).
- `--border`: Border in boxes (default: 4).
- `--fill-color`: QR pattern color (default: `black`).
- `--back-color`: Background color (default: `white`).
- `--error`: Error correction level: `L` (7%), `M` (15%), `Q` (25%), `H` (30%) (default: `M`).

**Example:**
```powershell
python generate_qr.py "Hello World" -o hello.png --box-size 8 --border 2 --fill-color black --back-color white
```

### Web UI Usage

Start the Flask web application:

```powershell
.\run_web.ps1
```

The app will start on:
- **HTTP**: http://127.0.0.1:5000
- **HTTPS** (if cert is trusted): https://localhost:5443

**Features in the Web UI:**
1. Enter text or URL in the form.
2. Adjust QR settings (box size, border, error correction level).
3. Choose colors for QR and background.
4. Select a preset theme or customize with color pickers.
5. Generate QR code and download as PNG.
6. Export/import themes as JSON files.

### HTTPS Setup (Optional)

To enable HTTPS without browser warnings:

1. **Import the self-signed certificate into Windows Trusted Store** (CurrentUser, no admin needed):
```powershell
.\add_cert_trust.ps1 -PfxPath ".\certs\cert.pfx" -Password "qrcode-ssl-temp" -CurrentUser
```

2. **Restart your browser** and access: https://localhost:5443

**Note:** The certificate is self-signed and valid for localhost only. It's safe for local development.

## Testing

### Run Unit Tests

```powershell
python -m pytest tests/ -q
```

### Run CLI Tests

```powershell
python -m pytest tests/test_generate_qr.py -q
```

### Run Web UI Integration Tests (requires running server)

```powershell
python -m pytest tests/test_web_ui.py -q
```

## Project Structure

```
.
├── generate_qr.py           # CLI script
├── web_app.py              # Flask web application
├── requirements.txt         # Python dependencies
├── create_pem.py           # PFX → PEM certificate converter
├── create_cert_trust.ps1   # Certificate trust helper
├── run_qr.ps1              # CLI helper script
├── run_web.ps1             # Web app helper script
├── templates/
│   └── index.html          # Web UI HTML
├── static/
│   ├── style.css           # Web UI styling
│   └── app.js              # Web UI logic & theme management
├── tests/
│   ├── test_generate_qr.py # Unit tests for CLI
│   ├── test_web_app.py     # Flask endpoint tests
│   └── test_web_ui.py      # Playwright integration tests
├── certs/
│   ├── cert.pfx            # Self-signed cert (PFX format)
│   ├── cert.pem            # Self-signed cert (PEM format)
│   └── key.pem             # Private key (PEM format)
└── .github/
    └── workflows/
        └── ci.yml          # GitHub Actions CI workflow
```

## Development

### Available Scripts

| Script | Purpose |
|--------|---------|
| `run_qr.ps1` | Run the CLI with helper activation |
| `run_web.ps1` | Start the Flask web app (HTTP/HTTPS) |
| `create_pem.py` | Convert PFX certificate to PEM files |
| `add_cert_trust.ps1` | Import certificate into Windows trust store |

### Environment Variables

None required for local development.

### Customization

**Themes:** Edit `static/app.js` presets in the `presetToTheme()` function to add custom themes.

**Web UI Styling:** Modify `static/style.css` CSS variables (`:root` section) for quick rebranding.

## Security Notes

- **Self-Signed Certificate:** The PFX/PEM files are for development only. Do not use in production.
- **Private Repo:** Keep this repository private to avoid exposing sensitive configuration or certificate details.
- **Certificate Password:** The default password `qrcode-ssl-temp` is hardcoded in scripts for development. Use a secure secret management system in production.

## Troubleshooting

**HTTPS not working?**
- Ensure `certs/cert.pem` and `certs/key.pem` exist. If missing, run: `python create_pem.py --pfx certs/cert.pfx --password qrcode-ssl-temp`
- Import the certificate: `.\add_cert_trust.ps1 -PfxPath ".\certs\cert.pfx" -Password "qrcode-ssl-temp" -CurrentUser`
- Restart your browser.

**Can't import cert?**
- Run PowerShell as administrator if using LocalMachine store (default).
- Or use the `-CurrentUser` flag for per-user import (no admin required).

**Tests failing?**
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Run `pytest` with verbose output: `python -m pytest tests/ -v`

## License

Private project. Unauthorized copying or distribution is prohibited.

## Contributing

This is a private project. Contributions are limited to the owner.

---

**Created:** November 17, 2025  
**Language:** Python 3.7+  
**Framework:** Flask (web UI)  
**Testing:** Pytest + Playwright
