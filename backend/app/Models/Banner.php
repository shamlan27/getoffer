<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (empty($this->image_path)) {
            return null;
        }

        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
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

        return "https://res.cloudinary.com/{$cloudName}/image/upload/" . $this->image_path;
    }
}
