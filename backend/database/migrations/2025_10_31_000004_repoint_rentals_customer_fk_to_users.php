<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class RepointRentalsCustomerFkToUsers extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('rentals')) {
            return;
        }

        // Temporarily disable FK checks while we adjust constraints
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
        } catch (\Exception $e) {
            // ignore if not supported
        }

        Schema::table('rentals', function (Blueprint $table) {
            try {
                $table->dropForeign(['customer_id']);
            } catch (\Exception $e) {
                // ignore
            }

            try {
                $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
            } catch (\Exception $e) {
                // ignore
            }
        });

        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        } catch (\Exception $e) {
            // ignore
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('rentals')) {
            return;
        }

        Schema::table('rentals', function (Blueprint $table) {
            try {
                $table->dropForeign(['customer_id']);
            } catch (\Exception $e) {
            }

            try {
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            } catch (\Exception $e) {
            }
        });
    }
}
