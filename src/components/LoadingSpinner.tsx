type LoadingTextProps = { message: string };

function LoadingSpinner({ message }: LoadingTextProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-800"></div>
        <p className="text-gray-800 text-lg">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
