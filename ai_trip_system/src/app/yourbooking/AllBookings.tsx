'use client'

import BookingCard from "./Card";
import React from "react";
import { getCookie } from "cookies-next";
import Loading from "@/components/Loading";


// Define the Booking interface to specify the structure
interface Booking {
    idBooking: string;  // Thay đổi từ responseID sang idBooking
    // Add other properties as needed
}

export default function AllBookings() {
    // This component will render all bookings
    // You can fetch all bookings from the API and map through them to render BookingCard components
    const [isLoading, setIsLoading] = React.useState(true);
    const [bookings, setBookings] = React.useState<Booking[]>([]);
    const token = getCookie("token");
    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/bookings/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchBookings();
    }, []);

    if (isLoading) {
        return <Loading message="Đang tải dữ liệu đặt chỗ của bạn..." />;
    }

    if (!bookings.length) {
        return <div>Không tìm thấy đặt chỗ nào.</div>;
    }

    return (
        <div className="space-y-4">
            {bookings.slice(0, 10).map((booking) => (
                <BookingCard key={booking.idBooking} idBooking={booking.idBooking} />
            ))}
            
            {bookings.length > 10 && (
                <div className="text-center py-3 text-gray-600">
                    Hiển thị 10/{bookings.length} đặt chỗ.
                </div>
            )}
        </div>
    );
}
