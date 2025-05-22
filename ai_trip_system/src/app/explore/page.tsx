'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Explore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  // Sample destinations data
  const [destinations, setDestinations] = useState([
    {
      id: 1,
      name: 'Đà Lạt',
      description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm',
      image: '/dalat.jpg',
      category: 'mountain',
      rating: 4.8,
      priceLevel: 2,
    },
    {
      id: 2,
      name: 'Phú Quốc',
      description: 'Hòn đảo thiên đường với bãi biển cát trắng và nước biển trong xanh',
      image: '/phuquoc.jpg',
      category: 'beach',
      rating: 4.7,
      priceLevel: 3,
    },
    {
      id: 3,
      name: 'Hà Nội',
      description: 'Thủ đô nghìn năm văn hiến với nhiều di tích lịch sử và văn hóa',
      image: '/hanoi.jpg',
      category: 'city',
      rating: 4.5,
      priceLevel: 2,
    },
    {
      id: 4,
      name: 'Đà Nẵng',
      description: 'Thành phố đáng sống với bãi biển đẹp và cầu Rồng nổi tiếng',
      image: '/danang.jpg',
      category: 'beach',
      rating: 4.6,
      priceLevel: 2,
    },
    {
      id: 5,
      name: 'Nha Trang',
      description: 'Thiên đường biển với nhiều hoạt động giải trí hấp dẫn',
      image: '/nhatrang.jpg',
      category: 'beach',
      rating: 4.4,
      priceLevel: 2,
    },
    {
      id: 6,
      name: 'Sapa',
      description: 'Thị trấn trong mây với những thửa ruộng bậc thang tuyệt đẹp',
      image: '/sapa.jpg',
      category: 'mountain',
      rating: 4.7,
      priceLevel: 2,
    },
    {
      id: 7,
      name: 'Huế',
      description: 'Cố đô với hệ thống di tích cung đình và ẩm thực đặc sắc',
      image: '/hue.jpg',
      category: 'cultural',
      rating: 4.5,
      priceLevel: 1,
    },
    {
      id: 8,
      name: 'Hội An',
      description: 'Phố cổ lãng mạn với những chiếc đèn lồng đầy màu sắc',
      image: '/hoian.jpg',
      category: 'cultural',
      rating: 4.9,
      priceLevel: 2,
    },
  ]);

  // Filter categories
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'beach', name: 'Biển' },
    { id: 'mountain', name: 'Núi' },
    { id: 'city', name: 'Thành phố' },
    { id: 'cultural', name: 'Văn hóa' },
  ];

  // Filter destinations based on search query and selected filter
  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || destination.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // If not logged in, don't render the content
  if (!isLoggedIn) {
    return null;
  }

  // Function to render price level
  const renderPriceLevel = (level) => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`text-lg ${index < level ? 'text-green-600' : 'text-gray-300'}`}
        >
          $
        </span>
      ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Khám phá điểm đến</h1>
        <p className="text-gray-600 mt-2">Tìm kiếm và khám phá những điểm đến tuyệt vời cho chuyến đi tiếp theo của bạn</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm kiếm điểm đến..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full ${
                  selectedFilter === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDestinations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Không tìm thấy điểm đến nào phù hợp với tìm kiếm của bạn.</p>
          </div>
        ) : (
          filteredDestinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <button className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">{destination.name}</h3>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-gray-700">{destination.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-2">{destination.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex">{renderPriceLevel(destination.priceLevel)}</div>
                  <button
                    onClick={() => router.push(`/explore/${destination.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
