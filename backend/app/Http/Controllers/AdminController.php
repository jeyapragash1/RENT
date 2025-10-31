<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    // Admin login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $admin = User::where('email', $request->email)->where('role', 'admin')->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'admin' => $admin,
            'token' => $token
        ], 200);
    }

    // Admin logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    // Dashboard data
    public function dashboard()
    {
        // Counts
        $totalUsers = \App\Models\User::count();
        $totalCustomers = \App\Models\User::where('role', 'user')->count();
        // Sellers: users who have at least one vehicle
        $totalSellers = \App\Models\User::whereHas('vehicles', function ($q) { })->count();

        // Active rentals: statuses that are not completed/cancelled
        $activeRentals = \App\Models\Rental::whereIn('status', ['pending','confirmed'])->count();

        // Payments sums based on rentals.total_amount
        $today = now()->startOfDay();
        $yesterdayStart = now()->subDay()->startOfDay();
        $yesterdayEnd = now()->subDay()->endOfDay();
        $weekStart = now()->subDays(7)->startOfDay();

    // Use paid_amount to reflect actual received payments (supports partial payments)
    $paymentsToday = \App\Models\Rental::whereBetween('created_at', [$today, now()])->sum('paid_amount');
    $paymentsYesterday = \App\Models\Rental::whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])->sum('paid_amount');
    $paymentsLast7Days = \App\Models\Rental::whereBetween('created_at', [$weekStart, now()])->sum('paid_amount');

        return response()->json([
            'counts' => [
                'total_users' => $totalUsers,
                'total_customers' => $totalCustomers,
                'total_sellers' => $totalSellers,
                'active_rentals' => $activeRentals,
            ],
            'payments' => [
                'today' => (float) $paymentsToday,
                'yesterday' => (float) $paymentsYesterday,
                'last_7_days' => (float) $paymentsLast7Days,
            ],
            'vehicles' => \App\Models\Vehicle::with('owner')->get(),
        ]);
    }

    // Approve vehicle
    public function approveVehicle($id)
    {
        $vehicle = \App\Models\Vehicle::findOrFail($id);
        $vehicle->status = 'Approved';
        $vehicle->save();

        return response()->json(['message' => 'Vehicle approved successfully', 'vehicle' => $vehicle]);
    }

    // Reject vehicle
    public function rejectVehicle($id)
    {
        $vehicle = \App\Models\Vehicle::findOrFail($id);
        $vehicle->status = 'Rejected';
        $vehicle->save();

        return response()->json(['message' => 'Vehicle rejected successfully', 'vehicle' => $vehicle]);
    }

    // List approved vehicles
    public function approvedVehicles()
    {
        $vehicles = \App\Models\Vehicle::with('owner')
            ->where('status', 'Approved')
            ->get()
            ->map(function ($vehicle) {
                $vehicle->image_url = $vehicle->image ? Storage::url($vehicle->image) : null;
                return $vehicle;
            });

        return response()->json($vehicles);
    }

    // Rent vehicle
    public function rentVehicle($id)
    {
        $vehicle = \App\Models\Vehicle::findOrFail($id);

        if ($vehicle->status !== 'Approved') {
            return response()->json(['message' => 'Vehicle is not available for rent'], 400);
        }

    $vehicle->status = 'Rented';
        $vehicle->save();

        return response()->json(['message' => 'Vehicle rented successfully', 'vehicle' => $vehicle]);
    }

    // Delete customer - FIXED
    public function deleteCustomer($id)
    {
        $customer = User::where('role', 'user')->find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully']);
    }

    // Optional: get all customers
    public function getCustomers()
    {
        return response()->json(User::where('role', 'user')->get());
    }

    // Optional: get all vehicles
    public function getVehicles()
    {
        return response()->json(\App\Models\Vehicle::with('owner')->get());
    }
}
