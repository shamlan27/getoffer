<?php

namespace App\Filament\Resources\Brands\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class BrandSchema
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                FileUpload::make('logo')
                    ->image()
                    ->disk('cloudinary')
                    ->imageEditor()
                    ->columnSpanFull(),
                TextInput::make('website')
                    ->url(),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
