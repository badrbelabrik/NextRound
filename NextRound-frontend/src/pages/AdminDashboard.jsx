import { useEffect, useState } from 'react';
import {
    Gamepad2,
    Users,
    Plus,
    Pencil,
    Trash2,
    X,
    Trophy,
} from 'lucide-react';

import Navbar from '../components/Navbar';
import api from '../services/api';
import imageHelper from '../services/imageHelper.js'

function AdminDashboard() {
    const [activeSection, setActiveSection] =
        useState('games');

    const [games, setGames] = useState([]);
    const [users, setUsers] = useState([]);
    const [tournaments, setTournaments] = useState([]);

    const [loadingTournaments, setLoadingTournaments] =
        useState(false);
    const [approvingTournament, setApprovingTournament] =
        useState(null);
    const [loadingGames, setLoadingGames] =
        useState(true);
    const [loadingUsers, setLoadingUsers] =
        useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [showGameModal, setShowGameModal] =
        useState(false);

    const [editingGame, setEditingGame] =
        useState(null);

    const [savingGame, setSavingGame] =
        useState(false);

    const [gameForm, setGameForm] = useState({
        name: '',
        description: '',
        image: null,
    });

    const [updatingUser, setUpdatingUser] =
        useState(null);

    const [deletingUser, setDeletingUser] =
        useState(null);

    const loadGames = async () => {
        try {
            setLoadingGames(true);

            const response =
                await api.get('/games');

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

            setError(
                'Unable to load games.'
            );
        } finally {
            setLoadingGames(false);
        }
    };

    const loadUsers = async () => {
        try {
            setLoadingUsers(true);

            const response =
                await api.get('/admin/users');

            const usersData =
                response.data.users ??
                response.data ??
                [];

            setUsers(usersData);
        } catch (error) {
            console.error(
                'Error loading users:',
                error.response?.data ||
                    error.message
            );

            setError(
                'Unable to load users.'
            );
        } finally {
            setLoadingUsers(false);
        }
    };

    const loadTournaments = async () => {
        try {
            setLoadingTournaments(true);
            setError('');

            const response = await api.get(
                '/tournaments'
            );

            const tournamentsData =
                response.data.tournaments ??
                response.data ??
                [];

            setTournaments(tournamentsData);
        } catch (error) {
            console.error(
                'Error loading tournaments:',
                error.response?.data ||
                error.message
            );

            setError(
                'Unable to load tournaments.'
            );
        } finally {
            setLoadingTournaments(false);
        }
    };

    useEffect(() => {
        loadGames();
    }, []);

    useEffect(() => {
        if (activeSection === 'users') {
            loadUsers();
        }
        if (activeSection === 'tournaments') {
            loadTournaments();
        }
    }, [activeSection]);

    const openCreateGameModal = () => {
        setEditingGame(null);

        setGameForm({
            name: '',
            description: '',
            image: '',
        });

        setMessage('');
        setShowGameModal(true);
    };

    const openEditGameModal = (game) => {
        setEditingGame(game);

        setGameForm({
            name: game.name || '',
            description: game.description || '',
            image: null,
        });

        setShowGameModal(true);
    };

    const closeGameModal = () => {
        if (savingGame) {
            return;
        }

        setShowGameModal(false);
        setEditingGame(null);

        setGameForm({
            name: '',
            description: '',
            image: '',
        });
    };

    const handleGameSubmit = async (event) => {
        event.preventDefault();

        try {
            setSavingGame(true);
            setError('');

            const formData = new FormData();

            formData.append('name', gameForm.name);
            formData.append(
                'description',
                gameForm.description || ''
            );

            if (gameForm.image instanceof File) {
                formData.append('image', gameForm.image);
            }

            if (editingGame) {
                formData.append('_method', 'PUT');

                await api.post(
                    `/games/${editingGame.id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } else {
                await api.post('/games', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            await loadGames();
            closeGameModal();
        } catch (error) {
            console.error(
                'Error saving game:',
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                'Unable to save game.'
            );
        } finally {
            setSavingGame(false);
        }
    };

    const handleDeleteGame = async (gameId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this game?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/games/${gameId}`
            );

            setGames((previous) =>
                previous.filter(
                    (game) =>
                        game.id !== gameId
                )
            );

            setMessage(
                'Game deleted successfully.'
            );
        } catch (error) {
            console.error(
                'Error deleting game:',
                error.response?.data ||
                    error.message
            );

            setError(
                error.response?.data?.message ||
                    'Unable to delete game.'
            );
        }
    };

    const handleUserRoleChange = async (
        userId,
        role
    ) => {
        try {
            setUpdatingUser(userId);
            setError('');
            setMessage('');

            const response = await api.put(
                `/admin/users/${userId}`,
                { role }
            );

            const updatedUser =
                response.data.user ??
                response.data;

            setUsers((previous) =>
                previous.map((user) =>
                    user.id === userId
                        ? updatedUser
                        : user
                )
            );

            setMessage(
                'User role updated successfully.'
            );
        } catch (error) {
            console.error(
                'Error updating user:',
                error.response?.data ||
                    error.message
            );

            setError(
                error.response?.data?.message ||
                    'Unable to update user.'
            );
        } finally {
            setUpdatingUser(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this user?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingUser(userId);
            setError('');
            setMessage('');

            await api.delete(
                `/admin/users/${userId}`
            );

            setUsers((previous) =>
                previous.filter(
                    (user) =>
                        user.id !== userId
                )
            );

            setMessage(
                'User deleted successfully.'
            );
        } catch (error) {
            console.error(
                'Error deleting user:',
                error.response?.data ||
                    error.message
            );

            setError(
                error.response?.data?.message ||
                    'Unable to delete user.'
            );
        } finally {
            setDeletingUser(null);
        }
    };

    const handleApproveTournament = async (tournamentId) => {
        try {
            setApprovingTournament(tournamentId);
            setError('');
            setMessage('');

            await api.put(
                `/admin/tournaments/${tournamentId}/approve`
            );

            setTournaments((previous) =>
                previous.filter(
                    (tournament) =>
                        tournament.id !== tournamentId
                )
            );

            setMessage(
                'Tournament approved successfully.'
            );
        } catch (error) {
            console.error(
                'Error approving tournament:',
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                'Unable to approve tournament.'
            );
        } finally {
            setApprovingTournament(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-gray-400">
                        Manage games and users on NextRound.
                    </p>
                </div>

                {/* Section navigation */}
                <div className="mb-8 border-b border-white/10">
                    <div className="flex gap-8">

                        <button
                            onClick={() =>
                                setActiveSection(
                                    'games'
                                )
                            }
                            className={`flex items-center gap-2 border-b-2 px-2 pb-4 text-sm font-medium transition ${
                                activeSection ===
                                'games'
                                    ? 'border-purple-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            <Gamepad2 size={18} />
                            Games
                        </button>

                        <button
                            onClick={() =>
                                setActiveSection(
                                    'users'
                                )
                            }
                            className={`flex items-center gap-2 border-b-2 px-2 pb-4 text-sm font-medium transition ${
                                activeSection ===
                                'users'
                                    ? 'border-purple-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            <Users size={18} />
                            Users
                        </button>
                        <button
                            onClick={() =>
                                setActiveSection('tournaments')
                            }
                            className={`flex items-center gap-2 border-b-2 px-2 pb-4 text-sm font-medium transition ${
                                activeSection === 'tournaments'
                                    ? 'border-purple-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            <Trophy size={18} />
                            Tournaments
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {message && (
                    <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-400">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* ========================= */}
                {/* GAMES */}
                {/* ========================= */}

                {activeSection === 'games' && (
                    <section>

                        <div className="mb-6 flex items-center justify-between">

                            <div>
                                <h2 className="text-2xl font-bold">
                                    Games
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Manage the games available
                                    on NextRound.
                                </p>
                            </div>

                            <button
                                onClick={
                                    openCreateGameModal
                                }
                                className="flex items-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#6D28D9]"
                            >
                                <Plus size={18} />
                                Add game
                            </button>

                        </div>

                        {loadingGames ? (
                            <div className="rounded-2xl border border-white/10 bg-[#111827] py-16 text-center text-gray-400">
                                Loading games...
                            </div>
                        ) : games.length === 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-[#111827] py-16 text-center text-gray-400">
                                No games available.
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                {games.map((game) => (
                                    <div
                                        key={game.id}
                                        className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]"
                                    >

                                        <div className="h-44 bg-[#0B0F19]">

                                            {game.image ? (
                                                <img
                                                    src={
                                                        imageHelper(game.image)
                                                    }
                                                    alt={
                                                        game.name
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <Gamepad2
                                                        size={60}
                                                        className="text-purple-400/40"
                                                    />
                                                </div>
                                            )}

                                        </div>

                                        <div className="p-5">

                                            <h3 className="text-xl font-bold">
                                                {game.name}
                                            </h3>

                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
                                                {game.description ||
                                                    'No description.'}
                                            </p>

                                            <div className="mt-5 flex gap-3">

                                                <button
                                                    onClick={() =>
                                                        openEditGameModal(
                                                            game
                                                        )
                                                    }
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                                                >
                                                    <Pencil
                                                        size={16}
                                                    />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteGame(
                                                            game.id
                                                        )
                                                    }
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                                                >
                                                    <Trash2
                                                        size={16}
                                                    />
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </section>
                )}

                {/* ========================= */}
                {/* USERS */}
                {/* ========================= */}

                {activeSection === 'users' && (
                    <section>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">
                                Users
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Manage NextRound user accounts
                                and roles.
                            </p>
                        </div>

                        {loadingUsers ? (
                            <div className="rounded-2xl border border-white/10 bg-[#111827] py-16 text-center text-gray-400">
                                Loading users...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-[#111827] py-16 text-center text-gray-400">
                                No users found.
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">

                                <div className="overflow-x-auto">

                                    <table className="w-full min-w-[800px]">

                                        <thead>
                                            <tr className="border-b border-white/10 text-left text-sm text-gray-500">

                                                <th className="px-6 py-4">
                                                    User
                                                </th>

                                                <th className="px-6 py-4">
                                                    Email
                                                </th>

                                                <th className="px-6 py-4">
                                                    Role
                                                </th>

                                                <th className="px-6 py-4">
                                                    Joined
                                                </th>

                                                <th className="px-6 py-4">
                                                    Actions
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody>

                                            {users.map(
                                                (user) => (
                                                    <tr
                                                        key={
                                                            user.id
                                                        }
                                                        className="border-b border-white/5 transition hover:bg-white/[0.02]"
                                                    >

                                                        <td className="px-6 py-5">

                                                            <div className="flex items-center gap-3">

                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                                                                    <span className="font-semibold text-purple-300">
                                                                        {user.name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </span>
                                                                </div>

                                                                <span className="font-medium">
                                                                    {
                                                                        user.name
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-5 text-sm text-gray-400">
                                                            {
                                                                user.email
                                                            }
                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <select
                                                                value={
                                                                    user.role
                                                                }
                                                                disabled={
                                                                    updatingUser ===
                                                                    user.id
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleUserRoleChange(
                                                                        user.id,
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="rounded-lg border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white outline-none focus:border-purple-500 disabled:opacity-50"
                                                            >
                                                                <option value="normal_user">
                                                                    Normal user
                                                                </option>

                                                                <option value="admin">
                                                                    Admin
                                                                </option>
                                                            </select>

                                                        </td>

                                                        <td className="px-6 py-5 text-sm text-gray-500">
                                                            {user.created_at
                                                                ? new Date(
                                                                      user.created_at
                                                                  ).toLocaleDateString(
                                                                      'en-US',
                                                                      {
                                                                          month: 'short',
                                                                          day: 'numeric',
                                                                          year: 'numeric',
                                                                      }
                                                                  )
                                                                : '—'}
                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteUser(
                                                                        user.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingUser ===
                                                                    user.id
                                                                }
                                                                className="flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {deletingUser ===
                                                                user.id
                                                                    ? 'Deleting...'
                                                                    : 'Delete'}
                                                            </button>

                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>
                        )}

                    </section>
                )}
                {/* ========================= */}
                {/* TOURNAMENTS */}
                {/* ========================= */}

                {activeSection === 'tournaments' && (
                    <section>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">
                                Tournaments
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Review and approve tournament requests.
                            </p>
                        </div>

                        {loadingTournaments ? (
                            <div className="rounded-2xl border border-white/10 bg-[#111827] py-16 text-center text-gray-400">
                                Loading tournaments...
                            </div>
                        ) : tournaments.length === 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-[#111827] py-16 text-center text-gray-400">
                                No tournaments waiting for approval.
                            </div>
                        ) : (
                            <div className="space-y-4">

                                {tournaments.map((tournament) => (
                                    <div
                                        key={tournament.id}
                                        className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]"
                                    >
                                        <div className="flex flex-col lg:flex-row">

                                            {/* Image */}
                                            <div className="h-56 w-full shrink-0 bg-[#0B0F19] lg:h-auto lg:w-64">
                                                {tournament.image ? (
                                                    <img
                                                        src={imageHelper(
                                                            tournament.image
                                                        )}
                                                        alt={
                                                            tournament.title
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : tournament.game?.image ? (
                                                    <img
                                                        src={imageHelper(
                                                            tournament.game.image
                                                        )}
                                                        alt={
                                                            tournament.game.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Trophy
                                                            size={60}
                                                            className="text-purple-400/40"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-1 flex-col justify-between p-6">

                                                <div>

                                                    <div className="flex flex-wrap items-start justify-between gap-4">

                                                        <div>
                                                            <p className="text-sm font-medium text-purple-400">
                                                                {tournament.game?.name ??
                                                                    'Unknown game'}
                                                            </p>

                                                            <h3 className="mt-1 text-xl font-bold">
                                                                {tournament.title}
                                                            </h3>
                                                        </div>
                                                        {   tournament.status === 'draft' &&
                                                            <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                                            Pending approval
                                        </span>
                                                        }


                                                    </div>

                                                    <p className="mt-4 text-sm leading-6 text-gray-400">
                                                        {tournament.description ||
                                                            'No description.'}
                                                    </p>

                                                    <div className="mt-5 grid gap-3 text-sm text-gray-400 sm:grid-cols-2">

                                                        <div>
                                            <span className="text-gray-500">
                                                Organizer
                                            </span>
                                                            <p className="mt-1 font-medium text-white">
                                                                {tournament.user?.name ??
                                                                    'Unknown'}
                                                            </p>
                                                        </div>

                                                        <div>
                                            <span className="text-gray-500">
                                                Maximum players
                                            </span>
                                                            <p className="mt-1 font-medium text-white">
                                                                {tournament.max_players}
                                                            </p>
                                                        </div>

                                                        <div>
                                            <span className="text-gray-500">
                                                Start date
                                            </span>
                                                            <p className="mt-1 font-medium text-white">
                                                                {tournament.start_date
                                                                    ? new Date(
                                                                        tournament.start_date
                                                                    ).toLocaleDateString(
                                                                        'en-US',
                                                                        {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric',
                                                                        }
                                                                    )
                                                                    : '—'}
                                                            </p>
                                                        </div>

                                                        <div>
                                            <span className="text-gray-500">
                                                End date
                                            </span>
                                                            <p className="mt-1 font-medium text-white">
                                                                {tournament.end_date
                                                                    ? new Date(
                                                                        tournament.end_date
                                                                    ).toLocaleDateString(
                                                                        'en-US',
                                                                        {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric',
                                                                        }
                                                                    )
                                                                    : '—'}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    {tournament.prize && (
                                                        <div className="mt-4">
                                            <span className="text-sm text-gray-500">
                                                Prize
                                            </span>

                                                            <p className="mt-1 font-semibold text-white">
                                                                {tournament.prize}
                                                            </p>
                                                        </div>
                                                    )}

                                                </div>

                                                <div className="mt-6 flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleApproveTournament(
                                                                tournament.id
                                                            )
                                                        }
                                                        disabled={
                                                            approvingTournament ===
                                                            tournament.id
                                                        }
                                                        className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {approvingTournament ===
                                                        tournament.id
                                                            ? 'Approving...'
                                                            : 'Approve tournament'}
                                                    </button>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}

                    </section>
                )}
            </main>

            {/* GAME MODAL */}
            {showGameModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

                    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold">
                                    {editingGame
                                        ? 'Edit game'
                                        : 'Add game'}
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Manage the game information.
                                </p>
                            </div>

                            <button
                                onClick={
                                    closeGameModal
                                }
                                disabled={savingGame}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleGameSubmit
                            }
                            className="space-y-5"
                        >

                            <div>
                                <label className="mb-2 block text-sm text-gray-400">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        gameForm.name
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setGameForm(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                name: event
                                                    .target
                                                    .value,
                                            })
                                        )
                                    }
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-white outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-400">
                                    Description
                                </label>

                                <textarea
                                    value={
                                        gameForm.description
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setGameForm(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                description:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-white outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-400">
                                    Game image
                                </label>

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(event) =>
                                        setGameForm((previous) => ({
                                            ...previous,
                                            image: event.target.files[0] || null,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-purple-500"
                                />

                                <p className="mt-2 text-xs text-gray-500">
                                    PNG, JPG, JPEG or WEBP. Maximum size: 5 MB.
                                </p>

                                {gameForm.image instanceof File && (
                                    <p className="mt-2 text-sm text-purple-400">
                                        Selected: {gameForm.image.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={
                                        closeGameModal
                                    }
                                    disabled={
                                        savingGame
                                    }
                                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        savingGame
                                    }
                                    className="flex-1 rounded-xl bg-purple-600 px-4 py-3 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {savingGame
                                        ? 'Saving...'
                                        : editingGame
                                        ? 'Save changes'
                                        : 'Create game'}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminDashboard;