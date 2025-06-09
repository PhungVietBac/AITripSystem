const members = [
  { studentID: "22520089", name: "Phùng Việt Bắc", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
  { studentID: "22520067", name: "Phạm Đức Anh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { studentID: "22521215", name: "Nguyễn Văn Quốc", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
  { studentID: "23520394", name: "Trịnh Nhật Duy", avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face" },
  { studentID: "23521729", name: "Trần Anh Tuấn", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" },
];

export default function Members() {
  return (
    <div id="members" className="relative isolate overflow-hidden bg-transparent py-24 sm:py-48">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
        className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Thành viên nhóm
          </h2>
          <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl/8">
            Đội ngũ phát triển Explavue - Hệ thống gợi ý lịch trình thông minh
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
            {members.map((member) => (
              <div
                key={member.studentID}
                className="flex flex-col items-center text-center group"
              >
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFD700] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute -inset-2 rounded-full border-2 border-[#FFD700] opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                </div>

                {/* Member Info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#FFD700] transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-300 font-mono">
                    {member.studentID}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
