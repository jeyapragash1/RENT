<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Validator;

class RentalController extends Controller
{
    // Store a new rental
    public function store(Request $request)
    {
        // Validate request (remove total_amount)
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id',
            'customer_id' => 'required|exists:users,id',
            'rent_start_date' => 'required|date|before_or_equal:rent_end_date',
            'rent_end_date' => 'required|date|after_or_equal:rent_start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Fetch vehicle to get daily rate
        $vehicle = Vehicle::find($request->vehicle_id);

        // Calculate rental days
        $start = new \DateTime($request->rent_start_date);
        $end = new \DateTime($request->rent_end_date);
        $diffDays = $end->diff($start)->days + 1; // include both start and end day

        // Calculate total amount
        $totalAmount = $diffDays * $vehicle->daily_rate;

        // Create rental
        $rental = Rental::create([
            'vehicle_id' => $request->vehicle_id,
            'customer_id' => $request->customer_id,
            'rent_start_date' => $request->rent_start_date,
            'rent_end_date' => $request->rent_end_date,
            'total_amount' => $totalAmount,
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Rental created successfully',
            'rental' => $rental
        ], 201);
    }

    // List all rentals
    public function index()
    {
        $rentals = Rental::with(['customer', 'vehicle'])->get();
        return response()->json($rentals);
    }
}
