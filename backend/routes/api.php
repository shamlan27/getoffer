<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\AnnouncementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google/redirect', [AuthController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);

Route::get('/offers', [OfferController::class, 'index']);
Route::get('/offers/suggestions', [OfferController::class, 'suggestions']);
Route::get('/offers/{id}', [OfferController::class, 'show']);
Route::get('/categories', [OfferController::class, 'categories']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{id}', [BrandController::class, 'show']);
Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);

Route::post('/auth/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/banners', [BannerController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/auth/request-account-deletion', [AuthController::class, 'requestAccountDeletion']);
    Route::post('/auth/delete-account', [AuthController::class, 'deleteAccount']);

    // Authenticated Subscription Management
    Route::post('/subscription/check', [SubscriptionController::class, 'check']);
    Route::post('/subscription/toggle', [SubscriptionController::class, 'toggle']);
});
