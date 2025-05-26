'use client'

import BookingCard from "./Card";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getCookie } from "cookies-next";
import Filter, { FilterOptions } from './Filter';
import Loading from "@/components/Loading";

interface Booking {
    idBooking: string;
}

export default function AllBookings() {
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const token = getCookie("token");
    const fetchBookings = async (filters: FilterOptions) => {
        setIsLoading(true);

        try {
            let url = 'https://aitripsystem-api.onrender.com/api/v1/bookings/';

            // Nếu có filter
            if (filters.select !== 'all' && filters.lookup) {
                url = `https://aitripsystem-api.onrender.com/api/v1/bookings/${filters.select}?lookup=${encodeURIComponent(filters.lookup)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setBookings(data);
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings({ select: 'all', lookup: '' });
    }, []);

    const handleFilterChange = (filters: FilterOptions) => {
        fetchBookings(filters);
    };

    return (
        <div className="space-y-4">
            <Filter onFilterChange={handleFilterChange} />

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loading message="Đang tải dữ liệu đặt chỗ..." />
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-md text-gray-500 text-center">
                    <p>Không tìm thấy đặt chỗ nào</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.slice(0, 10).map((booking) => (
                        <BookingCard key={booking.idBooking} idBooking={booking.idBooking} />
                    ))}

                    {bookings.length > 10 && (
                        <div className="text-center py-3 text-gray-600">
                            Hiển thị 10/{bookings.length} đặt chỗ.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
