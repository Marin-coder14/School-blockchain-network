from flask import Flask, render_template, request, send_file, make_response
import qrcode
from io import BytesIO

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
    else:
        data = request.get_json(silent=True) or {}
        text = data.get('text')

    if not text:
        return make_response('Missing `text` parameter', 400)

    # Build QR image in memory
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M)
    qr.add_data(text)
    qr.make(fit=True)
    img = qr.make_image(fill_color='black', back_color='white')

    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)

    return send_file(buf, mimetype='image/png')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
