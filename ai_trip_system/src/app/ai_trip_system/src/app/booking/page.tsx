export default function IntroPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Welcome to Our Booking System</h1>
        <p className="mb-4">Here you can find the best options for your travel needs.</p>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Explore Our Features</h2>
          <ul className="list-disc list-inside">
            <li>Easy booking process</li>
            <li>Wide range of options</li>
            <li>24/7 customer support</li>
          </ul>
        </div>
      </main>
    </div>
  );
}