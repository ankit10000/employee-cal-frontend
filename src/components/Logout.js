import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-indigo-600 p-4">
      <div className="flex justify-between items-center">
        <Link to="/home" className="text-white font-bold text-xl">Home</Link>
        <Link to="/logout" className="text-white">Logout</Link>
      </div>
    </nav>
  );
}
export default Navbar;