<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddRentedStatusToVehicles extends Migration
{
    public function up(): void
    {
        $connection = config('database.default');
        $driver = config("database.connections.{$connection}.driver");

        if ($driver === 'mysql') {
            // Modify enum to include 'Rented'
            DB::statement("ALTER TABLE `vehicles` MODIFY `status` ENUM('Pending','Approved','Rejected','Rented') NOT NULL DEFAULT 'Pending';");
        } else {
            // For sqlite or other drivers, change to string to be safe
            Schema::table('vehicles', function (Blueprint $table) {
                $table->string('status')->default('Pending')->change();
            });
        }
    }

    public function down(): void
    {
        $connection = config('database.default');
        $driver = config("database.connections.{$connection}.driver");

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `vehicles` MODIFY `status` ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending';");
        } else {
            // revert to string stays string; no-op
        }
    }
}
