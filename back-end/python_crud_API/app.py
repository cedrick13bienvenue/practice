from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from config.config import config
from routes.booking_routes import api as bookings_ns


def create_app():
    """Application factory pattern"""
    app = Flask(__name__)

    # Enable CORS
    CORS(app)

    # Configure Flask-RESTX
    api = Api(
        app,
        version='1.0',
        title='Moto Booking API',
        description='A RESTful API for managing moto taxi bookings in Kigali',
        doc='/docs',
        prefix='/api/v1'
    )

    # Register namespaces
    api.add_namespace(bookings_ns, path='/bookings')

    return app


if __name__ == '__main__':
    app = create_app()
    print(f"Moto Booking API running at http://{config.HOST}:{config.PORT}")
    print(
        f"Swagger documentation available at http://{config.HOST}:{config.PORT}/docs")
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
