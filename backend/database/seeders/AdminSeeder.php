<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run()
    {
        $email = env('APP_ADMIN_EMAIL', 'admin@example.com');
        $password = env('APP_ADMIN_PASSWORD', 'password');

        if (!User::where('email', $email)->exists()) {
            User::create([
                'name' => 'Administrator',
                'email' => $email,
                'password' => $password,
                'role' => 'admin',
                'level' => 100,
            ]);
        }
    }
}
