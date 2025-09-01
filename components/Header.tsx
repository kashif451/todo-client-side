import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center mb-12">
      <h1 className="text-4xl font-bold text-gray-800">Todo App</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.replace("/login");
        }}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        Logout
      </button>
    </header>
  );
}