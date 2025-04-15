export default function IntroPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Welcome to Our Website</h1>
        <p className="text-lg text-gray-700 mb-4">
          Discover amazing features and services we offer.
        </p>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Get Started</h2>
          <p>Explore our offerings and find what suits you best.</p>
        </div>
      </main>
    </div>
  );
}