<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        Game::create([
            'name' => 'Valorant',
            'description' => 'Competitive tactical shooter.',
            'image' => null,
        ]);

        Game::create([
            'name' => 'Counter-Strike 2',
            'description' => 'Competitive first-person shooter.',
            'image' => null,
        ]);

        Game::create([
            'name' => 'League of Legends',
            'description' => 'Competitive multiplayer online battle arena.',
            'image' => null,
        ]);

        Game::create([
            'name' => 'FC 24',
            'description' => 'Competitive football game.',
            'image' => null,
        ]);
    }
}
