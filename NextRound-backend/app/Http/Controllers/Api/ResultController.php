<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\TournamentMatch;
use App\Services\ResultService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ResultController extends Controller
{
    public function __construct(
        protected ResultService $resultService
    ) {
    }

    /**
     * Display a listing of results.
     */
    public function index()
    {
        $results = Result::with([
            'match',
            'winner'
        ])->latest()->get();

        return response()->json([
            'results' => $results
        ]);
    }

    /**
     * Store a newly created result.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'match_id' => 'required|exists:matches,id|unique:results,match_id',
            'score_player1' => 'required|integer|min:0',
            'score_player2' => 'required|integer|min:0',
            'winner_id' => 'required|exists:users,id',
        ]);

        $match = TournamentMatch::findOrFail($validated['match_id']);
        Gate::authorize('create', $match);
        // The winner must be one of the two players.
        if (
            $validated['winner_id'] != $match->first_player_id &&
            $validated['winner_id'] != $match->second_player_id
        ) {
            return response()->json([
                'message' => 'The winner must be one of the players in the match.'
            ], 422);
        }

        // The score must determine the winner.
        if (
            $validated['score_player1'] === $validated['score_player2']
        ) {
            return response()->json([
                'message' => 'A match cannot end in a draw.'
            ], 422);
        }

        $expectedWinnerId = $validated['score_player1'] > $validated['score_player2']
            ? $match->first_player_id
            : $match->second_player_id;

        if ((int) $validated['winner_id'] !== (int) $expectedWinnerId) {
            return response()->json([
                'message' => 'The winner does not match the submitted score.'
            ], 422);
        }

        $result = $this->resultService->createResult(
            $match,
            $validated['score_player1'],
            $validated['score_player2'],
            $validated['winner_id']
        );

        return response()->json([
            'message' => 'Result created successfully.',
            'result' => $result->load([
                'match',
                'winner'
            ])
        ], 201);
    }

    /**
     * Display the specified result.
     */
    public function show(Result $result)
    {
        Gate::authorize('view', $result);

        $result->load([
            'match',
            'winner'
        ]);

        return response()->json([
            'result' => $result
        ]);
    }

    /**
     * Update the specified result.
     */
    public function update(Request $request, Result $result)
    {
        Gate::authorize('update', $result);

        $validated = $request->validate([
            'score_player1' => 'required|integer|min:0',
            'score_player2' => 'required|integer|min:0',
            'winner_id' => 'required|exists:users,id',
        ]);

        $match = $result->match;

        // The winner must be one of the two players.
        if (
            $validated['winner_id'] != $match->first_player_id &&
            $validated['winner_id'] != $match->second_player_id
        ) {
            return response()->json([
                'message' => 'The winner must be one of the players in the match.'
            ], 422);
        }

        // A match cannot end in a draw.
        if (
            $validated['score_player1'] === $validated['score_player2']
        ) {
            return response()->json([
                'message' => 'A match cannot end in a draw.'
            ], 422);
        }

        $expectedWinnerId = $validated['score_player1'] > $validated['score_player2']
            ? $match->first_player_id
            : $match->second_player_id;

        if ((int) $validated['winner_id'] !== (int) $expectedWinnerId) {
            return response()->json([
                'message' => 'The winner does not match the submitted score.'
            ], 422);
        }

        /*
         * For now, update only the result.
         *
         * Be careful: changing a result after the ranking has already
         * been updated can make the ranking inconsistent.
         *
         * We should handle ranking reversal/recalculation in a dedicated
         * ResultService method before allowing result modifications.
         */
        $result->update($validated);

        return response()->json([
            'message' => 'Result updated successfully.',
            'result' => $result->fresh()->load([
                'match',
                'winner'
            ])
        ]);
    }

    /**
     * Remove the specified result.
     */
    public function destroy(Result $result)
    {
        Gate::authorize('delete', $result);

        $result->delete();

        return response()->json([
            'message' => 'Result deleted successfully.'
        ]);
    }

    public function myResults(Request $request)
    {
        $userId = $request->user()->id;

        $results = Result::with([
            'match.tournament',
            'match.firstPlayer',
            'match.secondPlayer',
            'winner',
        ])
            ->whereHas('match', function ($query) use ($userId) {
                $query->where(function ($query) use ($userId) {
                    $query->where('first_player_id', $userId)
                        ->orWhere('second_player_id', $userId);
                });
            })
            ->latest()
            ->get();

        return response()->json($results);
    }
}
