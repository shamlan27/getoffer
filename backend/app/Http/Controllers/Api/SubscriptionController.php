<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            // Check if already subscribed
            $existing = Subscription::where('email', $request->email)->first();
            if ($existing) {
                return response()->json(['message' => 'You are already subscribed!'], 422);
            }

            $token = \Illuminate\Support\Str::random(32);
            $subscription = Subscription::create([
                'email' => $request->email,
                'unsubscribe_token' => $token
            ]);

            // Ensure app url doesn't have trailing slash
            $appUrl = rtrim(config('app.url'), '/');
            // Unsubscribe link - frontend route
            // Since this is an API, we probably want to point to the frontend unsubscribe page
            // Assuming frontend is at CORS origin or APP_URL if it's the frontend URL
            // Let's rely on an env variable or config for generic usage, but for now assuming nextjs is at header origin or similar.
            // Better: use a dedicated route in backend that handles it or a frontend page.
            // The prompt says "unsubscribe code email code also".
            // Let's create an unsubscribe link that points to the API for now or a frontend page.
            // A common pattern is frontend URL.
            // Let's assume frontend URL is passed or configured. For now hardcode or use referer?
            // Safer: Point to a specific frontend URL.
            // Let's use <FRONTEND_URL>/unsubscribe?token=...
            // If FRONTEND_URL is not set, fall back to something.
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            $unsubscribeLink = "{$frontendUrl}/unsubscribe?token={$token}";

            $response = \Illuminate\Support\Facades\Http::timeout(10)
                ->withHeaders([
                    'api-key' => env('BREVO_API_KEY'),
                    'accept' => 'application/json',
                    'content-type' => 'application/json'
                ])
                ->post('https://api.brevo.com/v3/smtp/email', [
                    'to' => [
                        ['email' => $request->email]
                    ],
                    'templateId' => 1,
                    'params' => [
                        'UNSUBSCRIBE_LINK' => $unsubscribeLink
                    ]
                ]);

            if ($response->successful()) {
                return response()->json(['message' => 'Subscribed successfully. Check your email!']);
            } else {
                \Illuminate\Support\Facades\Log::error('Brevo API Error: ' . $response->body());
                // Undo subscription if email fails? Maybe keep it.
                return response()->json(['message' => 'Subscribed, but email failed to send.'], 200);
            }

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Subscription Error: ' . $e->getMessage());
            return response()->json(['error' => true, 'message' => 'An error occurred.'], 500);
        }
    }

    public function unsubscribe(Request $request)
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        $subscription = Subscription::where('unsubscribe_token', $request->token)->first();

        if (!$subscription) {
            return response()->json(['message' => 'Invalid or expired token.'], 404);
        }

        $email = $subscription->email;
        $subscription->delete();

        try {
             $response = \Illuminate\Support\Facades\Http::timeout(10)
                ->withHeaders([
                    'api-key' => env('BREVO_API_KEY'),
                    'accept' => 'application/json',
                    'content-type' => 'application/json'
                ])
                ->post('https://api.brevo.com/v3/smtp/email', [
                    'to' => [
                        ['email' => $email]
                    ],
                    'templateId' => 2
                ]);

             if (!$response->successful()) {
                 \Illuminate\Support\Facades\Log::error('Brevo Unsubscribe Error: ' . $response->body());
             } else {
                 \Illuminate\Support\Facades\Log::info('Brevo Unsubscribe Success: ' . $response->body());
             }

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Unsubscribe Email Exception: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Unsubscribed successfully.']);
    }

    public function check(Request $request) {
        $request->validate(['email' => 'required|email']);
        $subscription = Subscription::where('email', $request->email)->first();
        return response()->json(['subscribed' => !!$subscription]);
    }

    // Toggle logic might be redundant now but keeping it for existing frontend calls if any
    public function toggle(Request $request) {
        $request->validate(['email' => 'required|email']);
        $subscription = Subscription::where('email', $request->email)->first();

        if ($subscription) {
            $subscription->delete();
            return response()->json(['subscribed' => false, 'message' => 'Unsubscribed successfully']);
        } else {
             // Re-route to subscribe logic?
             // proper subscribe requires token generation and email.
             // For now simple toggle:
            $token = \Illuminate\Support\Str::random(32);
            Subscription::create(['email' => $request->email, 'unsubscribe_token' => $token]);
            return response()->json(['subscribed' => true, 'message' => 'Subscribed successfully']);
        }
    }

    public function subscribeBrand(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => $request->action === 'subscribe' ? 'Subscribed to brand updates!' : 'Unsubscribed from brand.'
        ]);
    }

    public function subscribeCategory(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => $request->action === 'subscribe' ? 'Subscribed to category updates!' : 'Unsubscribed from category.'
        ]);
    }
}
