<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    protected $guarded = [];

    // 👇 1. THIS ADDS A NEW FIELD TO YOUR API RESPONSE
    protected $appends = ['logo_url'];

    // 👇 2. THIS GENERATES THE FULL CLOUDINARY LINK
    public function getLogoUrlAttribute()
    {
        if (empty($this->logo)) {
            return null;
        }

        // If it's already a link, return it
        if (str_starts_with($this->logo, 'http')) {
            return $this->logo;
        }

        // Otherwise, build the correct Cloudinary URL using the Storage facade
        return \Illuminate\Support\Facades\Storage::disk('cloudinary')->url($this->logo);
    }
}