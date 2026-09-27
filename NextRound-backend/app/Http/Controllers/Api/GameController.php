<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GameController extends Controller
{
    /**
     * Display a listing of games.
     */
    public function index()
    {
        $games = Game::latest()->get();

        return response()->json([
            'games' => $games
        ]);
    }

    /**
     * Store a newly created game.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')
                ->store('games', 'public');
        }

        $game = Game::create($validated);

        return response()->json([
            'message' => 'Game created successfully.',
            'game' => $game,
        ], 201);
    }

    /**
     * Display the specified game.
     */
    public function show(Game $game)
    {
        return response()->json([
            'game' => $game
        ]);
    }

    /**
     * Update the specified game.
     */
    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if ($request->hasFile('image')) {
            if ($game->image) {
                Storage::disk('public')->delete($game->image);
            }

            $validated['image'] = $request->file('image')
                ->store('games', 'public');
        }

        $game->update($validated);

        return response()->json([
            'message' => 'Game updated successfully.',
            'game' => $game->fresh(),
        ]);
    }

    /**
     * Remove the specified game.
     */
    public function destroy(Game $game)
    {
        if ($game->image) {
            Storage::disk('public')->delete($game->image);
        }

        $game->delete();

        return response()->json([
            'message' => 'Game deleted successfully.',
        ]);
    }
}
