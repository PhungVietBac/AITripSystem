"use client";
import Image from "next/image";

const FriendsList = () => {
  const friends = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      location: "Đang ở Đà Nẵng",
      avatar: "/avatars/1.jpg",
    },
    {
      id: 2,
      name: "Trần Thị B",
      location: "Đang ở Hà Nội",
      avatar: "/avatars/2.jpg",
    },
    {
      id: 3,
      name: "Lê Văn C",
      location: "Đang ở TPHCM",
      avatar: "/avatars/3.jpg",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      location: "Đang ở Nha Trang",
      avatar: "/avatars/4.jpg",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 border border-[#dadce0]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-users text-blue-900"></i>
          <h3 className="text-lg font-semibold text-blue-900">Bạn bè</h3>
        </div>
        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-sm font-medium">
          12
        </span>
      </div>

      <div className="space-y-4">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-full h-full object-cover"
                  fill
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{friend.name}</h4>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <i className="fas fa-map-marker-alt"></i>
                {friend.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
