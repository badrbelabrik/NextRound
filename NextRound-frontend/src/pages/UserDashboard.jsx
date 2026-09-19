import { useEffect, useState } from 'react';
import {
    CalendarDays,
    Gamepad2,
    Settings,
    Trophy,
    UserCircle,
    Users,
    Plus,
    ChevronRight,
} from 'lucide-react';

import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';


function UserDashboard() {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState('activity');

    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [recentTournaments, setRecentTournaments] = useState([]);
    const [latestResults, setLatestResults] = useState([]);
    const [myTournaments, setMyTournaments] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadDashboardData = async () => {
            try {
                const tournamentsResponse =
                    await api.get('/tournaments');


                setRecentTournaments(
                    tournamentsResponse.data.tournaments.map(
                        (tournament) => ({
                            id: tournament.id,
                            title: tournament.title,
                            game:
                                tournament.game?.name ??
                                'Unknown game',
                            status: formatStatus(
                                tournament.status
                            ),
                        })
                    )
                );
            } catch (error) {
                console.error(
                    'ERROR /tournaments:',
                    error.response?.data || error.message
                );
            }

            try {
                const myTournamentsResponse =
                    await api.get('/my-tournaments');

                setMyTournaments(
                    myTournamentsResponse.data.map(
                        (tournament) => ({
                            id: tournament.id,
                            title: tournament.title,
                            game:
                                tournament.game?.name ??
                                'Unknown game',
                            players: `${
                                tournament.approved_registrations_count ??
                                tournament.registrations?.filter(
                                    (registration) =>
                                        registration.status ===
                                        'approved'
                                ).length ??
                                0
                            } / ${tournament.max_players}`,
                            status: formatStatus(
                                tournament.status
                            ),
                            startDate: formatDate(
                                tournament.start_date
                            ),
                            endDate: formatDate(
                                tournament.end_date
                            ),
                        })
                    )
                );
            } catch (error) {
                console.error(
                    'ERROR /my-tournaments:',
                    error.response?.data || error.message
                );
            }

            try {
                const registrationsResponse =
                    await api.get('/my-registrations');


                setRegistrations(
                    registrationsResponse.data.map(
                        (registration) => ({
                            id: registration.id,
                            title:
                                registration.tournament?.title ??
                                'Unknown tournament',
                            game:
                                registration.tournament?.game
                                    ?.name ??
                                'Unknown game',
                            organizer:
                                registration.tournament?.user
                                    ?.name ??
                                'Unknown organizer',
                            status: formatStatus(
                                registration.status
                            ),
                            startDate: formatDate(
                                registration.tournament
                                    ?.start_date
                            ),
                            endDate: formatDate(
                                registration.tournament
                                    ?.end_date
                            ),
                        })
                    )
                );
            } catch (error) {
                console.error(
                    'ERROR /my-registrations:',
                    error.response?.data ||
                    error.message
                );
            }

            try {
                const matchesResponse =
                    await api.get('/my-matches');


                setUpcomingMatches(
                    matchesResponse.data
                        .filter(
                            (match) =>
                                match.status ===
                                'scheduled' ||
                                match.status ===
                                'in_progress'
                        )
                        .map((match) => {
                            const opponent =
                                match.first_player_id ===
                                user.id
                                    ? match.second_player?.name
                                    : match.first_player?.name;

                            return {
                                id: match.id,
                                tournament:
                                    match.tournament?.title ??
                                    'Unknown tournament',
                                round: formatStatus(
                                    match.round
                                ),
                                opponent:
                                    opponent ??
                                    'Unknown player',
                                date: formatDate(
                                    match.scheduled_at
                                ),
                                time: formatTime(
                                    match.scheduled_at
                                ),
                            };
                        })
                );
            } catch (error) {
                console.error(
                    'ERROR /my-matches:',
                    error.response?.data ||
                    error.message
                );
            }

            try {
                const resultsResponse =
                    await api.get('/my-results');


                setLatestResults(
                    resultsResponse.data.map((result) => {
                        const match = result.match;

                        const userIsPlayer1 =
                            match.first_player_id ===
                            user.id;

                        const opponent =
                            userIsPlayer1
                                ? match.second_player?.name
                                : match.first_player?.name;

                        const userScore =
                            userIsPlayer1
                                ? result.score_player1
                                : result.score_player2;

                        const opponentScore =
                            userIsPlayer1
                                ? result.score_player2
                                : result.score_player1;

                        return {
                            id: result.id,
                            tournament:
                                match.tournament?.title ??
                                'Unknown tournament',
                            opponent:
                                opponent ??
                                'Unknown player',
                            score: `${userScore} - ${opponentScore}`,
                            result:
                                result.winner_id === user.id
                                    ? 'Victory'
                                    : 'Defeat',
                        };
                    })
                );
            } catch (error) {
                console.error(
                    'ERROR /my-results:',
                    error.response?.data ||
                    error.message
                );
            }
        };

        loadDashboardData();
    }, [user]);


    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* Profile Header */}
                <section className="rounded-t-2xl border border-white/10 bg-[#171529]">

                    <div className="flex flex-col gap-6 px-8 py-8 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7C3AED]/10 ring-1 ring-[#7C3AED]/30">
                                <UserCircle
                                    size={42}
                                    className="text-[#A78BFA]"
                                />
                            </div>

                            <div>
                                <h1 className="text-3xl font-black">
                                    {user?.user.name || 'Player'}
                                </h1>

                                <p className="mt-1 text-sm text-gray-400">
                                    NextRound player
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:bg-white/5 hover:text-white"
                        >
                            <Settings size={20} />
                        </button>

                    </div>

                    {/* Tabs */}
                    <div className="flex overflow-x-auto border-t border-white/10 px-8">

                        <DashboardTab
                            label="Activity"
                            active={
                                activeTab === 'activity'
                            }
                            onClick={() =>
                                setActiveTab('activity')
                            }
                        />

                        <DashboardTab
                            label="Tournaments"
                            active={
                                activeTab === 'tournaments'
                            }
                            onClick={() =>
                                setActiveTab('tournaments')
                            }
                        />

                        <DashboardTab
                            label="Registrations"
                            active={
                                activeTab ===
                                'registrations'
                            }
                            onClick={() =>
                                setActiveTab(
                                    'registrations'
                                )
                            }
                        />

                    </div>
                </section>

                {/* Tab Content */}
                <section className="rounded-b-2xl border-x border-b border-white/10 bg-[#0F0C17] px-8 py-10">

                    {activeTab === 'activity' && (
                        <ActivityTab
                            upcomingMatches={
                                upcomingMatches
                            }
                            latestResults={
                                latestResults
                            }
                            recentTournaments={
                                recentTournaments
                            }
                        />
                    )}

                    {activeTab === 'tournaments' && (
                        <TournamentsTab
                            myTournaments={myTournaments}
                            onCreateTournament={() =>
                                setShowCreateModal(true)
                            }
                        />
                    )}

                    {activeTab === 'registrations' && (
                        <RegistrationsTab
                            registrations={
                                registrations
                            }
                        />
                    )}

                </section>

            </main>
            {showCreateModal && (
                <CreateTournamentModal
                    onClose={() =>
                        setShowCreateModal(false)
                    }
                    onCreated={() => {
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}


/* =========================
   ACTIVITY TAB
========================= */

function ActivityTab({
                         upcomingMatches,
                         latestResults,
                         recentTournaments,
                     }) {
    return (
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">

            {/* Left */}
            <div>

                <SectionTitle title="Upcoming matches" />

                <div className="mt-6 space-y-4">
                    {upcomingMatches.map((match) => (
                        <MatchRow
                            key={match.id}
                            match={match}
                        />
                    ))}
                </div>

                <div className="mt-12">

                    <SectionTitle title="Latest results" />

                    <div className="mt-6 space-y-4">
                        {latestResults.map((result) => (
                            <ResultRow
                                key={result.id}
                                result={result}
                            />
                        ))}
                    </div>

                </div>
            </div>

            {/* Right */}
            <div>

                <SectionTitle title="Recent tournaments" />

                <div className="mt-6 space-y-4">
                    {recentTournaments.map(
                        (tournament) => (
                            <RecentTournament
                                key={tournament.id}
                                tournament={tournament}
                            />
                        )
                    )}
                </div>

            </div>

        </div>
    );
}


/* =========================
   TOURNAMENTS TAB
========================= */

function TournamentsTab({
                            myTournaments,
                            onCreateTournament,
                        }) {
    return (
        <div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <SectionTitle
                    title="My tournaments"
                    subtitle="Tournaments you organize."
                />

                <button
                    type="button"
                    onClick={onCreateTournament}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-3 text-sm font-semibold transition hover:bg-[#6D28D9]"
                >
                    <Plus size={17} />
                    Create Tournament
                </button>

            </div>

            <div className="mt-6 space-y-4">

                {myTournaments.map((tournament) => (
                    <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                    />
                ))}

            </div>
        </div>
    );
}

function CreateTournamentModal({
                                   onClose,
                                   onCreated,
                               }) {
    const [games, setGames] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        game_id: '',
        description: '',
        start_date: '',
        end_date: '',
        max_players: '',
        status: 'draft',
        prize: '',
    });

    const [loadingGames, setLoadingGames] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] =
        useState({});

    useEffect(() => {
        const loadGames = async () => {
            try {
                const response = await api.get('/games');

                setGames(response.data.games);
            } catch (error) {
                console.error(
                    'ERROR /games:',
                    error.response?.data ||
                    error.message
                );

                setError(
                    'Unable to load games.'
                );
            } finally {
                setLoadingGames(false);
            }
        };

        loadGames();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setValidationErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitting(true);
        setError('');
        setValidationErrors({});

        try {
            await api.post('/tournaments', {
                title: formData.title,
                game_id: formData.game_id,
                description: formData.description,
                start_date: formData.start_date,
                end_date:
                    formData.end_date || null,
                max_players: Number(
                    formData.max_players
                ),
                status: formData.status,
                prize: formData.prize || null,
            });

            onCreated();
            onClose();

        } catch (error) {
            console.error(
                'ERROR /tournaments POST:',
                error.response?.data ||
                error.message
            );

            if (error.response?.status === 422) {
                setValidationErrors(
                    error.response.data.errors || {}
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    'Unable to create tournament.'
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#171529] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-black">
                            Create Tournament
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Create a new tournament on NextRound.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="px-6 py-6"
                >

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">

                        {/* Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Tournament title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Summer Championship"
                                className="w-full rounded-lg border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#7C3AED]"
                            />

                            {validationErrors.title && (
                                <p className="mt-1 text-sm text-red-400">
                                    {validationErrors.title[0]}
                                </p>
                            )}
                        </div>

                        {/* Game */}
                        <div>
                            <label
                                htmlFor="game_id"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Game
                            </label>

                            <div className="relative">
                                <Gamepad2
                                    size={17}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <select
                                    id="game_id"
                                    name="game_id"
                                    value={
                                        formData.game_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loadingGames
                                    }
                                    className="w-full appearance-none rounded-lg border border-white/10 bg-[#111827] px-11 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]"
                                >
                                    <option value="">
                                        {loadingGames
                                            ? 'Loading games...'
                                            : 'Select a game'}
                                    </option>

                                    {games.map(
                                        (game) => (
                                            <option
                                                key={
                                                    game.id
                                                }
                                                value={
                                                    game.id
                                                }
                                            >
                                                {game.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {validationErrors.game_id && (
                                <p className="mt-1 text-sm text-red-400">
                                    {
                                        validationErrors
                                            .game_id[0]
                                    }
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows="4"
                                placeholder="Tournament description"
                                className="w-full resize-none rounded-lg border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#7C3AED]"
                            />

                            {validationErrors.description && (
                                <p className="mt-1 text-sm text-red-400">
                                    {
                                        validationErrors
                                            .description[0]
                                    }
                                </p>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="start_date"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Start date
                                </label>

                                <div className="relative">
                                    <CalendarDays
                                        size={17}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    />

                                    <input
                                        id="start_date"
                                        name="start_date"
                                        type="date"
                                        value={
                                            formData.start_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-white/10 bg-[#111827] px-11 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]"
                                    />
                                </div>

                                {validationErrors.start_date && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {
                                            validationErrors
                                                .start_date[0]
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="end_date"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    End date
                                </label>

                                <div className="relative">
                                    <CalendarDays
                                        size={17}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    />

                                    <input
                                        id="end_date"
                                        name="end_date"
                                        type="date"
                                        value={
                                            formData.end_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-white/10 bg-[#111827] px-11 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]"
                                    />
                                </div>

                                {validationErrors.end_date && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {
                                            validationErrors
                                                .end_date[0]
                                        }
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* Max players + Status */}
                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="max_players"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Maximum players
                                </label>

                                <input
                                    id="max_players"
                                    name="max_players"
                                    type="number"
                                    min="1"
                                    value={
                                        formData.max_players
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="16"
                                    className="w-full rounded-lg border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#7C3AED]"
                                />

                                {validationErrors.max_players && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {
                                            validationErrors
                                                .max_players[0]
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full rounded-lg border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7C3AED]"
                                >
                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="open">
                                        Open
                                    </option>
                                </select>

                                {validationErrors.status && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {
                                            validationErrors
                                                .status[0]
                                        }
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* Prize */}
                        <div>
                            <label
                                htmlFor="prize"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Prize
                            </label>

                            <div className="relative">
                                <Trophy
                                    size={17}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    id="prize"
                                    name="prize"
                                    type="text"
                                    value={formData.prize}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="1000 MAD"
                                    className="w-full rounded-lg border border-white/10 bg-[#111827] px-11 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#7C3AED]"
                                />
                            </div>

                            {validationErrors.prize && (
                                <p className="mt-1 text-sm text-red-400">
                                    {
                                        validationErrors
                                            .prize[0]
                                    }
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? 'Creating...'
                                : 'Create Tournament'}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

/* =========================
   REGISTRATIONS TAB
========================= */

function RegistrationsTab({
                              registrations,
                          }) {
    return (
        <div>

            <SectionTitle
                title="My registrations"
                subtitle="Tournaments you joined."
            />

            <div className="mt-6 space-y-4">

                {registrations.map((registration) => (
                    <RegistrationCard
                        key={registration.id}
                        registration={registration}
                    />
                ))}

            </div>

        </div>
    );
}


/* =========================
   TAB
========================= */

function DashboardTab({
                          label,
                          active,
                          onClick,
                      }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative whitespace-nowrap px-8 py-5 text-sm font-medium transition ${
                active
                    ? 'text-[#A78BFA]'
                    : 'text-gray-400 hover:text-white'
            }`}
        >
            {label}

            {active && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#7C3AED]" />
            )}
        </button>
    );
}


/* =========================
   SECTION TITLE
========================= */

function SectionTitle({
                          title,
                          subtitle,
                      }) {
    return (
        <div>
            <h2 className="text-2xl font-black">
                {title}
            </h2>

            {subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                    {subtitle}
                </p>
            )}
        </div>
    );
}


/* =========================
   MATCH
========================= */

function MatchRow({ match }) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5 transition hover:border-[#7C3AED]/40">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5CF6]">
                        {match.round}
                    </p>

                    <h3 className="mt-2 font-bold">
                        You vs {match.opponent}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        {match.tournament}
                    </p>
                </div>

                <div className="text-sm text-gray-400 sm:text-right">

                    <div className="flex items-center gap-2 sm:justify-end">
                        <CalendarDays size={15} />
                        {match.date}
                    </div>

                    <p className="mt-1 font-semibold text-white">
                        {match.time}
                    </p>

                </div>

            </div>
        </div>
    );
}


/* =========================
   RESULT
========================= */

function ResultRow({ result }) {
    const isVictory =
        result.result === 'Victory';

    return (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111827] p-5">

            <div>
                <p className="font-semibold">
                    {result.tournament}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    vs {result.opponent}
                </p>
            </div>

            <div className="text-right">

                <p className="font-bold">
                    {result.score}
                </p>

                <p
                    className={`mt-1 text-sm font-semibold ${
                        isVictory
                            ? 'text-green-400'
                            : 'text-red-400'
                    }`}
                >
                    {result.result}
                </p>

            </div>
        </div>
    );
}


/* =========================
   RECENT TOURNAMENT
========================= */

function RecentTournament({
                              tournament,
                          }) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5">

            <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7C3AED]/10">
                    <Gamepad2
                        size={19}
                        className="text-[#A78BFA]"
                    />
                </div>

                <div className="min-w-0">

                    <h3 className="truncate font-semibold">
                        {tournament.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        {tournament.game}
                    </p>

                </div>

            </div>

            <span
                className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    tournament.status === 'Open'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-blue-500/10 text-blue-400'
                }`}
            >
                {tournament.status}
            </span>

        </div>
    );
}


/* =========================
   TOURNAMENT CARD
========================= */

function TournamentCard({
                            tournament,
                        }) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#7C3AED]/10">
                        <Trophy
                            size={20}
                            className="text-[#A78BFA]"
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            {tournament.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {tournament.game}
                        </p>
                    </div>

                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm">

                    <span className="flex items-center gap-2 text-gray-400">
                        <Users size={15} />
                        {tournament.players}
                    </span>

                    <span className="flex items-center gap-2 text-gray-400">
                        <CalendarDays size={15} />
                        {tournament.startDate} –{' '}
                        {tournament.endDate}
                    </span>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            tournament.status === 'Open'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-blue-500/10 text-blue-400'
                        }`}
                    >
                        {tournament.status}
                    </span>

                    <button
                        type="button"
                        className="flex items-center gap-1 text-sm font-semibold text-white transition hover:text-[#A78BFA]"
                    >
                        Manage
                        <ChevronRight size={16} />
                    </button>

                </div>

            </div>
        </div>
    );
}


/* =========================
   REGISTRATION CARD
========================= */

function RegistrationCard({
                              registration,
                          }) {
    const statusStyles = {
        Approved:
            'bg-green-500/10 text-green-400',
        Pending:
            'bg-yellow-500/10 text-yellow-400',
        Rejected:
            'bg-red-500/10 text-red-400',
    };

    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#7C3AED]/10">
                        <Gamepad2
                            size={20}
                            className="text-[#A78BFA]"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5CF6]">
                            {registration.game}
                        </p>

                        <h3 className="mt-2 font-bold">
                            {registration.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Organized by{' '}
                            {registration.organizer}
                        </p>
                    </div>

                </div>

                <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[
                            registration.status
                            ]
                    }`}
                >
                    {registration.status}
                </span>

            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500">

                <div className="flex items-center gap-2">
                    <CalendarDays size={15} />
                    {registration.startDate} –{' '}
                    {registration.endDate}
                </div>

            </div>

            <div className="mt-5 flex gap-3">

                <button
                    type="button"
                    className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium transition hover:bg-white/5"
                >
                    View tournament
                </button>

                {registration.status === 'Approved' && (
                    <button
                        type="button"
                        className="rounded-lg border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                    >
                        Cancel
                    </button>
                )}

            </div>

        </div>
    );
}


/* =========================
   FORMAT HELPERS
========================= */

function formatDate(date) {
    if (!date) {
        return '';
    }

    const parsedDate = new Date(date);

    return parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
    });
}

function formatTime(date) {
    if (!date) {
        return '';
    }

    const parsedDate = new Date(date);

    return parsedDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

function formatStatus(status) {
    if (!status) {
        return '';
    }

    return status
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}


export default UserDashboard;