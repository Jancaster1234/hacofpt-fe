// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/Sidebar.tsx
export default function Sidebar() {
  return (
    <div className="bg-gray-100 p-4 w-64 min-h-screen">
      <h2 className="font-bold text-lg mb-4">Meeting with mentor</h2>

      {/* Meeting Items */}
      <div className="space-y-3">
        <div className="bg-blue-500 text-white p-3 rounded-md">
          <p className="text-xs">Start in 17:26</p>
          <p className="font-medium">Meeting A</p>
          <p className="text-xs">Time: Sep 1st, 17:30</p>
        </div>
        <div className="bg-blue-500 text-white p-3 rounded-md">
          <p className="text-xs">Start in 3:17:26</p>
          <p className="font-medium">Meeting A</p>
          <p className="text-xs">Time: Sep 1st, 20:30</p>
        </div>
      </div>
    </div>
  );
}
