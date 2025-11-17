[![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml)

QR Code Generator

This repository contains a small Python script to generate QR code images from a command-line text argument.

Requirements

- Python 3.7+
- Install the Python dependencies:

PowerShell

```
python -m pip install -r requirements.txt
```

Usage

PowerShell example:

```
python generate_qr.py "https://example.com" -o example.png
```

Options

- `text`: The text or URL to encode (positional argument).
- `-o, --output`: Output filename (defaults to `qrcode.png`).
- `--box-size`: Pixels per box (default 10).
- `--border`: Border in boxes (default 4).
- `--fill-color`: QR color (default `black`).
- `--back-color`: Background color (default `white`).
- `--error`: Error correction level: `L`, `M`, `Q`, or `H` (default `M`).

Example

```
python generate_qr.py "Hello from PowerShell" -o hello.png --box-size 8 --border 2
```

Badge notes

- Replace `<OWNER>/<REPO>` in the badge URL above with your GitHub repository path to enable the workflow status badge.
