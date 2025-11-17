import json
import os
from typing import List, Dict, Optional


class BookingService:
    """Service layer for booking operations"""

    def __init__(self, data_file: str):
        self.data_file = data_file
        self._ensure_data_file_exists()

    def _ensure_data_file_exists(self):
        """Create data file and directory if they don't exist"""
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        if not os.path.exists(self.data_file):
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump([], f)

    def read_all(self) -> List[Dict]:
        """Read all bookings"""
        with open(self.data_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def read_by_id(self, booking_id: int) -> Optional[Dict]:
        """Read a specific booking by ID"""
        bookings = self.read_all()
        return next((b for b in bookings if b['id'] == booking_id), None)

    def create(self, booking_data: Dict) -> Dict:
        """Create a new booking"""
        bookings = self.read_all()
        new_id = max([b['id'] for b in bookings], default=0) + 1
        booking_data['id'] = new_id
        bookings.append(booking_data)
        self._write(bookings)
        return booking_data

    def update(self, booking_id: int, update_data: Dict) -> Optional[Dict]:
        """Update an existing booking"""
        bookings = self.read_all()
        booking = next((b for b in bookings if b['id'] == booking_id), None)

        if booking:
            booking.update(update_data)
            booking['id'] = booking_id  # Ensure ID remains unchanged
            self._write(bookings)
            return booking
        return None

    def delete(self, booking_id: int) -> bool:
        """Delete a booking"""
        bookings = self.read_all()
        original_length = len(bookings)
        bookings = [b for b in bookings if b['id'] != booking_id]

        if len(bookings) < original_length:
            self._write(bookings)
            return True
        return False

    def _write(self, data: List[Dict]):
        """Write data to file"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
