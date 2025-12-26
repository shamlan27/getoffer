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
    }

    public function register(): void
    {
        if (class_exists(\CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider::class)) {
            $this->app->register(\CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider::class);
        }
    }
}
