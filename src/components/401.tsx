function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">401 Access Denied</h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-xl mx-auto">
          You do not have the permission to view this page.
          <br />
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;
