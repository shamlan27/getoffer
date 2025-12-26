<?php

namespace App\Filament\Resources\Brands\Pages;

use App\Filament\Resources\Brands\BrandResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBrand extends CreateRecord
{
    protected static string $resource = BrandResource::class;
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (isset($data['logo'])) {
            try {
                // Ensure the file exists on the public disk before attempting upload
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($data['logo'])) {
                    $path = \Illuminate\Support\Facades\Storage::disk('public')->path($data['logo']);
                    $response = cloudinary()->upload($path);
                    $data['logo'] = $response->getSecurePath();
                }
            } catch (\Exception $e) {
                // Log the error but allow creation to proceed (or throw exception if critical)
                \Illuminate\Support\Facades\Log::error('Cloudinary upload failed: ' . $e->getMessage());
            }
        }

        return $data;
    }
}
