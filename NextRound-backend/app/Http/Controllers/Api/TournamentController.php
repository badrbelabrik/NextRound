<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TournamentController extends Controller
{
    /**
     * Display a listing of tournaments.
     */
    public function index()
    {
        $tournaments = Tournament::with([
            'game',
            'user',
        ])
            ->withCount([
                'registrations as approved_registrations_count' => function ($query) {
                    $query->where('status', 'approved');
                },
            ])
            ->latest()
            ->get();

        return response()->json([
            'tournaments' => $tournaments,
        ]);
    }

    /**
     * Store a newly created tournament.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Tournament::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'game_id' => 'required|exists:games,id',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'max_players' => 'required|integer|min:2',
            'prize' => 'nullable|string|max:255',
        ]);

        $tournament = Tournament::create([
            'title' => $validated['title'],
            'game_id' => $validated['game_id'],
            'user_id' => $request->user()->id,
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
            'max_players' => $validated['max_players'],
            'status' => 'draft',
            'prize' => $validated['prize'] ?? null,
        ]);

        return response()->json([
            'message' => 'Tournament created successfully.',
            'tournament' => $tournament
        ], 201);
    }

    /**
     * Display the specified tournament.
     */
    public function show(Tournament $tournament)
    {
        $tournament->load('game', 'user');

        return response()->json([
            'tournament' => $tournament
        ]);
    }

    /**
     * Update the specified tournament.
     */
    public function update(Request $request, Tournament $tournament)
    {
        Gate::authorize('update', $tournament);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'game_id' => 'required|exists:games,id',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'max_players' => 'required|integer|min:2',
            'status' => 'nullable|in:draft,open,closed,in_progress,finished',
            'prize' => 'nullable|string|max:255',
        ]);

        $tournament->update($validated);

        return response()->json([
            'message' => 'Tournament updated successfully.',
            'tournament' => $tournament
        ]);
    }

    /**
     * Remove the specified tournament.
     */
    public function destroy(Tournament $tournament)
    {
        Gate::authorize('delete', $tournament);

        $tournament->delete();

        return response()->json([
            'message' => 'Tournament deleted successfully.'
        ]);
    }

    public function myTournaments(Request $request)
    {
        $tournaments = Tournament::with([
            'game',
            'user',
        ])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($tournaments);
    }
}
