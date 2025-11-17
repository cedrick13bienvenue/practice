from flask_restx import fields


class BookingModel:
    """Booking data model"""

    @staticmethod
    def get_model(api):
        """Returns the Flask-RESTX model for Swagger documentation"""
        return api.model('Booking', {
            'id': fields.Integer(readonly=True, description='Unique booking identifier'),
            'customer_name': fields.String(required=True, description='Customer name'),
            'pickup': fields.String(required=True, description='Pickup location'),
            'destination': fields.String(required=True, description='Destination location'),
            'fare': fields.Integer(required=True, description='Fare amount in RWF'),
            'status': fields.String(required=True, description='Booking status',
                                    enum=['pending', 'confirmed', 'completed', 'cancelled'])
        })

    @staticmethod
    def get_input_model(api):
        """Returns the input model (without id)"""
        return api.model('BookingInput', {
            'customer_name': fields.String(required=True, description='Customer name'),
            'pickup': fields.String(required=True, description='Pickup location'),
            'destination': fields.String(required=True, description='Destination location'),
            'fare': fields.Integer(required=True, description='Fare amount in RWF'),
            'status': fields.String(required=True, description='Booking status',
                                    enum=['pending', 'confirmed', 'completed', 'cancelled'])
        })

    @staticmethod
    def get_update_model(api):
        """Returns the update model (all fields optional)"""
        return api.model('BookingUpdate', {
            'customer_name': fields.String(description='Customer name'),
            'pickup': fields.String(description='Pickup location'),
            'destination': fields.String(description='Destination location'),
            'fare': fields.Integer(description='Fare amount in RWF'),
            'status': fields.String(description='Booking status',
                                    enum=['pending', 'confirmed', 'completed', 'cancelled'])
        })
