
/**
 * NotFound component renders a 404 error page for undefined routes.
 *
 * @component
 * @returns {JSX.Element} A styled 404 Not Found page with a link to return home.
 */
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <a href="/" className="mt-8 text-blue-500 hover:text-blue-600">
        Go back to home
      </a>
    </div>
  );
};

export default NotFound;