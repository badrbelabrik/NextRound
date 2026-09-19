<?php

namespace App\Policies;

use App\Models\Result;
use App\Models\TournamentMatch;
use App\Models\User;

class ResultPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Result $result): bool
    {
        return true;
    }

    public function create(User $user, TournamentMatch $match): bool
    {
        return $user->role === 'admin'
            || $match->tournament->user_id === $user->id;
    }

    public function update(User $user, Result $result): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        $isOrganizer =
            $result->match->tournament->user_id === $user->id;

        if (!$isOrganizer) {
            return false;
        }

        // Do not allow changing an old result
        // once the next round has started.
        $nextRoundExists = TournamentMatch::where(
            'tournament_id',
            $result->match->tournament_id
        )
            ->where('id', '!=', $result->match->id)
            ->where(function ($query) use ($result) {
                $query->where(
                    'round',
                    '>',
                    $result->match->round
                );
            })
            ->exists();

        return !$nextRoundExists;
    }

    public function delete(User $user, Result $result): bool
    {
        return $user->role === 'admin'
            || $result->match->tournament->user_id === $user->id;
    }
}
