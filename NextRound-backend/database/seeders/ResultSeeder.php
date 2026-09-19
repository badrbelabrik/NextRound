<?php

namespace Database\Seeders;

use App\Models\Result;
use App\Models\TournamentMatch;
use App\Models\User;
use Illuminate\Database\Seeder;

class ResultSeeder extends Seeder
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

        $match1 = TournamentMatch::where([
            'first_player_id' => $john->id,
            'second_player_id' => $ahmed->id,
            'round' => 'quarter_final',
        ])->first();

        Result::create([
            'match_id' => $match1->id,
            'score_player1' => 2,
            'score_player2' => 1,
            'winner_id' => $john->id,
        ]);

        $match2 = TournamentMatch::where([
            'first_player_id' => $karim->id,
            'second_player_id' => $yassine->id,
            'round' => 'quarter_final',
        ])->first();

        Result::create([
            'match_id' => $match2->id,
            'score_player1' => 2,
            'score_player2' => 0,
            'winner_id' => $karim->id,
        ]);

        $match3 = TournamentMatch::where([
            'first_player_id' => $sara->id,
            'second_player_id' => $adam->id,
            'round' => 'quarter_final',
        ])->first();

        Result::create([
            'match_id' => $match3->id,
            'score_player1' => 2,
            'score_player2' => 1,
            'winner_id' => $sara->id,
        ]);

        $match4 = TournamentMatch::where([
            'first_player_id' => $samir->id,
            'second_player_id' => $omar->id,
            'round' => 'quarter_final',
        ])->first();

        Result::create([
            'match_id' => $match4->id,
            'score_player1' => 2,
            'score_player2' => 0,
            'winner_id' => $samir->id,
        ]);

        $winterMatch = TournamentMatch::where([
            'first_player_id' => $john->id,
            'second_player_id' => $sara->id,
            'round' => 'quarter_final',
        ])->first();

        Result::create([
            'match_id' => $winterMatch->id,
            'score_player1' => 0,
            'score_player2' => 2,
            'winner_id' => $sara->id,
        ]);
    }
}
