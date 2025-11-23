import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="mx-auto px-4 py-2">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold">🔗 TinyLink</h1>
          <span className="text-blue-100 text-sm ml-10">Shorten URLs with ease</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;