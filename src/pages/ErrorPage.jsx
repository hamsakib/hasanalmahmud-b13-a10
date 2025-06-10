import { Link, useRouteError } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Helmet><title>404 - Page Not Found | ReSell Hub</title></Helmet>
      <div className="text-center max-w-lg">
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          <FiAlertTriangle />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Oops! Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          {error?.statusText || error?.message || "The page you're looking for doesn't exist or has been moved."}
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          <FiHome /> Back To Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
