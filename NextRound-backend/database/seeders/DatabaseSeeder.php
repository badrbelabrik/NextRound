<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            GameSeeder::class,
            TournamentSeeder::class,
            RegistrationSeeder::class,
            MatchSeeder::class,
            ResultSeeder::class,
            RankingSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
