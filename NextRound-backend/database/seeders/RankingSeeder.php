<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Ranking;
use App\Models\User;
use Illuminate\Database\Seeder;

class RankingSeeder extends Seeder
{
    public function run(): void
    {
        $valorant = Game::where(
            'name',
            'Valorant'
        )->first();

        $cs2 = Game::where(
            'name',
            'Counter-Strike 2'
        )->first();

        $lol = Game::where(
            'name',
            'League of Legends'
        )->first();

        $john = User::where('email', 'john@example.com')->first();
        $ahmed = User::where('email', 'ahmed@example.com')->first();
        $karim = User::where('email', 'karim@example.com')->first();
        $yassine = User::where('email', 'yassine@example.com')->first();

        Ranking::create([
            'user_id' => $john->id,
            'game_id' => $cs2->id,
            'points' => 3,
            'victories' => 1,
            'defeats' => 0,
            'position' => 1,
        ]);

        Ranking::create([
            'user_id' => $karim->id,
            'game_id' => $cs2->id,
            'points' => 3,
            'victories' => 1,
            'defeats' => 0,
            'position' => 2,
        ]);

        Ranking::create([
            'user_id' => $ahmed->id,
            'game_id' => $cs2->id,
            'points' => 0,
            'victories' => 0,
            'defeats' => 1,
            'position' => 3,
        ]);

        Ranking::create([
            'user_id' => $yassine->id,
            'game_id' => $cs2->id,
            'points' => 0,
            'victories' => 0,
            'defeats' => 1,
            'position' => 4,
        ]);

        Ranking::create([
            'user_id' => $john->id,
            'game_id' => $valorant->id,
            'points' => 0,
            'victories' => 0,
            'defeats' => 0,
            'position' => 1,
        ]);

        Ranking::create([
            'user_id' => $john->id,
            'game_id' => $lol->id,
            'points' => 0,
            'victories' => 0,
            'defeats' => 1,
            'position' => 1,
        ]);
    }
}
