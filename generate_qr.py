#!/usr/bin/env python3
"""Generate a QR code image from a command-line text argument.

Usage:
  python generate_qr.py "Hello world" -o hello.png

Requires: qrcode[pil], Pillow
"""
import argparse
import sys

import qrcode


def parse_args():
    parser = argparse.ArgumentParser(description="Generate a QR code image from text")
    parser.add_argument('text', help='Text or URL to encode into the QR code')
    parser.add_argument('-o', '--output', default='qrcode.png', help='Output filename (default: qrcode.png)')
    parser.add_argument('--box-size', type=int, default=10, help='Number of pixels per QR box (default: 10)')
    parser.add_argument('--border', type=int, default=4, help='Border size in boxes (default: 4)')
    parser.add_argument('--fill-color', default='black', help='Fill color for the QR (default: black)')
    parser.add_argument('--back-color', default='white', help='Background color (default: white)')
    parser.add_argument('--error', choices=['L', 'M', 'Q', 'H'], default='M', help='Error correction level (L, M, Q, H)')
    return parser.parse_args()


def generate_qr(text: str, output: str = 'qrcode.png', box_size: int = 10, border: int = 4,
                fill_color: str = 'black', back_color: str = 'white', error: str = 'M') -> str:
    """Generate and save a QR code image.

    Returns the output filename on success.
    """

    ec_map = {
        'L': qrcode.constants.ERROR_CORRECT_L,
        'M': qrcode.constants.ERROR_CORRECT_M,
        'Q': qrcode.constants.ERROR_CORRECT_Q,
        'H': qrcode.constants.ERROR_CORRECT_H,
    }

    qr = qrcode.QRCode(
        version=None,
        error_correction=ec_map[error],
        box_size=box_size,
        border=border,
    )

    qr.add_data(text)
    qr.make(fit=True)

    img = qr.make_image(fill_color=fill_color, back_color=back_color)

    img.save(output)
    return output


def main():
    args = parse_args()

    try:
        out = generate_qr(
            text=args.text,
            output=args.output,
            box_size=args.box_size,
            border=args.border,
            fill_color=args.fill_color,
            back_color=args.back_color,
            error=args.error,
        )
    except Exception as e:
        print(f"Failed to save image to {args.output}: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"QR code saved to {out}")


if __name__ == '__main__':
    main()
