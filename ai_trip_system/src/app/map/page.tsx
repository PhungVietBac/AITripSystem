import React from 'react'
import Header from "../../components/header";
import Footer from "../../components/footer";
import Map from "../../components/Map";

export default function MapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Bản đồ</h1>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <Map />
        </div>
      </main>
      <Footer />
    </div>
  );
}