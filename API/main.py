from fastapi import FastAPI
from controllers import friend_ctrl, booking_ctrl

app = FastAPI()

app.include_router(friend_ctrl.router, prefix="/api/v1", tags=["friends"])
app.include_router(booking_ctrl.router, prefix="/api/v1", tags=["bookings"])