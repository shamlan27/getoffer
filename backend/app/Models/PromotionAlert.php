<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromotionAlert extends Model
{
    protected $fillable = [
        'title',
        'type',
        'message',
        'action_url',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];
}
