import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-light text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="text-gray-800 underline hover:text-gray-600">Return to Home</Link>
    </div>
  );
};

export default NotFound;
