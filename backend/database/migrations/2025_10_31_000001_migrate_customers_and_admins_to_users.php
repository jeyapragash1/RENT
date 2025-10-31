<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class MigrateCustomersAndAdminsToUsers extends Migration
{
    public function up(): void
    {
        // 1) Copy customers into users
        if (Schema::hasTable('customers')) {
            $customers = DB::table('customers')->get();
            foreach ($customers as $c) {
                // only insert if not exists
                $exists = DB::table('users')->where('email', $c->email)->exists();
                if (!$exists) {
                    DB::table('users')->insert([
                        'name' => $c->name,
                        'email' => $c->email,
                        'password' => $c->password,
                        'phone' => $c->phone,
                        'address' => $c->address,
                        'role' => 'user',
                        'created_at' => $c->created_at,
                        'updated_at' => $c->updated_at,
                    ]);
                }
            }
        }

        // 2) Copy admins into users
        if (Schema::hasTable('admins')) {
            $admins = DB::table('admins')->get();
            foreach ($admins as $a) {
                $exists = DB::table('users')->where('email', $a->email)->exists();
                if (!$exists) {
                    DB::table('users')->insert([
                        'name' => $a->name,
                        'email' => $a->email,
                        'password' => $a->password,
                        'role' => 'admin',
                        'created_at' => $a->created_at,
                        'updated_at' => $a->updated_at,
                    ]);
                }
            }
        }

        // 3) Update vehicles foreign key: drop constraint that pointed to customers and re-point to users
        if (Schema::hasTable('vehicles')) {
            // Attempt to drop foreign key if exists. We try common naming conventions.
            Schema::table('vehicles', function (Blueprint $table) {
                // Use raw SQL to drop foreign key constraints if present. Names vary by DB.
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                    // ignore
                }
            });

            Schema::table('vehicles', function (Blueprint $table) {
                // Recreate foreign key to users table
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // NOTE: We intentionally do not drop the 'customers' and 'admins' tables here.
        // After verification, you can drop them manually or via a follow-up migration.
    }

    public function down(): void
    {
        // Best-effort reversal: remove added FK to users and re-add to customers if table present
        if (Schema::hasTable('vehicles')) {
            Schema::table('vehicles', function (Blueprint $table) {
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                }
            });

            if (Schema::hasTable('customers')) {
                Schema::table('vehicles', function (Blueprint $table) {
                    $table->foreign('user_id')->references('id')->on('customers')->onDelete('cascade');
                });
            }
        }

        // We won't remove inserted users automatically to avoid data loss.
    }
}
