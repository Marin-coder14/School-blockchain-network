from flask import Flask, render_template, request, send_file, make_response
import qrcode
from io import BytesIO
import os
import ssl

app = Flask(__name__, static_folder='static', template_folder='templates')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    # Accept form-encoded or JSON
    text = None
    if request.form and 'text' in request.form:
        text = request.form['text']
        box_size = int(request.form.get('box-size', 10))
        border = int(request.form.get('border', 4))
        fill_color = request.form.get('fill-color', 'black')
        back_color = request.form.get('back-color', 'white')
        error = request.form.get('error', 'M')
    else:
        data = request.get_json(silent=True) or {}
        text = data.get('text')
        box_size = data.get('box_size', 10)
        border = data.get('border', 4)
        fill_color = data.get('fill_color', 'black')
        back_color = data.get('back_color', 'white')
        error = data.get('error', 'M')

    if not text:
        return make_response('Missing `text` parameter', 400)

    ec_map = {
        'L': qrcode.constants.ERROR_CORRECT_L,
        'M': qrcode.constants.ERROR_CORRECT_M,
        'Q': qrcode.constants.ERROR_CORRECT_Q,
        'H': qrcode.constants.ERROR_CORRECT_H,
    }

    # Build QR image in memory
    qr = qrcode.QRCode(
        error_correction=ec_map.get(error, qrcode.constants.ERROR_CORRECT_M),
        box_size=box_size,
        border=border,
    )
    qr.add_data(text)
    qr.make(fit=True)
    img = qr.make_image(fill_color=fill_color, back_color=back_color)

    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)

    return send_file(buf, mimetype='image/png')


if __name__ == '__main__':
    cert_dir = os.path.join(os.path.dirname(__file__), 'certs')
    cert_file = os.path.join(cert_dir, 'cert.pfx')
    
    # Check if cert exists and use HTTPS if available
    if os.path.exists(cert_file):
        print("HTTPS certificate found. Running on https://127.0.0.1:5443")
        print("Note: Your browser may warn about the self-signed certificate (this is normal).")
        try:
            ctx = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
            ctx.load_cert_chain(cert_file, password=b'qrcode-ssl-temp')
            app.run(host='127.0.0.1', port=5443, ssl_context=ctx, debug=True)
        except Exception as e:
            print(f"HTTPS failed ({e}). Falling back to HTTP on port 5000.")
            app.run(host='127.0.0.1', port=5000, debug=True)
    else:
        print("No HTTPS certificate found. Running HTTP on http://127.0.0.1:5000")
        app.run(host='127.0.0.1', port=5000, debug=True)
