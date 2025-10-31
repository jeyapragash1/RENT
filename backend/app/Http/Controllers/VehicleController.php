<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Auth;

class VehicleController extends Controller
{
    // 🟢 Add Vehicle
    public function store(Request $request)
    {
        $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255',
            'registration_date' => 'required|date',
            'daily_rate' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('vehicles', 'public');
        }

        $vehicle = Vehicle::create([
            'user_id' => Auth::id(),
            'brand' => $request->brand,
            'model' => $request->model,
            'color' => $request->color,
            'registration_number' => $request->registration_number,
            'registration_date' => $request->registration_date,
            'daily_rate' => $request->daily_rate,
            'image' => $imagePath,
            'status' => 'Pending', // 👈 new vehicles start as Pending
        ]);

        return response()->json($vehicle, 201);
    }

    // 🟢 Get logged-in user's vehicles
    public function myVehicles()
    {
        $vehicles = Vehicle::where('user_id', Auth::id())->get();
        return response()->json($vehicles);
    }

    // 🟡 Update Vehicle (you can change status if needed)
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'brand' => 'sometimes|string|max:255',
            'model' => 'sometimes|string|max:255',
            'color' => 'sometimes|string|max:255',
            'registration_number' => 'sometimes|string|max:255',
            'registration_date' => 'sometimes|date',
            'daily_rate' => 'sometimes|numeric',
            'status' => 'in:Pending,Approved,Rejected', // 👈 allowed values
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $vehicle->image = $request->file('image')->store('vehicles', 'public');
        }

        $vehicle->update($request->only([
            'brand', 'model', 'color', 'registration_number',
            'registration_date', 'daily_rate', 'status'
        ]));

        return response()->json([
            'message' => 'Vehicle updated successfully!',
            'vehicle' => $vehicle
        ]);
    }

    // 🔴 Delete Vehicle
    public function destroy($id)
    {
        $vehicle = Vehicle::where('user_id', Auth::id())->findOrFail($id);
        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully!']);
    }
}
