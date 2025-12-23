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

        $subscription = Subscription::firstOrCreate(
            ['email' => $request->email]
        );

        if ($subscription->wasRecentlyCreated) {
            try {
                \Illuminate\Support\Facades\Mail::to($request->email)->send(new \App\Mail\SubscriptionSuccessMail());
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Subscription email failed: ' . $e->getMessage());
            }
            return response()->json(['message' => 'Subscribed successfully']);
        }

        return response()->json(['message' => 'You are already subscribed!']);
    }

    public function check(Request $request) {
        $request->validate(['email' => 'required|email']);
        $subscription = Subscription::where('email', $request->email)->first();
        return response()->json(['subscribed' => !!$subscription]);
    }

    public function toggle(Request $request) {
        $request->validate(['email' => 'required|email']);
        $subscription = Subscription::where('email', $request->email)->first();

        if ($subscription) {
            $subscription->delete();
            return response()->json(['subscribed' => false, 'message' => 'Unsubscribed successfully']);
        } else {
            Subscription::create(['email' => $request->email]);
             // Optional: Send welcome email again? Maybe not for re-subscribe
            return response()->json(['subscribed' => true, 'message' => 'Subscribed successfully']);
        }
    }
}
