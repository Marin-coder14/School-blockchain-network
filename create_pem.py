"""Convert a PFX (PKCS#12) file to PEM cert and key files.

Usage:
  python create_pem.py --pfx certs/cert.pfx --password qrcode-ssl-temp

This script requires the `cryptography` package.
"""
import argparse
from cryptography.hazmat.primitives.serialization import Encoding, PrivateFormat, NoEncryption
from cryptography.hazmat.primitives.serialization.pkcs12 import load_key_and_certificates


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--pfx', required=True)
    parser.add_argument('--password', required=False, default=None)
    args = parser.parse_args()

    password = args.password.encode('utf-8') if args.password else None

    with open(args.pfx, 'rb') as f:
        data = f.read()

    private_key, cert, additional = load_key_and_certificates(data, password)

    if cert is None:
        raise SystemExit('No certificate found in the PFX file')

    # Write cert.pem
    cert_pem = cert.public_bytes(Encoding.PEM)
    with open('certs/cert.pem', 'wb') as f:
        f.write(cert_pem)

    # Write key.pem
    if private_key is not None:
        key_pem = private_key.private_bytes(Encoding.PEM, PrivateFormat.TraditionalOpenSSL, NoEncryption())
        with open('certs/key.pem', 'wb') as f:
            f.write(key_pem)

    print('Wrote certs/cert.pem and certs/key.pem')


if __name__ == '__main__':
    main()
