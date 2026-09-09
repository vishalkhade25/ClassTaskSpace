import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <Link to="/" className="font-semibold text-blue-600">
          ClassTaskSpace
        </Link>
        <p className="text-sm text-gray-500">
          Learn, manage, and submit with confidence.
        </p>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ClassTaskSpace
        </p>
      </div>
    </footer>
  );
};

export default Footer;
