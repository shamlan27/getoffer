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

        // Robustly determine the Cloud Name
        $cloudName = config('filesystems.disks.cloudinary.cloud_name') 
                  ?? config('filesystems.disks.cloudinary.cloud.cloud_name')
                  ?? config('cloudinary.cloud.cloud_name');

        // Verify if we found a cloud name, if not, try to parse from CLOUDINARY_URL
        if (empty($cloudName)) {
            $cloudinaryUrl = config('cloudinary.cloud_url') ?? env('CLOUDINARY_URL');
            if ($cloudinaryUrl && str_contains($cloudinaryUrl, '@')) {
                // components: scheme://key:secret@cloud_name
                $parts = parse_url($cloudinaryUrl);
                $cloudName = $parts['host'] ?? null;
            }
        }

        if (empty($cloudName)) {
             // Fallback to avoid 500 error, though image will be broken
             return null; 
        }

        return "https://res.cloudinary.com/{$cloudName}/image/upload/" . $this->logo;
    }
}