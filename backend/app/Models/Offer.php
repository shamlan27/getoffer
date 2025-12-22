<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'brand_id',
        'category_id',
        'title',
        'description',
        'type',
        'code',
        'discount_value',
        'valid_from',
        'valid_to',
        'is_featured',
        'how_to_claim_image',
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_to' => 'datetime',
        'is_featured' => 'boolean',
    ];

    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }
}
