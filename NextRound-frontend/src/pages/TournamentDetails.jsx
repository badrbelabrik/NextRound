import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, Gamepad2, Trophy, Users, Clock, CheckCircle, CircleAlert} from 'lucide-react';

import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function formatDate(date) {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatTime(date) {
    if (!date) return '—';

    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatStatus(status) {
    if (!status) return 'Unknown';

    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRoundOrder(round) {
    const value = String(round).toLowerCase();

    if (value.includes('quarter')) return 1;
    if (value.includes('semi')) return 2;
    if (value === 'final' || value.includes('final')) return 3;

    const numericRound = parseInt(value, 10);

    if (!Number.isNaN(numericRound)) {
        return numericRound;
    }

    return 99;
}

function TournamentDetails() {
    const [registrations, setRegistrations] = useState([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);
    const [updatingRegistration, setUpdatingRegistration] = useState(null);
    const { id } = useParams();
    const { user } = useAuth();

    const [tournament, setTournament] = useState(null);
    const [startingTournament, setStartingTournament] = useState(false);
    const [matches, setMatches] = useState([]);
    const [myRegistration, setMyRegistration] = useState(null);

    const [activeSection, setActiveSection] = useState('overview');

    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [savingResult, setSavingResult] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [scoreMatch, setScoreMatch] = useState(null);

    const [scoreForm, setScoreForm] = useState({
        score_player1: '',
        score_player2: '',
    });

    const handleStartTournament = async () => {
    const confirmed = window.confirm(
        'Are you sure you want to start this tournament? The bracket will be generated from the approved players.'
    );

    if (!confirmed) {
        return;
    }

    try {
        setStartingTournament(true);
        setMessage('');
        setError('');

        const response = await api.post(
            `/tournaments/${id}/start`
        );

        if (response.data.tournament) {
            setTournament(
                response.data.tournament
            );
        }

        if (response.data.matches) {
            setMatches(response.data.matches);
        } else {
            await loadMatches();
        }

        setMessage(
            response.data.message ||
                'Tournament started successfully.'
        );

        setActiveSection('brackets');
    } catch (error) {
        console.error(
            'Error starting tournament:',
            error.response?.data ||
                error.message
        );

        setError(
            error.response?.data?.message ||
                'Unable to start the tournament.'
        );
    } finally {
        setStartingTournament(false);
    }
};

    const loadRegistrations = async () => {
        if (!user || !tournament) {
            setRegistrations([]);
            return;
        }

        const isCurrentUserOrganizer =
            Number(user.id) === Number(tournament.user_id);

        if (!isCurrentUserOrganizer) {
            setRegistrations([]);
            return;
        }

        try {
            setLoadingRegistrations(true);

            const response = await api.get(
                `/tournaments/${id}/registrations`
            );

            const registrationsData =
                response.data.registrations ??
                response.data ??
                [];

            setRegistrations(registrationsData);
        } catch (error) {
            console.error(
                'Error loading registrations:',
                error.response?.data || error.message
            );

            setRegistrations([]);
        } finally {
            setLoadingRegistrations(false);
        }
    };
    const loadMatches = async () => {
        const [matchesResponse, resultsResponse] =
            await Promise.all([
                api.get('/matches'),
                api.get('/results'),
            ]);

        const matchesData =
            matchesResponse.data.matches ?? [];

        const resultsData =
            resultsResponse.data.results ??
            resultsResponse.data ??
            [];

        const tournamentMatches = matchesData
            .filter(
                (match) =>
                    Number(match.tournament_id) === Number(id)
            )
            .map((match) => {
                const result = resultsData.find(
                    (item) =>
                        Number(item.match_id) ===
                        Number(match.id)
                );

                return {
                    ...match,
                    result:
                        result ??
                        match.result ??
                        null,
                };
            });

        setMatches(tournamentMatches);

        return tournamentMatches;
    };

    const loadTournament = async () => {
        const tournamentResponse = await api.get(
            `/tournaments/${id}`
        );

        const tournamentData =
            tournamentResponse.data.tournament ??
            tournamentResponse.data;

        setTournament(tournamentData);

        return tournamentData;
    };

    const loadRegistration = async () => {
        if (!user) {
            setMyRegistration(null);
            return;
        }

        try {
            const registrationsResponse =
                await api.get('/my-registrations');

            const registrations =
                registrationsResponse.data ?? [];

            const registration = registrations.find(
                (item) =>
                    Number(item.tournament_id) ===
                    Number(id)
            );

            setMyRegistration(registration ?? null);
        } catch (error) {
            console.error(
                'Error loading registration:',
                error.response?.data || error.message
            );

            setMyRegistration(null);
        }
    };

    useEffect(() => {
        const loadPage = async () => {
            try {
                setLoading(true);
                setError('');
                setMessage('');

                const tournamentData =
                    await loadTournament();

                await loadMatches();
                await loadRegistration();

                if (
                    user &&
                    Number(user.id) ===
                    Number(tournamentData.user_id)
                ) {
                    await loadRegistrations();
                }
            } catch (error) {
                console.error(
                    'Error loading tournament:',
                    error.response?.data ||
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                    'Unable to load this tournament.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [id, user]);
    const handleRegistrationStatus = async (
        registrationId,
        status
    ) => {
        try {
            setUpdatingRegistration(registrationId);
            setMessage('');

            const response = await api.put(
                `/registrations/${registrationId}`,
                {
                    status,
                }
            );

            const updatedRegistration =
                response.data.registration ??
                response.data;

            setRegistrations((previous) =>
                previous.map((registration) =>
                    Number(registration.id) ===
                    Number(registrationId)
                        ? updatedRegistration
                        : registration
                )
            );

            setMessage(
                status === 'approved'
                    ? 'Registration approved successfully.'
                    : 'Registration rejected successfully.'
            );
        } catch (error) {
            console.error(
                'Error updating registration:',
                error.response?.data ||
                error.message
            );

            setMessage(
                error.response?.data?.message ||
                'Unable to update registration.'
            );
        } finally {
            setUpdatingRegistration(null);
        }
    };
    const isOrganizer =
        user &&
        tournament &&
        Number(user.id) === Number(tournament.user_id);

    const canRegister =
        user &&
        !isOrganizer &&
        tournament?.status === 'open' &&
        !myRegistration;

    const canCancel =
        user &&
        myRegistration &&
        myRegistration.status === 'pending';

    const handleRegister = async () => {
        try {
            setRegistering(true);
            setMessage('');

            const response = await api.post(
                `/tournaments/${id}/register`
            );

            setMyRegistration(
                response.data.registration ??
                response.data
            );

            setMessage(
                'You have successfully registered for this tournament.'
            );
        } catch (error) {
            console.error(
                'Registration error:',
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                'Unable to register for this tournament.'
            );
        } finally {
            setRegistering(false);
        }
    };

    const handleCancelRegistration = async () => {
        try {
            setRegistering(true);
            setMessage('');

            await api.delete(
                `/tournaments/${id}/register`
            );

            setMyRegistration(null);

            setMessage(
                'Your registration has been cancelled.'
            );
        } catch (error) {
            console.error(
                'Cancel registration error:',
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                'Unable to cancel your registration.'
            );
        } finally {
            setRegistering(false);
        }
    };

    const openScoreModal = (match) => {
        setScoreMatch(match);

        setScoreForm({
            score_player1: '',
            score_player2: '',
        });

        setMessage('');
    };

    const closeScoreModal = () => {
        setScoreMatch(null);

        setScoreForm({
            score_player1: '',
            score_player2: '',
        });
    };

    const handleScoreSubmit = async (event) => {
        event.preventDefault();

        if (!scoreMatch) {
            return;
        }

        if (
            scoreForm.score_player1 === '' ||
            scoreForm.score_player2 === ''
        ) {
            setMessage('Please enter both scores.');
            return;
        }

        const score1 = Number(
            scoreForm.score_player1
        );

        const score2 = Number(
            scoreForm.score_player2
        );

        if (
            !Number.isInteger(score1) ||
            !Number.isInteger(score2)
        ) {
            setMessage('Scores must be whole numbers.');
            return;
        }

        if (score1 < 0 || score2 < 0) {
            setMessage('Scores cannot be negative.');
            return;
        }

        if (score1 === score2) {
            setMessage('A match cannot end in a draw.');
            return;
        }

        const winnerId =
            score1 > score2
                ? scoreMatch.first_player_id
                : scoreMatch.second_player_id;

        if (!winnerId) {
            setMessage(
                'Both players must be available before entering a result.'
            );
            return;
        }

        try {
            setSavingResult(true);
            setMessage('');

            await api.post('/results', {
                match_id: scoreMatch.id,
                score_player1: score1,
                score_player2: score2,
                winner_id: winnerId,
            });

            closeScoreModal();

            await loadMatches();
            await loadTournament();

            setMessage(
                'Match result saved successfully.'
            );

            setActiveSection('matches');
        } catch (error) {
            console.error(
                'Error saving result:',
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                'Unable to save the match result.'
            );
        } finally {
            setSavingResult(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white">
                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center text-gray-400">
                    Loading tournament...
                </div>
            </div>
        );
    }

    if (error || !tournament) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white">
                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center text-red-400">
                    {error || 'Tournament not found.'}
                </div>
            </div>
        );
    }

    const bracketRounds = [
        ...new Set(
            matches.map((match) => match.round)
        ),
    ].sort(
        (a, b) =>
            getRoundOrder(a) -
            getRoundOrder(b)
    );

    const approvedPlayers =
        tournament.approved_registrations_count ?? null;

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* ===================================== */}
                {/* TOURNAMENT HEADER */}
                {/* ===================================== */}

                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">

                    <div className="relative h-72 bg-gradient-to-r from-purple-900/40 to-blue-900/30">

                        {tournament.game?.image ? (
                            <img
                                src={tournament.game.image}
                                alt={tournament.game.name}
                                className="h-full w-full object-cover opacity-40"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Gamepad2
                                    size={80}
                                    className="text-purple-400 opacity-40"
                                />
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/50" />

                        <div className="absolute bottom-0 left-0 right-0 p-8">

                            <div className="mb-3 flex flex-wrap items-center gap-3">

                                <span className="rounded-full bg-purple-600/90 px-4 py-1 text-sm font-medium">
                                    {formatStatus(
                                        tournament.status
                                    )}
                                </span>

                                <span className="text-gray-300">
                                    {tournament.game?.name ||
                                        'Unknown game'}
                                </span>

                            </div>

                            <h1 className="text-4xl font-bold">
                                {tournament.title}
                            </h1>

                            <p className="mt-2 text-gray-300">
                                Organized by{' '}
                                <span className="font-medium text-white">
                                    {tournament.user?.name ||
                                        'Unknown organizer'}
                                </span>
                            </p>

                        </div>
                    </div>

                    {/* Tournament information */}
                    <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-4">

                        <div className="flex items-center gap-4">
                            <CalendarDays
                                className="text-purple-400"
                                size={24}
                            />

                            <div>
                                <p className="text-sm text-gray-400">
                                    Start date
                                </p>

                                <p className="font-medium">
                                    {formatDate(
                                        tournament.start_date
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <CalendarDays
                                className="text-blue-400"
                                size={24}
                            />

                            <div>
                                <p className="text-sm text-gray-400">
                                    End date
                                </p>

                                <p className="font-medium">
                                    {formatDate(
                                        tournament.end_date
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Users
                                className="text-purple-400"
                                size={24}
                            />

                            <div>
                                <p className="text-sm text-gray-400">
                                    Players
                                </p>

                                <p className="font-medium">
                                    {approvedPlayers !== null
                                        ? `${approvedPlayers} / ${tournament.max_players}`
                                        : `${tournament.max_players} max`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Trophy
                                className="text-yellow-400"
                                size={24}
                            />

                            <div>
                                <p className="text-sm text-gray-400">
                                    Prize
                                </p>

                                <p className="font-medium">
                                    {tournament.prize ||
                                        'No prize'}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ===================================== */}
                {/* SECTION NAVIGATION */}
                {/* ===================================== */}

                <div className="mt-8 border-b border-white/10">
                    <div className="flex gap-8 overflow-x-auto">

                        <button
                            onClick={() =>
                                setActiveSection(
                                    'overview'
                                )
                            }
                            className={`border-b-2 px-2 pb-4 text-sm font-medium transition ${
                                activeSection === 'overview'
                                    ? 'border-purple-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            Overview
                        </button>

                        <button
                            onClick={() =>
                                setActiveSection(
                                    'brackets'
                                )
                            }
                            className={`border-b-2 px-2 pb-4 text-sm font-medium transition ${
                                activeSection === 'brackets'
                                    ? 'border-purple-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            Brackets
                        </button>

                        <button
                            onClick={() =>
                                setActiveSection(
                                    'matches'
                                )
                            }
                            className={`border-b-2 px-2 pb-4 text-sm font-medium transition ${
                                activeSection === 'matches'
                                    ? 'border-purple-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            Matches
                        </button>
                        {isOrganizer && <button
                            onClick={() =>
                                setActiveSection(
                                    'registrations'
                                )
                            }
                            className={`border-b-2 px-2 pb-4 text-sm font-medium transition ${
                                activeSection === 'registrations'
                                    ? 'border-purple-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            Registrations
                        </button>}

                    </div>
                </div>

                {/* ===================================== */}
                {/* OVERVIEW */}
                {/* ===================================== */}

                {activeSection === 'overview' && (
                    <section className="mt-8 grid gap-8 lg:grid-cols-3">
                         {isOrganizer &&
            tournament.status === 'open' &&
            matches.length === 0 && (
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-xl font-bold">
                                Ready to start?
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                Start the tournament to generate
                                the bracket and first-round matches
                                from the approved players.
                            </p>
                        </div>

                        <button
                            onClick={
                                handleStartTournament
                            }
                            disabled={
                                startingTournament
                            }
                            className="rounded-xl bg-[#7C3AED] px-6 py-3 font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {startingTournament
                                ? 'Starting...'
                                : 'Start Tournament'}
                        </button>

                    </div>

                </div>
            )}
                        {/* Description */}
                        <div className="lg:col-span-2">

                            <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">

                                <h2 className="text-2xl font-bold">
                                    About this tournament
                                </h2>

                                <p className="mt-4 leading-7 text-gray-400">
                                    {tournament.description ||
                                        'No description provided for this tournament.'}
                                </p>

                            </div>

                        </div>

                        {/* Registration */}
                        <div>

                            <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">

                                <h2 className="text-xl font-bold">
                                    Registration
                                </h2>

                                <p className="mt-2 text-sm text-gray-400">
                                    Join this tournament and compete
                                    against other players.
                                </p>

                                <div className="mt-6">

                                    {canRegister && (
                                        <button
                                            onClick={
                                                handleRegister
                                            }
                                            disabled={
                                                registering
                                            }
                                            className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {registering
                                                ? 'Registering...'
                                                : 'Register'}
                                        </button>
                                    )}

                                    {myRegistration && (
                                        <div className="space-y-3">

                                            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">

                                                {myRegistration.status ===
                                                'approved' ? (
                                                    <CheckCircle
                                                        className="text-green-400"
                                                        size={22}
                                                    />
                                                ) : (
                                                    <Clock
                                                        className="text-yellow-400"
                                                        size={22}
                                                    />
                                                )}

                                                <div>
                                                    <p className="font-medium">
                                                        Registration{' '}
                                                        {formatStatus(
                                                            myRegistration.status
                                                        )}
                                                    </p>

                                                    <p className="text-sm text-gray-400">
                                                        Your registration
                                                        status
                                                    </p>
                                                </div>

                                            </div>

                                            {canCancel && (
                                                <button
                                                    onClick={
                                                        handleCancelRegistration
                                                    }
                                                    disabled={
                                                        registering
                                                    }
                                                    className="w-full rounded-xl border border-red-500/30 px-5 py-3 font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                                                >
                                                    {registering
                                                        ? 'Cancelling...'
                                                        : 'Cancel registration'}
                                                </button>
                                            )}

                                        </div>
                                    )}

                                    {isOrganizer && (
                                        <div className="rounded-xl bg-purple-500/10 p-4 text-center text-sm text-purple-300">
                                            You are the organizer of
                                            this tournament.
                                        </div>
                                    )}

                                    {!user && (
                                        <div className="rounded-xl bg-white/5 p-4 text-center text-sm text-gray-400">
                                            Login to register for this
                                            tournament.
                                        </div>
                                    )}

                                    {user &&
                                        !isOrganizer &&
                                        tournament.status !==
                                        'open' &&
                                        !myRegistration && (
                                            <div className="rounded-xl bg-white/5 p-4 text-center text-sm text-gray-400">
                                                Registration is not
                                                available for this
                                                tournament.
                                            </div>
                                        )}

                                </div>

                            </div>

                        </div>

                    </section>
                )}

                {/* ===================================== */}
                {/* BRACKETS */}
                {/* ===================================== */}

                {activeSection === 'brackets' && (
                    <section className="mt-8 rounded-2xl border border-white/10 bg-[#111827] p-6">

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">
                                Tournament Bracket
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                Follow the tournament progression
                                from round to round.
                            </p>
                        </div>

                        {matches.length === 0 ? (
                            <div className="py-16 text-center text-gray-400">
                                The bracket is not available yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto pb-6">

                                <div className="flex min-w-max gap-8">

                                    {bracketRounds.map(
                                        (round) => {
                                            const roundMatches =
                                                matches.filter(
                                                    (match) =>
                                                        match.round ===
                                                        round
                                                );

                                            return (
                                                <div
                                                    key={round}
                                                    className="w-72 flex-shrink-0"
                                                >

                                                    <h3 className="mb-6 text-center text-lg font-semibold">
                                                        {round}
                                                    </h3>

                                                    <div className="space-y-8">

                                                        {roundMatches.map(
                                                            (
                                                                match
                                                            ) => {
                                                                const result =
                                                                    match.result;

                                                                const player1Won =
                                                                    result &&
                                                                    Number(
                                                                        result.winner_id
                                                                    ) ===
                                                                    Number(
                                                                        match.first_player_id
                                                                    );

                                                                const player2Won =
                                                                    result &&
                                                                    Number(
                                                                        result.winner_id
                                                                    ) ===
                                                                    Number(
                                                                        match.second_player_id
                                                                    );

                                                                return (
                                                                    <div
                                                                        key={
                                                                            match.id
                                                                        }
                                                                        className="rounded-xl border border-white/10 bg-[#0B0F19] p-4"
                                                                    >

                                                                        <div className="mb-4 flex items-center justify-between">

                                                                            <span className="text-xs text-gray-500">
                                                                                Match #
                                                                                {
                                                                                    match.id
                                                                                }
                                                                            </span>

                                                                            <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-gray-400">
                                                                                {formatStatus(
                                                                                    match.status
                                                                                )}
                                                                            </span>

                                                                        </div>

                                                                        {/* Player 1 */}
                                                                        <div
                                                                            className={`flex items-center justify-between rounded-lg px-3 py-3 ${
                                                                                player1Won
                                                                                    ? 'bg-purple-600/20'
                                                                                    : 'bg-white/5'
                                                                            }`}
                                                                        >
                                                                            <span
                                                                                className={`font-medium ${
                                                                                    player1Won
                                                                                        ? 'text-purple-300'
                                                                                        : 'text-white'
                                                                                }`}
                                                                            >
                                                                                {match.first_player?.name ||
                                                                                    'TBD'}
                                                                            </span>

                                                                            <span className="font-bold">
                                                                                {result
                                                                                    ? result.score_player1
                                                                                    : '-'}
                                                                            </span>
                                                                        </div>

                                                                        <div className="my-2 text-center text-xs text-gray-600">
                                                                            VS
                                                                        </div>

                                                                        {/* Player 2 */}
                                                                        <div
                                                                            className={`flex items-center justify-between rounded-lg px-3 py-3 ${
                                                                                player2Won
                                                                                    ? 'bg-purple-600/20'
                                                                                    : 'bg-white/5'
                                                                            }`}
                                                                        >
                                                                            <span
                                                                                className={`font-medium ${
                                                                                    player2Won
                                                                                        ? 'text-purple-300'
                                                                                        : 'text-white'
                                                                                }`}
                                                                            >
                                                                                {match.second_player?.name ||
                                                                                    'TBD'}
                                                                            </span>

                                                                            <span className="font-bold">
                                                                                {result
                                                                                    ? result.score_player2
                                                                                    : '-'}
                                                                            </span>
                                                                        </div>

                                                                    </div>
                                                                );
                                                            }
                                                        )}

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            </div>
                        )}

                    </section>
                )}

                {/* ===================================== */}
                {/* MATCHES */}
                {/* ===================================== */}

                {activeSection === 'matches' && (
                    <section className="mt-8 rounded-2xl border border-white/10 bg-[#111827] p-6">

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">
                                Matches
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                View all matches and manage match
                                results.
                            </p>
                        </div>

                        {message && (
                            <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
                                {message}
                            </div>
                        )}

                        {matches.length === 0 ? (
                            <div className="py-16 text-center text-gray-400">
                                No matches available yet.
                            </div>
                        ) : (
                            <div className="space-y-5">

                                {matches.map((match) => {
                                    const result =
                                        match.result;

                                    const player1Won =
                                        result &&
                                        Number(
                                            result.winner_id
                                        ) ===
                                        Number(
                                            match.first_player_id
                                        );

                                    const player2Won =
                                        result &&
                                        Number(
                                            result.winner_id
                                        ) ===
                                        Number(
                                            match.second_player_id
                                        );

                                    const canEnterResult =
                                        isOrganizer &&
                                        !result &&
                                        match.status !==
                                        'cancelled' &&
                                        match.first_player_id &&
                                        match.second_player_id;

                                    return (
                                        <div
                                            key={match.id}
                                            className="rounded-xl border border-white/10 bg-[#0B0F19] p-5"
                                        >

                                            {/* Match header */}
                                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                                <div>
                                                    <p className="text-lg font-semibold">
                                                        {match.round}
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                                        <CalendarDays
                                                            size={15}
                                                        />

                                                        <span>
                                                            {formatDate(
                                                                match.scheduled_at
                                                            )}
                                                        </span>

                                                        {match.scheduled_at && (
                                                            <>
                                                                <span>
                                                                    ·
                                                                </span>

                                                                <Clock
                                                                    size={15}
                                                                />

                                                                <span>
                                                                    {formatTime(
                                                                        match.scheduled_at
                                                                    )}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <span
                                                    className={`w-fit rounded-full px-3 py-1 text-xs ${
                                                        match.status ===
                                                        'finished'
                                                            ? 'bg-green-500/10 text-green-400'
                                                            : match.status ===
                                                            'cancelled'
                                                                ? 'bg-red-500/10 text-red-400'
                                                                : 'bg-white/5 text-gray-400'
                                                    }`}
                                                >
                                                    {formatStatus(
                                                        match.status
                                                    )}
                                                </span>

                                            </div>

                                            {/* Players */}
                                            <div className="grid items-center gap-4 md:grid-cols-3">

                                                {/* Player 1 */}
                                                <div
                                                    className={`rounded-xl border p-4 ${
                                                        player1Won
                                                            ? 'border-purple-500/40 bg-purple-600/10'
                                                            : 'border-white/10 bg-white/5'
                                                    }`}
                                                >

                                                    <div className="flex items-center justify-between gap-4">

                                                        <span className="font-medium">
                                                            {match.first_player?.name ||
                                                                'TBD'}
                                                        </span>

                                                        <span
                                                            className={`text-2xl font-bold ${
                                                                player1Won
                                                                    ? 'text-purple-300'
                                                                    : 'text-white'
                                                            }`}
                                                        >
                                                            {result
                                                                ? result.score_player1
                                                                : '-'}
                                                        </span>

                                                    </div>

                                                    {player1Won && (
                                                        <p className="mt-2 text-xs text-purple-300">
                                                            Winner
                                                        </p>
                                                    )}

                                                </div>

                                                {/* VS */}
                                                <div className="text-center">

                                                    <span className="text-sm font-semibold text-gray-600">
                                                        VS
                                                    </span>

                                                </div>

                                                {/* Player 2 */}
                                                <div
                                                    className={`rounded-xl border p-4 ${
                                                        player2Won
                                                            ? 'border-purple-500/40 bg-purple-600/10'
                                                            : 'border-white/10 bg-white/5'
                                                    }`}
                                                >

                                                    <div className="flex items-center justify-between gap-4">

                                                        <span className="font-medium">
                                                            {match.second_player?.name ||
                                                                'TBD'}
                                                        </span>

                                                        <span
                                                            className={`text-2xl font-bold ${
                                                                player2Won
                                                                    ? 'text-purple-300'
                                                                    : 'text-white'
                                                            }`}
                                                        >
                                                            {result
                                                                ? result.score_player2
                                                                : '-'}
                                                        </span>

                                                    </div>

                                                    {player2Won && (
                                                        <p className="mt-2 text-xs text-purple-300">
                                                            Winner
                                                        </p>
                                                    )}

                                                </div>

                                            </div>

                                            {/* Organizer result action */}
                                            {canEnterResult && (
                                                <div className="mt-5 border-t border-white/10 pt-5">

                                                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                                                        <CircleAlert
                                                            size={16}
                                                        />

                                                        <span>
                                                            You are the
                                                            tournament
                                                            organizer.
                                                            Enter the final
                                                            score for this
                                                            match.
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            openScoreModal(
                                                                match
                                                            )
                                                        }
                                                        className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500"
                                                    >
                                                        Enter match result
                                                    </button>

                                                </div>
                                            )}

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </section>
                )}
                {/* ===================================== */}
                {/* REGISTRATIONS */}
                {/* ===================================== */}
                {isOrganizer && (
                    <section className="mt-8 lg:col-span-3">
                        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">

                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Registration Requests
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-400">
                                        Manage players who want to join your
                                        tournament.
                                    </p>
                                </div>

                                <span className="w-fit rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">
                    {registrations.length} registrations
                </span>
                            </div>

                            {loadingRegistrations ? (
                                <div className="py-10 text-center text-gray-400">
                                    Loading registration requests...
                                </div>
                            ) : registrations.length === 0 ? (
                                <div className="rounded-xl border border-white/10 bg-[#0B0F19] py-10 text-center text-gray-400">
                                    No registration requests yet.
                                </div>
                            ) : (
                                <div className="space-y-4">

                                    {registrations.map((registration) => {
                                        const isUpdating =
                                            Number(updatingRegistration) ===
                                            Number(registration.id);

                                        return (
                                            <div
                                                key={registration.id}
                                                className="flex flex-col gap-5 rounded-xl border border-white/10 bg-[#0B0F19] p-5 md:flex-row md:items-center md:justify-between"
                                            >

                                                {/* Player information */}
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {registration.user?.name ||
                                                            'Unknown player'}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {registration.user?.email ||
                                                            'No email available'}
                                                    </p>

                                                    <p className="mt-2 text-xs text-gray-600">
                                                        Registered on{' '}
                                                        {formatDate(
                                                            registration.registration_date
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Status and actions */}
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                                    <span
                                        className={`w-fit rounded-full px-3 py-1 text-xs ${
                                            registration.status ===
                                            'approved'
                                                ? 'bg-green-500/10 text-green-400'
                                                : registration.status ===
                                                'rejected'
                                                    ? 'bg-red-500/10 text-red-400'
                                                    : registration.status ===
                                                    'cancelled'
                                                        ? 'bg-gray-500/10 text-gray-400'
                                                        : 'bg-yellow-500/10 text-yellow-400'
                                        }`}
                                    >
                                        {formatStatus(
                                            registration.status
                                        )}
                                    </span>

                                                    {registration.status ===
                                                        'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleRegistrationStatus(
                                                                            registration.id,
                                                                            'approved'
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isUpdating
                                                                    }
                                                                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {isUpdating
                                                                        ? 'Updating...'
                                                                        : 'Approve'}
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleRegistrationStatus(
                                                                            registration.id,
                                                                            'rejected'
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isUpdating
                                                                    }
                                                                    className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}

                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </div>
                    </section>
                )}
            </main>

            {/* ===================================== */}
            {/* SCORE MODAL */}
            {/* ===================================== */}

            {scoreMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">

                        <div className="mb-6">

                            <h2 className="text-xl font-bold">
                                Enter Match Result
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                {scoreMatch.first_player?.name ||
                                    'Player 1'}{' '}
                                vs{' '}
                                {scoreMatch.second_player?.name ||
                                    'Player 2'}
                            </p>

                        </div>

                        <form
                            onSubmit={
                                handleScoreSubmit
                            }
                            className="space-y-6"
                        >

                            {/* Scores */}
                            <div className="grid grid-cols-2 gap-4">

                                <div>

                                    <label className="mb-2 block text-sm text-gray-400">
                                        {scoreMatch.first_player?.name ||
                                            'Player 1'}
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={
                                            scoreForm.score_player1
                                        }
                                        onChange={(event) =>
                                            setScoreForm(
                                                (previous) => ({
                                                    ...previous,
                                                    score_player1:
                                                    event
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-center text-xl font-bold text-white outline-none focus:border-purple-500"
                                        placeholder="0"
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm text-gray-400">
                                        {scoreMatch.second_player?.name ||
                                            'Player 2'}
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={
                                            scoreForm.score_player2
                                        }
                                        onChange={(event) =>
                                            setScoreForm(
                                                (previous) => ({
                                                    ...previous,
                                                    score_player2:
                                                    event
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-center text-xl font-bold text-white outline-none focus:border-purple-500"
                                        placeholder="0"
                                    />

                                </div>

                            </div>

                            <p className="text-center text-xs text-gray-500">
                                The player with the higher score will
                                automatically be selected as the winner.
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={
                                        closeScoreModal
                                    }
                                    disabled={
                                        savingResult
                                    }
                                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        savingResult
                                    }
                                    className="flex-1 rounded-xl bg-purple-600 px-4 py-3 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {savingResult
                                        ? 'Saving...'
                                        : 'Save result'}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}

export default TournamentDetails;