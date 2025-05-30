from fastapi import FastAPI
from controllers import review_ctrl, trip_ctrl, trip_member_ctrl, user_ctrl, auth_ctrl, booking_ctrl, notification_ctrl, friend_ctrl, ai_recommendation_ctrl, detail_information_ctrl, place_ctrl, detail_booking_ctrl, social_auth_ctrl, conversation_ctrl, message_ctrl

app = FastAPI()

app.include_router(auth_ctrl.router, prefix="/api/v1", tags=["auth"])
app.include_router(social_auth_ctrl.router, prefix="/api/v1", tags=["auth"])
app.include_router(user_ctrl.router, prefix="/api/v1", tags=["users"])
app.include_router(friend_ctrl.router, prefix="/api/v1", tags=["friends"])
app.include_router(notification_ctrl.router, prefix="/api/v1", tags=["notifications"])
app.include_router(trip_ctrl.router, prefix="/api/v1", tags=["trips"])
app.include_router(trip_member_ctrl.router, prefix="/api/v1", tags=["trip_members"])
app.include_router(place_ctrl.router, prefix="/api/v1", tags=["places"])
app.include_router(detail_information_ctrl.router, prefix="/api/v1", tags=["detail_informations"])
app.include_router(review_ctrl.router, prefix="/api/v1", tags=["reviews"])
app.include_router(booking_ctrl.router, prefix="/api/v1", tags=["bookings"])
app.include_router(detail_booking_ctrl.router, prefix="/api/v1", tags=["detail_bookings"])
app.include_router(ai_recommendation_ctrl.router, prefix="/api/v1", tags=["ai_recommendations"])
app.include_router(conversation_ctrl.router, prefix="/api/v1", tags=["conversations"])
app.include_router(message_ctrl.router, prefix="/api/v1", tags=["messages"])