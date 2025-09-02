function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">MTRH Imaging Department</h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-xl mx-auto">
          Thank you for helping us test our new web application.
        </p>
        <div className="mt-8">
          <a
            href="/dashboard"
            className="inline-block px-8 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 "
          >
            Log in with ERPNext
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
