<?php

namespace App\Services;

use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class MatchService
{
    public function __construct(
        protected NotificationService $notificationService
    ) {
    }

    /**
     * Generate the first round of matches for a tournament.
     */
    public function generateMatches(Tournament $tournament): array
    {
        return DB::transaction(function () use ($tournament) {

            $players = $tournament->registrations()
                ->where('status', 'approved')
                ->with('user')
                ->get()
                ->pluck('user')
                ->values();

            $playerCount = $players->count();

            if ($playerCount < 2) {
                throw new InvalidArgumentException(
                    'A tournament must have at least 2 approved players.'
                );
            }

            if (!$this->isPowerOfTwo($playerCount)) {
                throw new InvalidArgumentException(
                    'The number of approved players must be 2, 4, 8, 16, etc.'
                );
            }

            if ($tournament->matches()->exists()) {
                throw new InvalidArgumentException(
                    'Matches have already been generated for this tournament.'
                );
            }

            $round = $this->getRoundName($playerCount);

            $matches = [];

            $players = $players->shuffle();

            for ($i = 0; $i < $playerCount; $i += 2) {
                $match = TournamentMatch::create([
                    'tournament_id' => $tournament->id,
                    'round' => $round,
                    'first_player_id' => $players[$i]->id,
                    'second_player_id' => $players[$i + 1]->id,
                    'scheduled_at' => null,
                    'status' => 'scheduled',
                ]);

                $this->notifyMatchPlayers($match);

                $matches[] = $match;
            }

            $tournament->update([
                'status' => 'in_progress',
            ]);

            return $matches;
        });
    }

    /**
     * Generate the next round from the winners of the current round.
     */
    public function generateNextRound(Tournament $tournament): array
    {
        return DB::transaction(function () use ($tournament) {

            $currentRound = $this->getCurrentRound($tournament);

            if (!$currentRound) {
                throw new InvalidArgumentException(
                    'No active round found for this tournament.'
                );
            }

            $currentMatches = $tournament->matches()
                ->where('round', $currentRound)
                ->with([
                    'result',
                    'result.winner'
                ])
                ->get();

            if ($currentMatches->isEmpty()) {
                throw new InvalidArgumentException(
                    'No matches found for the current round.'
                );
            }

            // Every match must be finished and have a result.
            foreach ($currentMatches as $match) {
                if ($match->status !== 'finished' || !$match->result) {
                    throw new InvalidArgumentException(
                        'The current round is not finished yet.'
                    );
                }
            }

            $winners = $currentMatches
                ->map(fn (TournamentMatch $match) => $match->result->winner)
                ->filter()
                ->values();

            if ($winners->count() < 1) {
                throw new InvalidArgumentException(
                    'No winners found for the current round.'
                );
            }

            // If only one winner remains, the tournament is finished.
            if ($winners->count() === 1) {
                $tournament->update([
                    'status' => 'finished',
                ]);

                return [];
            }

            // Determine the next round name.
            $nextRound = $this->getNextRoundName($currentRound);

            // Prevent generating the same round twice.
            if ($tournament->matches()->where('round', $nextRound)->exists()) {
                throw new InvalidArgumentException(
                    'The next round has already been generated.'
                );
            }

            $matches = [];

            for ($i = 0; $i < $winners->count(); $i += 2) {
                $match = TournamentMatch::create([
                    'tournament_id' => $tournament->id,
                    'round' => $nextRound,
                    'first_player_id' => $winners[$i]->id,
                    'second_player_id' => $winners[$i + 1]->id,
                    'scheduled_at' => null,
                    'status' => 'scheduled',
                ]);

                $this->notifyMatchPlayers($match);

                $matches[] = $match;
            }

            return $matches;
        });
    }

    /**
     * Get the current round of the tournament.
     */
    private function getCurrentRound(Tournament $tournament): ?string
    {
        $rounds = [
            'round_of_32',
            'round_of_16',
            'quarter_final',
            'semi_final',
            'final',
        ];

        $existingRounds = $tournament->matches()
            ->select('round')
            ->distinct()
            ->pluck('round')
            ->toArray();

        foreach (array_reverse($rounds) as $round) {
            if (in_array($round, $existingRounds, true)) {
                $nextRound = $this->getNextRoundNameSafe($round);

                if (
                    $nextRound === null ||
                    !$tournament->matches()->where('round', $nextRound)->exists()
                ) {
                    return $round;
                }
            }
        }

        return null;
    }

    /**
     * Check if a number is a power of two.
     */
    private function isPowerOfTwo(int $number): bool
    {
        return $number > 0 && ($number & ($number - 1)) === 0;
    }

    /**
     * Get the name of the first round.
     */
    private function getRoundName(int $playerCount): string
    {
        return match ($playerCount) {
            2 => 'final',
            4 => 'semi_final',
            8 => 'quarter_final',
            16 => 'round_of_16',
            32 => 'round_of_32',
            default => 'first_round',
        };
    }

    /**
     * Get the name of the next round.
     */
    private function getNextRoundName(string $currentRound): string
    {
        return match ($currentRound) {
            'round_of_32' => 'round_of_16',
            'round_of_16' => 'quarter_final',
            'quarter_final' => 'semi_final',
            'semi_final' => 'final',
            default => throw new InvalidArgumentException(
                'There is no next round for the current round.'
            ),
        };
    }
    private function getNextRoundNameSafe(string $currentRound): ?string
    {
        return match ($currentRound) {
            'round_of_32' => 'round_of_16',
            'round_of_16' => 'quarter_final',
            'quarter_final' => 'semi_final',
            'semi_final' => 'final',
            'final' => null,
            default => null,
        };
    }

    private function notifyMatchPlayers(TournamentMatch $match): void
    {
        $players = [
            $match->firstPlayer,
            $match->secondPlayer,
        ];

        foreach ($players as $player) {
            if (!$player) {
                continue;
            }

            $this->notificationService->create(
                $player,
                'Match scheduled',
                "Your {$match->round} match in {$match->tournament->title} has been scheduled."
            );
        }
    }
}
