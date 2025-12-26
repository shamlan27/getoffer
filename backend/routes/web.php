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

Route::get('/force-reset', function () {
    // 1. Physically delete the cached config file
    $file = base_path('bootstrap/cache/config.php');
    if (file_exists($file)) {
        unlink($file);
        $status = "DELETED cached config file.";
    } else {
        $status = "No cached config file found (system is already using live files).";
    }

    // 2. Clear other caches just in case
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');

    return response()->json([
        'status' => $status,
        'message' => 'Cache cleared. Please try uploading again.',
    ]);
});

Route::get('/debug-root', function () {
    return response()->json([
        'root_value' => config('filesystems.disks.cloudinary.root'),
        'full_disk_config' => config('filesystems.disks.cloudinary'),
    ]);
});


Route::get('/debug-url', function () {
    // 1. Ask the system to generate a URL using the 'cloudinary' disk
    $url = Storage::disk('cloudinary')->url('brands/test_image.jpg');
    
    return [
        'generated_url' => $url,
        'is_correct' => str_contains($url, 'cloudinary.com') ? 'YES' : 'NO - System is generating local links!',
    ];
});

Route::get('/debug-db', function () {
    // 1. Get the latest brand using the full path to the model
    $brand = \App\Models\Brand::latest()->first();

    if (!$brand) {
        return ['error' => 'No brands found in the database. Please create one first.'];
    }

    return [
        'id' => $brand->id,
        'logo_value_in_db' => $brand->logo, // <--- This shows exactly what is saved
        'disk_config' => config('filesystems.disks.cloudinary.driver'),
    ];
});