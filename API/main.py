from fastapi import FastAPI
from controllers import trip_ctrl, user_ctrl, trip_member_ctrl, review_ctrl

app = FastAPI()

app.include_router(trip_ctrl.router, prefix="/api/v1", tags=["trips"])
app.include_router(user_ctrl.router, prefix="/api/v1", tags=["users"])
app.include_router(trip_member_ctrl.router, prefix="/api/v1", tags=["trip_members"])
# Include the routes from the controllers
