<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class DropCustomersAndAdmins extends Migration
{
    public function up(): void
    {
        // We'll use DB-level FK checks toggle to allow dropping legacy tables safely

        if (Schema::hasTable('customers')) {
            // Temporarily disable FK checks to allow dropping the table regardless of lingering FKs.
            try {
                DB::statement('SET FOREIGN_KEY_CHECKS=0');
            } catch (\Exception $e) {
                // ignore if not MySQL or unsupported
            }

            Schema::dropIfExists('customers');

            try {
                DB::statement('SET FOREIGN_KEY_CHECKS=1');
            } catch (\Exception $e) {
                // ignore
            }
        }

        if (Schema::hasTable('admins')) {
            Schema::dropIfExists('admins');
        }

        // We intentionally avoid re-creating or altering other foreign keys here.
        // If required, re-pointing of any remaining references (for example rentals.customer_id)
        // should be handled in a targeted migration or manual DB step to ensure correct mapping.
    }

    public function down(): void
    {
        // Recreate basic customers table
        if (!Schema::hasTable('customers')) {
            Schema::create('customers', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->string('phone');
                $table->string('address');
                $table->string('password');
                $table->timestamps();
            });
        }

        // Recreate basic admins table
        if (!Schema::hasTable('admins')) {
            Schema::create('admins', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->string('password');
                $table->timestamps();
            });
        }

        // Update vehicles FK to point to customers if desired (best effort)
        if (Schema::hasTable('vehicles')) {
            Schema::table('vehicles', function (Blueprint $table) {
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                }
                $table->foreign('user_id')->references('id')->on('customers')->onDelete('cascade');
            });
        }
    }
}
