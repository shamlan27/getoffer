<?php

namespace App\Filament\Resources\Offers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class OfferForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('brand_id')
                    ->relationship('brand', 'name')
                    ->createOptionForm([
                        TextInput::make('name')->required(),
                    ])
                    ->required(),
                Select::make('category_id')
                    ->relationship('category', 'name'),
                TextInput::make('title')
                    ->required(),
                Select::make('type')
                    ->options([
                        'deal' => 'Deal',
                        'code' => 'Coupon Code',
                    ])
                    ->default('deal')
                    ->required(),
                TextInput::make('code'),
                TextInput::make('discount_value'),
                DateTimePicker::make('valid_from'),
                DateTimePicker::make('valid_to'),
                Toggle::make('is_featured')
                    ->required(),
                FileUpload::make('how_to_claim_image')
                    ->image()
                    ->disk('public')
                    ->directory('offer-guides'),
                RichEditor::make('description')
                    ->columnSpanFull()
                    ->required(),
            ]);
    }
}
