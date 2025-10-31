<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Models\Rental;
use Illuminate\Support\Facades\Log;

class PayHereController extends Controller
{
    // Create an auto-submitting form that forwards the user to PayHere checkout
    public function create(Request $request)
    {
        $request->validate([
            'rental_id' => 'required|integer|exists:rentals,id',
            'amount' => 'required|numeric|min:0.01',
        ]);

        $rental = Rental::with('customer')->findOrFail($request->rental_id);

        // Use environment config
        $merchantId = env('PAYHERE_MERCHANT_ID');
        $mode = env('PAYHERE_MODE', 'sandbox');
        $payUrl = $mode === 'live' ? env('PAYHERE_LIVE_URL') : env('PAYHERE_SANDBOX_URL');

        // Customer name split
        $firstName = '';
        $lastName = '';
        if ($rental->customer && $rental->customer->name) {
            $parts = explode(' ', $rental->customer->name);
            $firstName = array_shift($parts);
            $lastName = implode(' ', $parts);
        }

        $amount = number_format(floatval($request->amount), 2, '.', '');

        // Build payload expected by PayHere
        $payload = [
            'merchant_id' => $merchantId,
            'return_url' => env('PAYHERE_RETURN_URL'),
            'cancel_url' => env('PAYHERE_CANCEL_URL'),
            'notify_url' => env('PAYHERE_NOTIFY_URL'),
            'order_id' => $rental->id,
            'items' => "Rental-{$rental->id}",
            'currency' => 'LKR',
            'amount' => $amount,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $rental->customer->email ?? '',
            'phone' => $rental->customer->phone ?? '',
            'address' => $rental->customer->address ?? '',
            'city' => '',
            'country' => 'Sri Lanka',
        ];

        // Log the redirection (do NOT log secrets)
        Log::info('Redirecting to PayHere', ['rental_id' => $rental->id, 'amount' => $amount]);

        // Return an HTML form that posts to PayHere and auto-submits
        $html = '<!doctype html><html><head><meta charset="utf-8"><title>Redirecting to PayHere</title></head><body>';
        $html .= '<p>Redirecting to payment gateway...</p>';
        $html .= "<form id=\"payhere_form\" action=\"{$payUrl}\" method=\"post\">";

        foreach ($payload as $k => $v) {
            $escaped = htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
            $html .= "<input type=\"hidden\" name=\"{$k}\" value=\"{$escaped}\" />";
        }

        $html .= '<noscript><p>Please click the button below to continue to payment.</p><button type="submit">Continue</button></noscript>';
        $html .= '</form>';
        $html .= '<script>document.getElementById("payhere_form").submit();</script>';
        $html .= '</body></html>';

        return response($html, 200)->header('Content-Type', 'text/html');
    }

    // PayHere IPN / notify endpoint
    public function notify(Request $request)
    {
        // PayHere will POST notification data. We'll log it and update rental payment.
        $data = $request->all();
        Log::info('PayHere notify received', $data);

        // Basic validation
        $orderId = $request->input('order_id') ?: $request->input('merchant_order_id');
        $amount = floatval($request->input('amount', 0));
        $status = strtolower($request->input('status') ?? $request->input('payment_status') ?? '');

        if (!$orderId) {
            return response()->json(['message' => 'Missing order id'], 400);
        }

        $rental = Rental::find($orderId);
        if (!$rental) {
            return response()->json(['message' => 'Rental not found'], 404);
        }

        // Treat a variety of status values as success
        $successStatuses = ['paid', 'completed', 'success'];

        if (in_array($status, $successStatuses) || $request->input('payment_id')) {
            // Record the payment amount (add to existing)
            $rental->paid_amount = floatval($rental->paid_amount) + $amount;
            if ($rental->paid_amount >= $rental->total_amount) {
                $rental->payment_status = 'paid';
                $rental->status = 'confirmed';
            } else {
                $rental->payment_status = 'partial';
                $rental->status = 'confirmed';
            }
            $rental->save();

            return response('OK', 200);
        }

        // Not successful payment
        Log::warning('PayHere notify indicated non-success status', ['status' => $status, 'rental_id' => $rental->id]);
        return response('IGNORED', 200);
    }
}
