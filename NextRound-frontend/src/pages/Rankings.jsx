import { useEffect, useState } from 'react';
import { Trophy, Gamepad2 } from 'lucide-react';

import Navbar from '../components/Navbar';
import api from '../services/api';

function Rankings() {
    const [games, setGames] = useState([]);
    const [rankings, setRankings] = useState([]);

    const [selectedGameId, setSelectedGameId] = useState('');

    const [loadingGames, setLoadingGames] = useState(true);
    const [loadingRankings, setLoadingRankings] = useState(false);

    const [error, setError] = useState('');

    /*
    |--------------------------------------------------------------------------
    | Load games
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        const loadGames = async () => {
            try {
                setLoadingGames(true);
                setError('');

                const response = await api.get('/games');

                const gamesData =
                    response.data.games ??
                    response.data ??
                    [];

                setGames(gamesData);

                if (gamesData.length > 0) {
                    setSelectedGameId(
                        String(gamesData[0].id)
                    );
                }
            } catch (error) {
                console.error(
                    'Error loading games:',
                    error.response?.data ||
                        error.message
                );

                setError('Unable to load games.');
            } finally {
                setLoadingGames(false);
            }
        };

        loadGames();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Load rankings for selected game
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        if (!selectedGameId) {
            setRankings([]);
            return;
        }

        const loadRankings = async () => {
            try {
                setLoadingRankings(true);
                setError('');

                const response = await api.get(
                    `/games/${selectedGameId}/rankings`
                );

                const rankingsData =
                    response.data.rankings ??
                    response.data ??
                    [];

                setRankings(rankingsData);
            } catch (error) {
                console.error(
                    'Error loading rankings:',
                    error.response?.data ||
                        error.message
                );

                setRankings([]);
                setError(
                    'Unable to load rankings for this game.'
                );
            } finally {
                setLoadingRankings(false);
            }
        };

        loadRankings();
    }, [selectedGameId]);

    const selectedGame = games.find(
        (game) =>
            Number(game.id) ===
            Number(selectedGameId)
    );

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3">
                        <Trophy
                            size={32}
                            className="text-[#A78BFA]"
                        />

                        <h1 className="text-4xl font-bold">
                            Rankings
                        </h1>
                    </div>

                    <p className="mt-3 max-w-2xl text-gray-400">
                        Check the top players and their
                        performance for each game.
                    </p>
                </div>

                {/* Game selector */}
                <section className="mb-8 rounded-2xl border border-white/10 bg-[#111827] p-6">

                    <div className="mb-5 flex items-center gap-3">
                        <Gamepad2
                            size={22}
                            className="text-[#A78BFA]"
                        />

                        <h2 className="text-lg font-semibold">
                            Select a game
                        </h2>
                    </div>

                    {loadingGames ? (
                        <p className="text-sm text-gray-400">
                            Loading games...
                        </p>
                    ) : games.length === 0 ? (
                        <p className="text-sm text-gray-400">
                            No games available.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-3">

                            {games.map((game) => (
                                <button
                                    key={game.id}
                                    onClick={() =>
                                        setSelectedGameId(
                                            String(game.id)
                                        )
                                    }
                                    className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                                        Number(
                                            selectedGameId
                                        ) === Number(game.id)
                                            ? 'bg-[#7C3AED] text-white'
                                            : 'border border-white/10 bg-[#0B0F19] text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {game.name}
                                </button>
                            ))}

                        </div>
                    )}

                </section>

                {/* Selected game */}
                {selectedGame && (
                    <div className="mb-6">
                        <div className="flex items-center gap-3">

                            {selectedGame.image ? (
                                <img
                                    src={selectedGame.image}
                                    alt={selectedGame.name}
                                    className="h-12 w-12 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                                    <Gamepad2
                                        size={24}
                                        className="text-purple-400"
                                    />
                                </div>
                            )}

                            <div>
                                <h2 className="text-2xl font-bold">
                                    {selectedGame.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Player rankings
                                </p>
                            </div>

                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {/* Rankings */}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">

                    {/* Loading */}
                    {loadingRankings ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <p className="text-gray-400">
                                Loading rankings...
                            </p>
                        </div>
                    ) : rankings.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                            <Trophy
                                size={48}
                                className="mb-4 text-gray-600"
                            />

                            <h3 className="text-lg font-semibold">
                                No ranking data
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                There are no ranked players for
                                this game yet.
                            </p>

                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[700px]">

                                <thead>
                                    <tr className="border-b border-white/10 text-left text-sm text-gray-500">

                                        <th className="px-6 py-4">
                                            Rank
                                        </th>

                                        <th className="px-6 py-4">
                                            Player
                                        </th>

                                        <th className="px-6 py-4">
                                            Points
                                        </th>

                                        <th className="px-6 py-4">
                                            Victories
                                        </th>

                                        <th className="px-6 py-4">
                                            Defeats
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {rankings.map(
                                        (ranking, index) => {
                                            const position =
                                                ranking.position ??
                                                index + 1;

                                            const playerName =
                                                ranking.player
                                                    ?.name ??
                                                ranking.user
                                                    ?.name ??
                                                'Unknown player';

                                            const isTopThree =
                                                position <= 3;

                                            return (
                                                <tr
                                                    key={
                                                        ranking.id ??
                                                        `${selectedGameId}-${playerName}-${index}`
                                                    }
                                                    className="border-b border-white/5 transition hover:bg-white/[0.03]"
                                                >

                                                    {/* Rank */}
                                                    <td className="px-6 py-5">

                                                        <div
                                                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
                                                                position ===
                                                                1
                                                                    ? 'bg-yellow-500/10 text-yellow-400'
                                                                    : position ===
                                                                        2
                                                                    ? 'bg-gray-400/10 text-gray-300'
                                                                    : position ===
                                                                        3
                                                                    ? 'bg-orange-500/10 text-orange-400'
                                                                    : 'bg-white/5 text-gray-400'
                                                            }`}
                                                        >
                                                            {position}
                                                        </div>

                                                    </td>

                                                    {/* Player */}
                                                    <td className="px-6 py-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                                                                <span className="text-sm font-bold text-purple-300">
                                                                    {playerName
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <p className="font-semibold text-white">
                                                                    {
                                                                        playerName
                                                                    }
                                                                </p>
                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* Points */}
                                                    <td className="px-6 py-5">

                                                        <span
                                                            className={`font-bold ${
                                                                isTopThree
                                                                    ? 'text-[#A78BFA]'
                                                                    : 'text-white'
                                                            }`}
                                                        >
                                                            {
                                                                ranking.points ??
                                                                    0
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* Victories */}
                                                    <td className="px-6 py-5">

                                                        <span className="text-green-400">
                                                            {
                                                                ranking.victories ??
                                                                    0
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* Defeats */}
                                                    <td className="px-6 py-5">

                                                        <span className="text-red-400">
                                                            {
                                                                ranking.defeats ??
                                                                    0
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default Rankings;