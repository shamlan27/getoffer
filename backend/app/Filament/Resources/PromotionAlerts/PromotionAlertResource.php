<?php

namespace App\Filament\Resources\PromotionAlerts;

use App\Filament\Resources\PromotionAlerts\Pages\ManagePromotionAlerts;
use App\Models\PromotionAlert;
use App\Models\Subscription;
use App\Mail\PromotionAlertMail;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Illuminate\Support\Facades\Mail;
use Filament\Notifications\Notification;

class PromotionAlertResource extends Resource
{
    protected static ?string $model = PromotionAlert::class;

    // protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Alert Details')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255),
                        Select::make('type')
                            ->options([
                                'Promotion' => 'New Promotion',
                                'Limited-time' => 'Limited-time Offer',
                                'Festival' => 'Sri Lankan Festival Deal',
                            ])
                            ->default('Promotion')
                            ->required(),
                        RichEditor::make('message')
                            ->required()
                            ->columnSpanFull(),
                        TextInput::make('action_url')
                            ->url()
                            ->helperText('Optional link for the button in the email.')
                            ->maxLength(255),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Promotion' => 'info',
                        'Limited-time' => 'warning',
                        'Festival' => 'success',
                        default => 'gray',
                    }),
                TextColumn::make('sent_at')
                    ->dateTime()
                    ->placeholder('Not sent yet'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Action::make('send')
                    ->label('Send to All')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (PromotionAlert $record) {
                        $subscribers = Subscription::all();
                        
                        foreach ($subscribers as $subscriber) {
                            Mail::to($subscriber->email)->queue(new PromotionAlertMail($record));
                        }

                        $record->update(['sent_at' => now()]);

                        Notification::make()
                            ->title('Alert sent to queue successfully!')
                            ->success()
                            ->send();
                    })
                    ->visible(fn (PromotionAlert $record) => $record->sent_at === null),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManagePromotionAlerts::route('/'),
        ];
    }
}
