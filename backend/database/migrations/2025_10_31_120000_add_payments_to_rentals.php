<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaymentsToRentals extends Migration
{
    public function up(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->decimal('paid_amount', 10, 2)->default(0)->after('total_amount');
            $table->enum('payment_status', ['unpaid','partial','paid'])->default('unpaid')->after('paid_amount');
        });
    }

    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropColumn(['paid_amount','payment_status']);
        });
    }
}
