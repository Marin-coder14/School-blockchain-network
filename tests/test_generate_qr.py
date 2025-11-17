import os
import tempfile

from generate_qr import generate_qr
from PIL import Image


def test_generate_qr_creates_png():
    fd, path = tempfile.mkstemp(suffix='.png')
    os.close(fd)
    try:
        out = generate_qr('pytest test', output=path)
        assert os.path.exists(out)
        # try opening with Pillow to ensure it's a valid image
        img = Image.open(out)
        assert img.format == 'PNG'
    finally:
        try:
            os.remove(path)
        except OSError:
            pass
