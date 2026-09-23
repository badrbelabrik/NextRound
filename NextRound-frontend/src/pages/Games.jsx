import { useEffect, useState } from 'react';
import { Gamepad2 } from 'lucide-react';

import Navbar from '../components/Navbar';
import api from '../services/api';

function Games() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadGames = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await api.get('/games');

                const gamesData =
                    response.data.games ??
                    response.data ??
                    [];

                setGames(gamesData);
            } catch (error) {
                console.error(
                    'Error loading games:',
                    error.response?.data ||
                        error.message
                );

                setError('Unable to load games.');
            } finally {
                setLoading(false);
            }
        };

        loadGames();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">
                        Games
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-400">
                        Explore the games available for
                        tournaments on NextRound.
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <p className="text-gray-400">
                            Loading games...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                        <p className="text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    games.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center">
                            <h2 className="text-xl font-semibold">
                                No games available
                            </h2>

                            <p className="mt-2 text-gray-400">
                                There are no games to display
                                right now.
                            </p>
                        </div>
                    )}

                {/* Games */}
                {!loading &&
                    !error &&
                    games.length > 0 && (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {games.map((game) => (
                                <div
                                    key={game.id}
                                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827] transition hover:-translate-y-1 hover:border-purple-500/30"
                                >

                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-[#0B0F19]">

                                        {game.image ? (
                                            <img
                                                src={game.image}
                                                alt={game.name}
                                                className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/20">
                                                <Gamepad2
                                                    size={64}
                                                    className="text-purple-400/50"
                                                />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">

                                        <h2 className="text-xl font-bold">
                                            {game.name}
                                        </h2>

                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                                            {game.description ||
                                                'No description available.'}
                                        </p>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

            </main>
        </div>
    );
}

export default Games;