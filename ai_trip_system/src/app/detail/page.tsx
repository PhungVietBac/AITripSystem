import Header from "../../components/header";
import Footer from "../../components/footer";

export default function DetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Chi tiết</h1>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p>Nội dung chi tiết sẽ được thêm vào sau</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
