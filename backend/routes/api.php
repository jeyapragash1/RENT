<?php 

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RentalController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes for customers
Route::post('/customers/register', [CustomerController::class, 'register']);
Route::post('/customers/login', [CustomerController::class, 'login']);

// Public routes for admin
Route::post('/admin/login', [AdminController::class, 'login']);

// Public route to get only approved vehicles
Route::get('/vehicles/approved', [AdminController::class, 'approvedVehicles']);

// Protected routes (require authentication via Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Customer routes
    Route::get('/customers/me', [CustomerController::class, 'me']);
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::get('/vehicles/me', [VehicleController::class, 'myVehicles']);
    Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']); 
    Route::put('/vehicles/{id}', [VehicleController::class, 'update']);

    // Rentals
    Route::post('/rentals', [RentalController::class, 'store']);
    Route::get('/rentals', [RentalController::class, 'index']); // optional

    // Admin routes (only accessible to users with role 'admin')
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::post('/logout', [AdminController::class, 'logout']);
        Route::get('/customers', [AdminController::class, 'getCustomers']);
        Route::get('/vehicles', [AdminController::class, 'getVehicles']);
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        // Admin actions
        Route::delete('/customers/{id}', [AdminController::class, 'deleteCustomer']);
        Route::patch('/vehicles/{id}/approve', [AdminController::class, 'approveVehicle']);
        Route::patch('/vehicles/{id}/reject', [AdminController::class, 'rejectVehicle']);
        Route::get('/vehicles/approved', [AdminController::class, 'approvedVehicles']);
        Route::patch('/vehicles/{id}/rent', [AdminController::class, 'rentVehicle']);
    });
});
