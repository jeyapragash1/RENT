<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'image',
        'daily_rate',
        'registration_number',
        'registration_date',
        'color',
        'brand',
        'model',
        'status',
    ];

    public function owner()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    
}
