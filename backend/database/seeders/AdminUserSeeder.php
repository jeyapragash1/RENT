<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Reads ADMIN_EMAIL and ADMIN_PASSWORD from environment with safe defaults.
     * If a user with the email exists, it will be updated to role=admin.
     *
     * @return void
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $password = env('ADMIN_PASSWORD', 'Password123!');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Super Admin',
                'password' => $password, // User model hashes automatically
                'role' => 'admin',
            ]
        );

        $this->command->info("Admin user created/updated: {$email} (password: see .env or default)");
    }
}
