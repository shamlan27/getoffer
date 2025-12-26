<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/nuke-cache', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('optimize:clear');
    return 'Cache NUKED. Now try your admin page.';
});

Route::get('/hard-reset', function () {
    // This physically deletes the cache file from the server
    $file = base_path('bootstrap/cache/config.php');
    
    if (file_exists($file)) {
        unlink($file); // DELETE IT
        return 'Config cache file DELETED. The server is now forced to use your new settings.';
    }
    
    return 'No config cache file found. The server is already using live settings.';
});