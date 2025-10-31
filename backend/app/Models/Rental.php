<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'vehicle_id',
        'rent_start_date',
        'rent_end_date',
        'total_amount',
        'paid_amount',
        'payment_status', // unpaid / partial / paid
        'status', // pending / confirmed / completed / cancelled
    ];

    // Relationships
    public function customer()
    {
        return $this->belongsTo(\App\Models\User::class, 'customer_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
