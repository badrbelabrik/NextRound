<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $john = User::where('email', 'john@example.com')->first();

        $cs2 = Tournament::where(
            'title',
            'CS2 Pro League'
        )->first();

        $summer = Tournament::where(
            'title',
            'Summer Championship'
        )->first();

        Notification::create([
            'user_id' => $john->id,
            'title' => 'Registration Approved',
            'message' => "Your registration for {$summer->title} has been approved.",
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $john->id,
            'title' => 'Match Scheduled',
            'message' => "Your match in {$cs2->title} has been scheduled.",
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $john->id,
            'title' => 'Result Available',
            'message' => "Your latest match result is now available.",
            'is_read' => false,
        ]);
    }
}
