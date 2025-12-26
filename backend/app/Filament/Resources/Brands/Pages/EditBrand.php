<?php

namespace App\Filament\Resources\Brands\Pages;

use App\Filament\Resources\Brands\BrandResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBrand extends EditRecord
{
    protected static string $resource = BrandResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['logo']) && !str_starts_with($data['logo'], 'http')) {
            try {
                 if (\Illuminate\Support\Facades\Storage::disk('public')->exists($data['logo'])) {
                    $path = \Illuminate\Support\Facades\Storage::disk('public')->path($data['logo']);
                    $response = cloudinary()->upload($path);
                    $data['logo'] = $response->getSecurePath();
                 }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Cloudinary upload failed during update: ' . $e->getMessage());
            }
        }

        return $data;
    }
}
