from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import io

app = Flask(__name__)
CORS(app)

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        img = Image.open(image_file.stream)
        text = pytesseract.image_to_string(img)
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
