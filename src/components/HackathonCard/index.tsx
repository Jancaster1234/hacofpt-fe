import Link from "next/link";

export default function HackathonCard({ hackathon }) {
  return (
    <Link
      href={`/hackathon/${hackathon.id}`}
      className="block bg-white shadow-md rounded-lg p-4"
    >
      <img
        src={hackathon.image}
        alt={hackathon.name}
        className="rounded-md w-full"
      />
      <h3 className="font-semibold mt-2">{hackathon.name}</h3>
      <p className="text-sm text-gray-500">{hackathon.date}</p>
    </Link>
  );
}
