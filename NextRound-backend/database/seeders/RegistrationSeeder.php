<?php

namespace Database\Seeders;

use App\Models\Registration;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Database\Seeder;

class RegistrationSeeder extends Seeder
{
    public function run(): void
    {
        $john = User::where('email', 'john@example.com')->first();
        $ahmed = User::where('email', 'ahmed@example.com')->first();
        $karim = User::where('email', 'karim@example.com')->first();
        $yassine = User::where('email', 'yassine@example.com')->first();
        $sara = User::where('email', 'sara@example.com')->first();
        $adam = User::where('email', 'adam@example.com')->first();
        $samir = User::where('email', 'samir@example.com')->first();
        $omar = User::where('email', 'omar@example.com')->first();

        $summer = Tournament::where(
            'title',
            'Summer Championship'
        )->first();

        $cs2 = Tournament::where(
            'title',
            'CS2 Pro League'
        )->first();

        $winter = Tournament::where(
            'title',
            'Winter Cup'
        )->first();

        /*
        |--------------------------------------------------------------------------
        | Summer Championship
        |--------------------------------------------------------------------------
        */

        Registration::create([
            'tournament_id' => $summer->id,
            'user_id' => $john->id,
            'status' => 'approved',
            'registration_date' => '2026-09-10',
        ]);

        Registration::create([
            'tournament_id' => $summer->id,
            'user_id' => $ahmed->id,
            'status' => 'approved',
            'registration_date' => '2026-09-10',
        ]);

        Registration::create([
            'tournament_id' => $summer->id,
            'user_id' => $karim->id,
            'status' => 'approved',
            'registration_date' => '2026-09-11',
        ]);

        Registration::create([
            'tournament_id' => $summer->id,
            'user_id' => $yassine->id,
            'status' => 'approved',
            'registration_date' => '2026-09-11',
        ]);

        Registration::create([
            'tournament_id' => $summer->id,
            'user_id' => $sara->id,
            'status' => 'approved',
            'registration_date' => '2026-09-12',
        ]);

        Registration::create([
            'tournament_id' => $summer->id,
            'user_id' => $adam->id,
            'status' => 'approved',
            'registration_date' => '2026-09-12',
        ]);

        Registration::create([
            'tournament_id' => $summer->id,
            'user_id' => $samir->id,
            'status' => 'approved',
            'registration_date' => '2026-09-13',
        ]);

        Registration::create([
            'tournament_id' => $summer->id,
            'user_id' => $omar->id,
            'status' => 'approved',
            'registration_date' => '2026-09-13',
        ]);

        /*
        |--------------------------------------------------------------------------
        | CS2 Pro League
        |--------------------------------------------------------------------------
        */

        Registration::create([
            'tournament_id' => $cs2->id,
            'user_id' => $john->id,
            'status' => 'approved',
            'registration_date' => '2026-09-10',
        ]);

        Registration::create([
            'tournament_id' => $cs2->id,
            'user_id' => $ahmed->id,
            'status' => 'approved',
            'registration_date' => '2026-09-10',
        ]);

        Registration::create([
            'tournament_id' => $cs2->id,
            'user_id' => $karim->id,
            'status' => 'approved',
            'registration_date' => '2026-09-11',
        ]);

        Registration::create([
            'tournament_id' => $cs2->id,
            'user_id' => $yassine->id,
            'status' => 'approved',
            'registration_date' => '2026-09-11',
        ]);

        Registration::create([
            'tournament_id' => $cs2->id,
            'user_id' => $sara->id,
            'status' => 'approved',
            'registration_date' => '2026-09-12',
        ]);

        Registration::create([
            'tournament_id' => $cs2->id,
            'user_id' => $adam->id,
            'status' => 'approved',
            'registration_date' => '2026-09-12',
        ]);

        Registration::create([
            'tournament_id' => $cs2->id,
            'user_id' => $samir->id,
            'status' => 'approved',
            'registration_date' => '2026-09-13',
        ]);

        Registration::create([
            'tournament_id' => $cs2->id,
            'user_id' => $omar->id,
            'status' => 'approved',
            'registration_date' => '2026-09-13',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Winter Cup
        |--------------------------------------------------------------------------
        */

        Registration::create([
            'tournament_id' => $winter->id,
            'user_id' => $john->id,
            'status' => 'approved',
            'registration_date' => '2026-09-14',
        ]);

        Registration::create([
            'tournament_id' => $winter->id,
            'user_id' => $ahmed->id,
            'status' => 'approved',
            'registration_date' => '2026-09-14',
        ]);

        Registration::create([
            'tournament_id' => $winter->id,
            'user_id' => $karim->id,
            'status' => 'approved',
            'registration_date' => '2026-09-14',
        ]);

        Registration::create([
            'tournament_id' => $winter->id,
            'user_id' => $sara->id,
            'status' => 'approved',
            'registration_date' => '2026-09-15',
        ]);

        Registration::create([
            'tournament_id' => $winter->id,
            'user_id' => $yassine->id,
            'status' => 'pending',
            'registration_date' => '2026-09-15',
        ]);

        Registration::create([
            'tournament_id' => $winter->id,
            'user_id' => $adam->id,
            'status' => 'pending',
            'registration_date' => '2026-09-16',
        ]);
    }
}
