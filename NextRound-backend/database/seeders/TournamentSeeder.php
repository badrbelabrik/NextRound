<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Database\Seeder;

class TournamentSeeder extends Seeder
{
    public function run(): void
    {
        $john = User::where('email', 'john@example.com')->first();
        $ahmed = User::where('email', 'ahmed@example.com')->first();
        $karim = User::where('email', 'karim@example.com')->first();

        $valorant = Game::where('name', 'Valorant')->first();
        $cs2 = Game::where('name', 'Counter-Strike 2')->first();
        $lol = Game::where('name', 'League of Legends')->first();
        $fc24 = Game::where('name', 'FC 24')->first();

        Tournament::create([
            'title' => 'Summer Championship',
            'game_id' => $valorant->id,
            'user_id' => $john->id,
            'description' => 'Summer Valorant championship.',
            'start_date' => '2026-09-20',
            'end_date' => '2026-09-22',
            'max_players' => 8,
            'status' => 'open',
            'prize' => '1000 MAD',
        ]);

        Tournament::create([
            'title' => 'CS2 Pro League',
            'game_id' => $cs2->id,
            'user_id' => $ahmed->id,
            'description' => 'Competitive Counter-Strike 2 league.',
            'start_date' => '2026-09-15',
            'end_date' => '2026-09-21',
            'max_players' => 8,
            'status' => 'in_progress',
            'prize' => '1500 MAD',
        ]);

        Tournament::create([
            'title' => 'Winter Cup',
            'game_id' => $lol->id,
            'user_id' => $karim->id,
            'description' => 'League of Legends winter cup.',
            'start_date' => '2026-10-02',
            'end_date' => '2026-10-04',
            'max_players' => 8,
            'status' => 'in_progress',
            'prize' => '2000 MAD',
        ]);

        Tournament::create([
            'title' => 'FC 24 Challenge',
            'game_id' => $fc24->id,
            'user_id' => $john->id,
            'description' => 'FC 24 competitive challenge.',
            'start_date' => '2026-10-10',
            'end_date' => '2026-10-11',
            'max_players' => 8,
            'status' => 'draft',
            'prize' => '500 MAD',
        ]);
    }
}
