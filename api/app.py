import firebase_admin
from firebase_admin import credentials, db
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Importar Flask-CORS

# Inicializar Firebase con el archivo de credenciales
cred = credentials.Certificate("firebase_credentials/firebase-credentials.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://sensorpy-9c79f-default-rtdb.firebaseio.com/'  # URL de tu Realtime Database
})

# Crear la aplicación Flask
app = Flask(__name__)

# Habilitar CORS para todas las rutas (permitir todas las solicitudes desde cualquier origen)
CORS(app)

@app.route("/")
def index():
    # Servir la página HTML desde la carpeta templates
    return render_template('index.html')

@app.route("/api/sensores", methods=["POST"])
def recibir_dato_sensor():
    try:
        data = request.get_json()

        # Validar los datos recibidos
        if "id_sensor" not in data or "valor" not in data or "fecha" not in data or "hora" not in data:
            return jsonify({"error": "Datos incompletos"}), 400

        # Referencia a la base de datos de Firebase Realtime Database
        ref = db.reference('/sensores')

        # Guardar los datos en Realtime Database
        ref.push({
            "id_sensor": data["id_sensor"],
            "valor": data["valor"],
            "fecha": data["fecha"],
            "hora": data["hora"]
        })

        return jsonify({"message": "Datos recibidos y almacenados correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/sensores", methods=["GET"])
def obtener_datos():
    try:
        # Referencia a la base de datos de Firebase Realtime Database
        ref = db.reference('/sensores')

        # Obtener los datos de la base de datos, los últimos 20 datos
        datos = ref.order_by_key().limit_to_last(5).get()

        # Si no hay datos, devolver un arreglo vacío
        if not datos:
            return jsonify([]), 200

        # Convertir los datos en una lista
        datos_list = []
        for key, value in datos.items():
            value['id'] = key  # Agregar el ID para cada dato
            datos_list.append(value)

        return jsonify(datos_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
