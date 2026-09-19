<?php

namespace Database\Seeders;

use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Models\User;
use Illuminate\Database\Seeder;

class MatchSeeder extends Seeder
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
        | CS2 Pro League
        |--------------------------------------------------------------------------
        */

        TournamentMatch::create([
            'tournament_id' => $cs2->id,
            'round' => 'quarter_final',
            'first_player_id' => $john->id,
            'second_player_id' => $ahmed->id,
            'scheduled_at' => '2026-09-16 18:00:00',
            'status' => 'finished',
        ]);

        TournamentMatch::create([
            'tournament_id' => $cs2->id,
            'round' => 'quarter_final',
            'first_player_id' => $karim->id,
            'second_player_id' => $yassine->id,
            'scheduled_at' => '2026-09-16 20:00:00',
            'status' => 'finished',
        ]);

        TournamentMatch::create([
            'tournament_id' => $cs2->id,
            'round' => 'quarter_final',
            'first_player_id' => $sara->id,
            'second_player_id' => $adam->id,
            'scheduled_at' => '2026-09-17 18:00:00',
            'status' => 'finished',
        ]);

        TournamentMatch::create([
            'tournament_id' => $cs2->id,
            'round' => 'quarter_final',
            'first_player_id' => $samir->id,
            'second_player_id' => $omar->id,
            'scheduled_at' => '2026-09-17 20:00:00',
            'status' => 'finished',
        ]);

        TournamentMatch::create([
            'tournament_id' => $cs2->id,
            'round' => 'semi_final',
            'first_player_id' => $john->id,
            'second_player_id' => $karim->id,
            'scheduled_at' => '2026-09-20 20:00:00',
            'status' => 'scheduled',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Winter Cup
        |--------------------------------------------------------------------------
        */

        TournamentMatch::create([
            'tournament_id' => $winter->id,
            'round' => 'quarter_final',
            'first_player_id' => $john->id,
            'second_player_id' => $sara->id,
            'scheduled_at' => '2026-09-18 18:00:00',
            'status' => 'finished',
        ]);
    }
}
