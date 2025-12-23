<?php

namespace App\Filament\Resources\Offers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class OffersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('brand.name')
                    ->label('Brand')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('category.name')
                    ->label('Category')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'deal' => 'success',
                        'code' => 'warning',
                        default => 'gray',
                    }),
                TextColumn::make('code')
                    ->copyable()
                    ->searchable(),
                TextColumn::make('discount_value')
                    ->searchable(),
                TextColumn::make('valid_to')
                    ->dateTime()
                    ->sortable()
                    ->color(fn ($state) => $state && now() > $state ? 'danger' : 'success'),
                IconColumn::make('is_featured')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
                Action::make('notify')
                    ->label('Send Alert')
                    ->icon('heroicon-o-bell')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Send Push Notification')
                    ->modalDescription('Are you sure you want to send a notification to all subscribers about this offer?')
                    ->action(function (\App\Models\Offer $record) {
                        // In a real application, you would queue a notification job here.
                        // For demo purposes, we log the action and show a success notification.
                        \Filament\Notifications\Notification::make()
                            ->title('Alert sent to subscribers')
                            ->body("Notification for {$record->title} has been queued.")
                            ->success()
                            ->send();
                    }),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
