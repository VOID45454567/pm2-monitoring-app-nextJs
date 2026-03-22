export default function Header() {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">PM2 Monitor</h1>
        <div className="space-x-4">
          <a href="/" className="hover:text-gray-300">
            Processes
          </a>
          <a href="/tests" className="hover:text-gray-300">
            Tests
          </a>
        </div>
      </div>
    </nav>
  );
}
