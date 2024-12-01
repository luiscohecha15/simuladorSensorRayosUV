import random
import time
import requests
from datetime import datetime

# Configuración del sensor
sensor_id = "HHHH1234"  # Reemplaza con tu propio id
url_api = "http://localhost:5000/api/sensores"  # URL de la API Flask

def generar_dato_sensor():
    """Generar un valor aleatorio para el sensor"""
    valor = random.uniform(0, 1000)  # Simula valores de rayos UV
    return valor

def enviar_dato_sensor():
    """Enviar los datos generados a la API"""
    fecha_hora = datetime.now()
    fecha = fecha_hora.date().isoformat()
    hora = fecha_hora.time().isoformat()

    valor_sensor = generar_dato_sensor()

    data = {
        "id_sensor": sensor_id,
        "valor": valor_sensor,
        "fecha": fecha,
        "hora": hora
    }

    response = requests.post(url_api, json=data)
    if response.status_code == 200:
        print(f"Datos enviados correctamente: {data}")
    else:
        print(f"Error al enviar los datos: {response.status_code}")

if __name__ == "__main__":
    while True:
        enviar_dato_sensor()
        time.sleep(1000)  # Enviar datos cada 5 segundos
