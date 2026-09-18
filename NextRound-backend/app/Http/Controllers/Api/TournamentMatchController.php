<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Http\Request;
use App\Services\MatchService;
use Illuminate\Support\Facades\Gate;

class TournamentMatchController extends Controller
{
    public function __construct(
        protected MatchService $matchService
    ) {
    }
    /**
     * Display a listing of matches.
     */
    public function index()
    {
        $matches = TournamentMatch::with([
            'tournament',
            'firstPlayer',
            'secondPlayer'
        ])->latest()->get();

        return response()->json([
            'matches' => $matches
        ]);
    }

    /**
     * Store a newly created match.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', TournamentMatch::class);

        $validated = $request->validate([
            'tournament_id' => 'required|exists:tournaments,id',
            'round' => 'required|string|max:255',
            'first_player_id' => 'nullable|exists:users,id|different:second_player_id',
            'second_player_id' => 'nullable|exists:users,id',
            'scheduled_at' => 'nullable|date',
            'status' => 'nullable|in:scheduled,in_progress,finished,cancelled',
        ]);

        $match = TournamentMatch::create([
            'tournament_id' => $validated['tournament_id'],
            'round' => $validated['round'],
            'first_player_id' => $validated['first_player_id'] ?? null,
            'second_player_id' => $validated['second_player_id'] ?? null,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'status' => $validated['status'] ?? 'scheduled',
        ]);

        return response()->json([
            'message' => 'Match created successfully.',
            'match' => $match
        ], 201);
    }

    /**
     * Display the specified match.
     */
    public function show(TournamentMatch $match)
    {
        $match->load([
            'tournament',
            'firstPlayer',
            'secondPlayer'
        ]);

        Gate::authorize('view', $match);

        return response()->json([
            'match' => $match
        ]);
    }

    /**
     * Update the specified match.
     */
    public function update(Request $request, TournamentMatch $match)
    {
        Gate::authorize('update', $match);

        $validated = $request->validate([
            'round' => 'required|string|max:255',
            'first_player_id' => 'nullable|exists:users,id|different:second_player_id',
            'second_player_id' => 'nullable|exists:users,id',
            'scheduled_at' => 'nullable|date',
            'status' => 'nullable|in:scheduled,in_progress,finished,cancelled',
        ]);

        $match->update($validated);

        return response()->json([
            'message' => 'Match updated successfully.',
            'match' => $match
        ]);
    }

    /**
     * Remove the specified match.
     */
    public function destroy(TournamentMatch $match)
    {
        Gate::authorize('delete', $match);

        $match->delete();

        return response()->json([
            'message' => 'Match deleted successfully.'
        ]);
    }

    public function generate(Tournament $tournament)
    {
        try {
            $matches = $this->matchService->generateMatches($tournament);

            return response()->json([
                'message' => 'Matches generated successfully.',
                'matches' => $matches,
            ], 201);

        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function myMatches(Request $request)
    {
        $userId = $request->user()->id;

        $matches = TournamentMatch::with([
            'tournament',
            'firstPlayer',
            'secondPlayer',
            'result',
        ])
            ->where(function ($query) use ($userId) {
                $query->where('first_player_id', $userId)
                    ->orWhere('second_player_id', $userId);
            })
            ->latest('scheduled_at')
            ->get();

        return response()->json($matches);
    }
}
