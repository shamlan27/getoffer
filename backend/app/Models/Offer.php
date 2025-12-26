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

    protected $appends = ['how_to_claim_image_url'];

    public function getHowToClaimImageUrlAttribute()
    {
        if (empty($this->how_to_claim_image)) {
            return null;
        }

        if (str_starts_with($this->how_to_claim_image, 'http')) {
            return $this->how_to_claim_image;
        }

        $cloudName = config('filesystems.disks.cloudinary.cloud_name') 
                  ?? config('filesystems.disks.cloudinary.cloud.cloud_name')
                  ?? config('cloudinary.cloud.cloud_name');

        if (empty($cloudName)) {
            $cloudinaryUrl = config('cloudinary.cloud_url') ?? env('CLOUDINARY_URL');
            if ($cloudinaryUrl && str_contains($cloudinaryUrl, '@')) {
                $parts = parse_url($cloudinaryUrl);
                $cloudName = $parts['host'] ?? null;
            }
        }

        if (empty($cloudName)) {
             return null; 
        }

        return "https://res.cloudinary.com/{$cloudName}/image/upload/" . $this->how_to_claim_image;
    }

    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }
}
