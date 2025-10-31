export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-700">Payment Successful</h1>
        <p className="mt-4">Thank you! Your payment was received. Your rental is confirmed.</p>
        <a href="/all-vehicle" className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded">Back to Vehicles</a>
      </div>
    </div>
  );
}
