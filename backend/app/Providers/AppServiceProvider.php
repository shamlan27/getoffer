<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (class_exists(\CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider::class)) {
            $this->app->register(\CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        try {
            $this->app['storage']->extend('cloudinary', function ($app, $config) {
                return new \Illuminate\Filesystem\FilesystemAdapter(
                    new \League\Flysystem\Filesystem(
                        new \Cloudinary\Flysystem\CloudinaryAdapter($config)
                    ),
                    new \CloudinaryLabs\CloudinaryLaravel\CloudinaryEngine($config),
                    $config
                );
            });
        } catch (\Throwable $e) {
             // Log or ignore
        }
    }
}
