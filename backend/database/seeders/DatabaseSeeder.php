<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Migrate existing customers/admins into users via migration, then seed an admin for local development
        $this->call([\Database\Seeders\AdminSeeder::class]);
    }
}
