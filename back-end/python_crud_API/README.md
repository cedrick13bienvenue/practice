# ALU_CRUD_API

A simple Python HTTP server implementing full CRUD operations for a moto booking system.

## Features

- **Create** new bookings
- **Read** all bookings or a specific booking by ID
- **Update** existing bookings
- **Delete** bookings

## Setup

1. Ensure you have Python 3 installed
2. Navigate to the project directory
3. Run the server:
   ```bash
   python server.py
   ```

The server will start at `http://127.0.0.1:8000`

## API Endpoints

### GET - Retrieve Bookings

**Get all bookings:**

```bash
curl http://127.0.0.1:8000
```

**Get a specific booking by ID:**

```bash
curl http://127.0.0.1:8000?id=1
```

### POST - Create a New Booking

```bash
curl -X POST http://127.0.0.1:8000 \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John",
    "pickup": "Kigali City Center",
    "destination": "Airport",
    "fare": 3000,
    "status": "pending"
  }'
```

### PUT - Update an Existing Booking

```bash
curl -X PUT "http://127.0.0.1:8000?id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "fare": 1500
  }'
```

### DELETE - Remove a Booking

```bash
curl -X DELETE "http://127.0.0.1:8000?id=1"
```

## Data Structure

Each booking contains:

- `id` (number) - Auto-generated unique identifier
- `customer_name` (string) - Name of the customer
- `pickup` (string) - Pickup location
- `destination` (string) - Destination location
- `fare` (number) - Fare amount in RWF
- `status` (string) - Booking status (e.g., "pending", "confirmed", "completed")

## Data Storage

Bookings are stored in `data.json` and persist across server restarts.
