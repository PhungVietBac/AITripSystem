'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import {
  FaCalendarAlt,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";
import { useAuthCheck } from "@/hooks/useAuthCheck"; // Thêm import

function BookingPage() {
  const searchParams = useSearchParams();
  const { user } = useAuthCheck(); // Thêm để lấy user info
  const idPlace = searchParams.get("idPlace");
  const namePlace = searchParams.get("namePlace");
  const token = getCookie("token") as string;

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"1" | "0" | "2">("1");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Payment modal state
  interface BookingData {
    idbooking: string;
    // Add other fields
  }
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [amount, setAmount] = useState<number>(50000); // Default amount for testing
  const [paymentTimeout, setPaymentTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  // API đầu tiên - Tạo booking
  const createBooking = async () => {
    setIsLoading(true);
    try {
      if (!idPlace) {
        throw new Error("Thiếu thông tin địa điểm");
      }

            const requestBody = {
                idplace: idPlace,
                date: new Date(selectedDate).toISOString(),
                status: 1
            };
            console.log("Request payload:", requestBody);

      const response = await fetch(
        `https://aitripsystem-api.onrender.com/api/v1/bookings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`Lỗi ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Booking created:", data);

      // Lưu data và hiển thị modal xác nhận
      setBookingData(data);
      setShowConfirmModal(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      showToast("Có lỗi xảy ra khi đặt chỗ. Vui lòng thử lại sau.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // API thứ hai - Liên kết user với booking
  const confirmBooking = async () => {
    setIsLoading(true);
    try {
      if (!user?.userId) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      if (!bookingData?.idbooking) {
        throw new Error("Không tìm thấy ID booking");
      }

      const detailBookingBody = {
        iduser: user.userId,
        idbooking: bookingData.idbooking,
      };
      console.log("Detail booking payload:", detailBookingBody);

      const detailResponse = await fetch(
        `https://aitripsystem-api.onrender.com/api/v1/detail_bookings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(detailBookingBody),
        }
      );

      if (!detailResponse.ok) {
        const errorText = await detailResponse.text();
        console.error(
          "Detail Booking API Error:",
          detailResponse.status,
          errorText
        );
        throw new Error(
          `Lỗi liên kết user với booking ${detailResponse.status}: ${errorText}`
        );
      }

      const detailData = await detailResponse.json();
      console.log("Detail booking created:", detailData);

      // Thành công - hiển thị payment modal thay vì QR
      setShowConfirmModal(false);
      setShowPaymentModal(true);
      showToast(
        "Đặt chỗ đã được xác nhận! Vui lòng tiến hành thanh toán.",
        "success"
      );

      // Set timeout 15 minutes - if no payment success, set status to cancelled
      const timeout = setTimeout(async () => {
        // Update booking status to cancelled (2) via API
        if (bookingData?.idbooking) {
          try {
            const response = await fetch("/api/bookings/update-status", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                idbooking: bookingData.idbooking,
                status: 2,
              }),
            });

            if (response.ok) {
              console.log(
                "Booking status updated to cancelled (2) due to timeout"
              );
            }
          } catch (error) {
            console.error("Error updating booking status to cancelled:", error);
          }
        }

        setBookingStatus("2");
        setShowPaymentModal(false);
        showToast("Thanh toán đã hết hạn. Đặt chỗ đã bị hủy.", "error");
      }, 15 * 60 * 1000); // 15 minutes

      setPaymentTimeout(timeout);
    } catch (error) {
      console.error("Error confirming booking:", error);
      showToast(
        "Có lỗi xảy ra khi xác nhận đặt chỗ. Vui lòng thử lại sau.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = React.useCallback(
    (message: string, type: "success" | "error" | "info") => {
      setToast({
        visible: true,
        message,
        type,
      });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 5000);
    },
    []
  );

  // VNPay payment functions
  const handleVNPayPayment = async () => {
    setIsLoading(true);
    try {
      const orderDesc = bookingData?.idbooking
        ? `Dat cho cho ${bookingData.idbooking}`
        : "Thanh toan dat cho EXPLAVUE";

      const paymentData = new FormData();
      paymentData.append("amount", amount.toString());
      paymentData.append("order_desc", orderDesc);
      paymentData.append("bank_code", ""); // Leave blank for VNPay Gateway

      const response = await fetch("/api/vnpay/create-payment-url", {
        method: "POST",
        body: paymentData,
      });

      if (!response.ok) {
        throw new Error("Lỗi tạo URL thanh toán");
      }

      // Redirect to VNPay payment page
      const paymentUrl = await response.text();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error creating VNPay payment:", error);
      showToast("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment success callback
  const handlePaymentSuccess = React.useCallback(async () => {
    if (paymentTimeout) {
      clearTimeout(paymentTimeout);
      setPaymentTimeout(null);
    }

    // Update booking status to confirmed (0) via API
    if (bookingData?.idbooking) {
      try {
        const response = await fetch("/api/bookings/update-status", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idbooking: bookingData.idbooking,
            status: 0,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update booking status");
        }

        console.log("Booking status updated to confirmed (0)");
      } catch (error) {
        console.error("Error updating booking status:", error);
        showToast(
          "Thanh toán thành công nhưng có lỗi cập nhật trạng thái. Vui lòng liên hệ hỗ trợ.",
          "info"
        );
      }
    }

    setBookingStatus("0");
    setShowPaymentModal(false);
    showToast("Thanh toán thành công!", "success");
  }, [paymentTimeout, bookingData?.idbooking, token, showToast]);

  // Handle payment modal close
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    if (paymentTimeout) {
      clearTimeout(paymentTimeout);
      setPaymentTimeout(null);
    }
  };

  // Check for payment success callback in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    const vnpResponseCode = urlParams.get("vnp_ResponseCode");

    if (paymentStatus === "success" && vnpResponseCode === "00") {
      // Payment successful
      handlePaymentSuccess();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === "failed") {
      // Payment failed
      const errorCode = vnpResponseCode || urlParams.get("error") || "unknown";
      showToast(`Thanh toán không thành công. Mã lỗi: ${errorCode}`, "error");
      setShowPaymentModal(false);
      if (paymentTimeout) {
        clearTimeout(paymentTimeout);
        setPaymentTimeout(null);
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [handlePaymentSuccess, paymentTimeout, showToast]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const closeModal = async () => {
    // =============================    CORS    ====================================

    // console.log('=== DEBUG: Starting closeModal function ===');
    // console.log('bookingData:', bookingData);
    // console.log('bookingData?.idbooking:', bookingData?.idbooking);
    // console.log('token:', token ? 'Token exists' : 'No token');

    // // Nếu có bookingData, gọi API để xóa booking
    // if (bookingData?.idbooking) {
    //     try {
    //         const deleteUrl = `https://aitripsystem-api.onrender.com/api/v1/bookings/${bookingData.idbooking}`;
    //         console.log('=== DEBUG: DELETE API Call ===');
    //         console.log('DELETE URL:', deleteUrl);
    //         console.log('Request headers:', {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token ? token.substring(0, 20) + '...' : 'No token'}`
    //         });

    //         const deleteResponse = await fetch(deleteUrl, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         console.log('=== DEBUG: DELETE Response ===');
    //         console.log('Response status:', deleteResponse.status);
    //         console.log('Response statusText:', deleteResponse.statusText);
    //         console.log('Response headers:', Object.fromEntries(deleteResponse.headers.entries()));
    //         console.log('Response ok:', deleteResponse.ok);

    //         if (!deleteResponse.ok) {
    //             const errorText = await deleteResponse.text();
    //             console.error('=== DEBUG: DELETE Error Response ===');
    //             console.error("Delete Booking API Error:", deleteResponse.status, errorText);
    //             console.error('Full error response:', {
    //                 status: deleteResponse.status,
    //                 statusText: deleteResponse.statusText,
    //                 errorText: errorText,
    //                 url: deleteUrl
    //             });
    //             throw new Error(`Lỗi xóa booking ${deleteResponse.status}: ${errorText}`);
    //         }

    //         // Try to parse response if there's content
    //         let responseData = null;
    //         const contentType = deleteResponse.headers.get('content-type');
    //         console.log('Response content-type:', contentType);

    //         if (contentType && contentType.includes('application/json')) {
    //             responseData = await deleteResponse.json();
    //             console.log('DELETE Response data:', responseData);
    //         } else {
    //             const textResponse = await deleteResponse.text();
    //             console.log('DELETE Response text:', textResponse);
    //         }

    //         console.log('=== DEBUG: Booking deleted successfully ===');

    //         // Hiển thị toast thông báo hủy thành công
    //         showToast(
    //             'Bạn đã hủy đặt lịch, hi vọng chúng ta sẽ được gặp lại lần sau!',
    //             'info'
    //         );

    //     } catch (error) {
    //         console.error('=== DEBUG: DELETE Error Caught ===');
    //         console.error('Error type:', error.constructor.name);
    //         console.error('Error message:', error.message);
    //         console.error('Full error object:', error);
    //         console.error('Error stack:', error.stack);

    //         // Vẫn hiển thị toast nhưng với thông báo lỗi
    showToast("Có lỗi xảy ra khi hủy đặt chỗ. Vui lòng thử lại sau.", "info");
    //     }
    // } else {
    //     console.log('=== DEBUG: No booking data to delete ===');
    // }

    // console.log('=== DEBUG: Closing modal and resetting state ===');

    // =============================    CORS    ====================================
    // Đóng modal và reset state
    setShowConfirmModal(false);
    setBookingData(null);
    console.log("=== DEBUG: closeModal function completed ===");
  };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="bg-blue-600 text-white rounded-t-xl p-6 shadow-lg">
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                            <FaMapMarkerAlt className="mr-3" />
                            {namePlace || 'Đặt chỗ du lịch'}
                        </h1>
                        <p className="mt-2 opacity-80">ID địa điểm: {idPlace || 'Chưa xác định'}</p>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-b-xl p-6 shadow-lg mb-6 filter drop-shadow-lg backdrop-blur-md">
                        {/* Date Selection */}
                        <div className="mb-6">
                            <label className="text-gray-700 font-semibold mb-2 flex items-center">
                                <FaCalendarAlt className="mr-2 text-blue-500" />
                                Chọn ngày
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

            {/* QR Code Section */}
            <div className="my-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FaQrcode className="mr-2 text-blue-500" />
                Mã QR thanh toán
              </h3>

              {showQR ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center">
                  <div className="w-48 h-48 bg-white p-2 rounded-md shadow-md relative mb-4">
                    <Image
                      src="/images/elementor-placeholder-image.webp"
                      width={192}
                      height={192}
                      className="rounded-md"
                      alt="QR Code"
                      objectFit="contain"
                      priority
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Quét mã QR để hoàn tất thanh toán cho đặt chỗ của bạn
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-gray-500">
                  Mã QR sẽ hiển thị sau khi đặt chỗ
                </div>
              )}
            </div>

                        {/* Status Display */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                                <FaInfoCircle className="mr-2 text-blue-500" />
                                Trạng thái đặt chỗ
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center">
                                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                        bookingStatus === '0' ? 'bg-green-500' : 
                                        bookingStatus === '1' ? 'bg-yellow-500' : 
                                        'bg-red-500'
                                    }`}></span>
                                    <span className={`font-medium ${
                                        bookingStatus === '0' ? 'text-green-600' : 
                                        bookingStatus === '1' ? 'text-yellow-600' : 
                                        'text-red-600'
                                    }`}>
                                        {bookingStatus === '0' ? 'Đã xác nhận' : 
                                         bookingStatus === '1' ? 'Đang chờ xác nhận' : 
                                         'Đã hủy'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {bookingStatus === '0' 
                                        ? 'Đặt chỗ của bạn đã được xác nhận. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!' 
                                        : bookingStatus === '1'
                                        ? 'Đặt chỗ của bạn đang chờ xác nhận từ nhà cung cấp dịch vụ.'
                                        : 'Đặt chỗ đã bị hủy. Vui lòng liên hệ với chúng tôi để biết thêm thông tin.'}
                                </p>
                            </div>
                        </div>

            {/* Action Button */}
            <button
              className={`w-full py-3 rounded-md font-medium text-white shadow-md flex items-center justify-center ${
                isLoading || bookingStatus === "0"
                  ? "bg-green-900 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={createBooking}
              disabled={isLoading || bookingStatus === "0"}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : bookingStatus === "0" ? (
                "Đã thanh toán thành công"
              ) : (
                "Xác nhận đặt chỗ"
              )}
            </button>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Thông tin bổ sung
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đặt chỗ.
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                Bạn có thể hủy đặt chỗ trước 24 giờ mà không bị tính phí.
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                Liên hệ với chúng tôi qua hotline 0123456789 nếu cần hỗ trợ.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 filter backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Xác nhận đặt chỗ
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                Đặt chỗ đã được tạo thành công! Bạn có muốn tiếp tục xác nhận để
                hoàn tất quá trình đặt chỗ không?
              </p>

              {bookingData && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p>
                    <strong>ID Booking:</strong> {bookingData.idbooking}
                  </p>
                  <p>
                    <strong>Địa điểm:</strong> {namePlace}
                  </p>
                  <p>
                    <strong>Ngày:</strong>{" "}
                    {new Date(selectedDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmBooking}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VNPay Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 filter backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Thanh toán VNPay
              </h3>
              <button
                onClick={closePaymentModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                Vui lòng xác nhận thông tin thanh toán và tiến hành thanh toán
                qua VNPay.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 mb-4">
                <p>
                  <strong>ID Booking:</strong> {bookingData?.idbooking}
                </p>
                <p>
                  <strong>Địa điểm:</strong> {namePlace}
                </p>
                <p>
                  <strong>Ngày:</strong>{" "}
                  {new Date(selectedDate).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  <strong>Số tiền:</strong> {amount.toLocaleString("vi-VN")} VND
                </p>
                <p>
                  <strong>Mô tả:</strong>{" "}
                  {bookingData?.idbooking
                    ? `Dat cho cho ${bookingData.idbooking}`
                    : "Thanh toan dat cho EXPLAVUE"}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm">
                  ⏰ Thời gian thanh toán: 15 phút. Sau thời gian này, đặt chỗ
                  sẽ tự động bị hủy.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền thanh toán (VND)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1000"
                  step="1000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Số tiền test cho sandbox VNPay
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closePaymentModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleVNPayPayment}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Thanh toán với VNPay"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Toast Notification */}
            {toast.visible && (
                <div className={`fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg border-l-4 ${
                    toast.type === 'success' ? 'border-green-500' : 
                    toast.type === 'error' ? 'border-red-500' : 'border-blue-500'
                } animate-slide-up`}>
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className={`flex-shrink-0 ${
                                toast.type === 'success' ? 'text-green-500' :
                                toast.type === 'error' ? 'text-red-500' : 'text-blue-500'
                            }`}>
                                {toast.type === 'success' && (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {toast.type === 'error' && (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                                {toast.type === 'info' && (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800 whitespace-pre-line">
                                    {toast.message}
                                </p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setToast(prev => ({ ...prev, visible: false }))}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingPage;