<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ranking;
use App\Models\Game;

class RankingController extends Controller
{
    /**
     * Display the rankings for a game.
     */
    public function index(Game $game)
    {
        $rankings = Ranking::where('game_id', $game->id)
            ->with('player')
            ->orderByDesc('points')
            ->get();

        return response()->json([
            'game' => $game,
            'rankings' => $rankings,
        ]);
    }

    /**
     * Display a player's ranking for a game.
     */
    public function show(Game $game, int $user)
    {
        $ranking = Ranking::where('game_id', $game->id)
            ->where('user_id', $user)
            ->with(['player', 'game'])
            ->first();

        if (!$ranking) {
            return response()->json([
                'message' => 'Ranking not found.'
            ], 404);
        }

        return response()->json([
            'ranking' => $ranking
        ]);
    }

    public function topPlayers()
    {
        $rankings = Ranking::with('player')
            ->orderByDesc('points')
            ->limit(5)
            ->get();

        return response()->json($rankings);
    }
}
