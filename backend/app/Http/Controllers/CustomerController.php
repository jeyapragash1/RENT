<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer = User::create(array_merge($request->only(['name','email','phone','address']), [
            'password' => $request->password,
            'role' => 'user'
        ]));

        return response()->json([
            'message' => 'Customer registered successfully',
            'customer' => $customer
        ], 201);
    }

    public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $customer = User::where('email', $request->email)->first();

    if (!$customer || !Hash::check($request->password, $customer->password) || $customer->role !== 'user') {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $customer->createToken('customer_token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'user' => $customer, // ✅ FIXED KEY (was 'customer')
        'token' => $token
    ], 200);
}

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
