from flask import request
from flask_restx import Namespace, Resource
from models.booking import BookingModel
from services.booking_service import BookingService
from config.config import config

# Create namespace
api = Namespace('bookings', description='Moto booking operations')

# Initialize service
booking_service = BookingService(config.DATA_FILE)

# Define models
booking_model = BookingModel.get_model(api)
booking_input_model = BookingModel.get_input_model(api)
booking_update_model = BookingModel.get_update_model(api)


@api.route('/')
class BookingList(Resource):
    @api.doc('list_bookings')
    @api.marshal_list_with(booking_model)
    def get(self):
        """Get all bookings"""
        return booking_service.read_all()

    @api.doc('create_booking')
    @api.expect(booking_input_model)
    @api.marshal_with(booking_model, code=201)
    def post(self):
        """Create a new booking"""
        return booking_service.create(api.payload), 201


@api.route('/<int:id>')
@api.param('id', 'The booking identifier')
@api.response(404, 'Booking not found')
class BookingDetail(Resource):
    @api.doc('get_booking')
    @api.marshal_with(booking_model)
    def get(self, id):
        """Get a booking by ID"""
        booking = booking_service.read_by_id(id)
        if booking is None:
            api.abort(404, f"Booking {id} not found")
        return booking

    @api.doc('update_booking')
    @api.expect(booking_update_model)
    @api.marshal_with(booking_model)
    def put(self, id):
        """Update a booking"""
        booking = booking_service.update(id, api.payload)
        if booking is None:
            api.abort(404, f"Booking {id} not found")
        return booking

    @api.doc('delete_booking')
    @api.response(204, 'Booking deleted')
    def delete(self, id):
        """Delete a booking"""
        if not booking_service.delete(id):
            api.abort(404, f"Booking {id} not found")
        return '', 204
