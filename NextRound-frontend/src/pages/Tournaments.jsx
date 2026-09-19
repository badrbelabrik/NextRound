import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TournamentCard from '../components/TournamentCard';
import api from '../services/api';

function formatDate(date) {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatStatus(status) {
    if (!status) return 'Unknown';

    return status
        .replace('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadTournaments = async () => {
            try {
                const response = await api.get('/tournaments');

                const tournamentsData = response.data.tournaments;

                setTournaments(
                    tournamentsData.map((tournament) => ({
                        id: tournament.id,
                        image: tournament.game?.image ?? null,
                        game: tournament.game?.name ?? 'Unknown game',
                        title: tournament.title,
                        organizer:
                            tournament.user?.name ?? 'Unknown organizer',
                        players:
                            tournament.approved_registrations_count ?? 0,
                        maxPlayers: tournament.max_players,
                        startDate: formatDate(tournament.start_date),
                        endDate: formatDate(tournament.end_date),
                        status: formatStatus(tournament.status),
                    }))
                );
            } catch (error) {
                console.error(
                    'Error loading tournaments:',
                    error.response?.data || error.message
                );

                setError('Unable to load tournaments.');
            } finally {
                setLoading(false);
            }
        };

        loadTournaments();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">
                        Tournaments
                    </h1>

                    <p className="mt-3 text-gray-400">
                        Discover and join tournaments on NextRound.
                    </p>
                </div>

                {loading && (
                    <div className="py-20 text-center text-gray-400">
                        Loading tournaments...
                    </div>
                )}

                {!loading && error && (
                    <div className="py-20 text-center text-red-400">
                        {error}
                    </div>
                )}

                {!loading && !error && tournaments.length === 0 && (
                    <div className="py-20 text-center text-gray-400">
                        No tournaments available.
                    </div>
                )}

                {!loading && !error && tournaments.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tournaments.map((tournament) => (
                            <TournamentCard
                                key={tournament.id}
                                {...tournament}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Tournaments;