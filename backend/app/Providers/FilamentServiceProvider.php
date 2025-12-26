<?php

namespace App\Providers;

use Filament\Facades\Filament;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class FilamentServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        URL::forceScheme('https');

        Filament::serving(function () {
            URL::forceScheme('https');
            URL::forceRootUrl(config('app.url'));
        });
        Config::set('filesystems.disks.cloudinary.root', 'uploads');
    }
}
