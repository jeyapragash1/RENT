export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-yellow-700">Payment Cancelled</h1>
        <p className="mt-4">Your payment was cancelled. Your rental is saved as pending. You can retry payment from your profile.</p>
        <a href="/all-vehicle" className="mt-6 inline-block bg-yellow-600 text-white px-4 py-2 rounded">Back to Vehicles</a>
      </div>
    </div>
  );
}
