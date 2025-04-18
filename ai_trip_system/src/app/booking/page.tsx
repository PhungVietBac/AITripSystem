import BookingForm from '@/app/booking/BookingForm';

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Thông tin đặt lịch</h1>
          <BookingForm />
        </div>
      </main>
    </div>
  );
}
