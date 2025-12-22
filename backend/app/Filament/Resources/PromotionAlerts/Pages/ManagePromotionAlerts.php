<?php

namespace App\Filament\Resources\PromotionAlerts\Pages;

use App\Filament\Resources\PromotionAlerts\PromotionAlertResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManagePromotionAlerts extends ManageRecords
{
    protected static string $resource = PromotionAlertResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
