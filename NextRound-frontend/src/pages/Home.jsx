import { useEffect, useState } from 'react';
import {
    ArrowRight,
    Gamepad2,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';

import Navbar from '../components/Navbar';
import TournamentCard from '../components/TournamentCard';
import PlayerCard from '../components/PlayerCard';
import api from '../services/api';


function Home() {
    const [tournaments, setTournaments] = useState([]);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const [
                    tournamentsResponse,
                    playersResponse,
                ] = await Promise.all([
                    api.get('/tournaments'),
                    api.get('/top-players'),
                ]);

                /*
                ========================================
                TOURNAMENTS
                ========================================
                */

                const tournamentsData =
                    tournamentsResponse.data
                        .tournaments;

                setTournaments(
                    tournamentsData
                        .slice(0, 4)
                        .map((tournament) => ({
                            id:
                                tournament.game?.id ??
                                null,
                            image:
                                tournament.game?.image ??
                                null,

                            game:
                                tournament.game?.name ??
                                'Unknown game',

                            title:
                            tournament.title,

                            organizer:
                                tournament.user?.name ??
                                'Unknown organizer',

                            players:
                                tournament.approved_registrations_count ??
                                0,

                            maxPlayers:
                            tournament.max_players,

                            startDate:
                                formatDate(
                                    tournament.start_date
                                ),

                            endDate:
                                formatDate(
                                    tournament.end_date
                                ),

                            status:
                                formatStatus(
                                    tournament.status
                                ),
                        }))
                );


                /*
                ========================================
                TOP PLAYERS
                ========================================
                */

                setPlayers(
                    playersResponse.data
                        .slice(0, 5)
                        .map((ranking, index) => ({
                            position:
                                ranking.position ??
                                index + 1,

                            name:
                                ranking.player?.name ??
                                'Unknown player',

                            points:
                            ranking.points,
                        }))
                );

            } catch (error) {
                console.error(
                    'Error loading homepage data:',
                    error.response?.data ||
                    error.message
                );
            }
        };

        loadHomeData();
    }, []);


    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">

            <Navbar />

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(124,58,237,0.20),transparent_35%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_70%,rgba(59,130,246,0.08),transparent_30%)]" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2">

                    <div>

                        <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-[#8B5CF6]">
                            Play · Organize · Compete
                        </p>

                        <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                            THE NEXT MATCH
                            <span className="block text-[#8B5CF6]">
                                STARTS HERE
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
                            Join tournaments, challenge players, create your own
                            events, and become part of a growing esports community.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">

                            <button className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-3.5 font-semibold transition hover:bg-[#6D28D9]">
                                <Trophy size={18} />
                                Explore Tournaments
                            </button>

                            <button className="rounded-lg border border-[#7C3AED] px-6 py-3.5 font-semibold text-white transition hover:bg-[#7C3AED]/10">
                                Create Tournament
                            </button>

                        </div>

                        {/* Stats */}
                        <div className="mt-12 flex flex-wrap gap-10">

                            <div>
                                <div className="flex items-center gap-2">
                                    <Users
                                        className="text-[#8B5CF6]"
                                        size={20}
                                    />
                                    <span className="text-2xl font-bold">
                                        {players.length}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    Players
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <Gamepad2
                                        className="text-[#8B5CF6]"
                                        size={20}
                                    />

                                    <span className="text-2xl font-bold">
                                        {tournaments.length}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    Tournaments
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <Users
                                        className="text-[#8B5CF6]"
                                        size={20}
                                    />

                                    <span className="text-2xl font-bold">
                                        —
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    Games
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Hero visual */}
                    <div className="relative hidden min-h-[520px] lg:block">

                        <div className="absolute right-0 top-10 h-[430px] w-[430px] rounded-full bg-[#7C3AED]/20 blur-[100px]" />

                        <div className="absolute bottom-10 right-10 h-[380px] w-[380px] rounded-3xl border border-[#7C3AED]/20 bg-gradient-to-br from-[#1A1032] via-[#111827] to-[#0B0F19] shadow-2xl shadow-purple-950/40">

                            <div className="absolute left-8 top-8 flex items-center gap-3">
                                <Zap
                                    className="text-[#8B5CF6]"
                                    size={28}
                                />

                                <span className="text-lg font-bold">
                                    NextRound
                                </span>
                            </div>

                            <div className="absolute bottom-12 left-8">

                                <p className="text-sm uppercase tracking-widest text-gray-500">
                                    Competitive Gaming
                                </p>

                                <p className="mt-2 text-4xl font-black">
                                    COMPETE.
                                </p>

                                <p className="text-4xl font-black text-[#8B5CF6]">
                                    DOMINATE.
                                </p>

                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* TRENDING TOURNAMENTS */}
            <section className="border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 py-20">

                    <div className="mb-10 flex items-end justify-between">

                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#8B5CF6]">
                                Trending
                            </p>

                            <h2 className="text-3xl font-black">
                                Trending Tournaments
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Join the most popular tournaments in the community.
                            </p>
                        </div>

                        <button className="hidden items-center gap-2 text-sm font-semibold text-[#A78BFA] md:flex">
                            View all tournaments
                            <ArrowRight size={16} />
                        </button>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                        {tournaments.map((tournament) => (
                            <TournamentCard
                                key={tournament.id}
                                {...tournament}
                            />
                        ))}

                    </div>
                </div>
            </section>

            {/* TOP PLAYERS */}
            <section className="border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 py-20">

                    <div className="mb-10 flex items-end justify-between">

                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#8B5CF6]">
                                Rankings
                            </p>

                            <h2 className="text-3xl font-black">
                                Top Players
                            </h2>

                            <p className="mt-2 text-gray-500">
                                The most active and successful players this month.
                            </p>
                        </div>

                        <button className="hidden items-center gap-2 text-sm font-semibold text-[#A78BFA] md:flex">
                            View full rankings
                            <ArrowRight size={16} />
                        </button>

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

                        {players.map((player) => (
                            <PlayerCard
                                key={player.position}
                                {...player}
                            />
                        ))}

                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-20">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#7C3AED]/40 bg-gradient-to-r from-[#17102B] via-[#151B35] to-[#0E172B]">

                    <div className="px-8 py-14 md:px-12">

                        <p className="text-sm font-semibold uppercase tracking-widest text-[#A78BFA]">
                            Build your competition
                        </p>

                        <h2 className="mt-3 text-3xl font-black md:text-4xl">
                            Ready to create your own tournament?
                        </h2>

                        <p className="mt-3 max-w-2xl text-gray-400">
                            Bring your community together and organize epic competitions.
                        </p>

                        <button className="mt-7 flex items-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-3.5 font-semibold transition hover:bg-[#6D28D9]">
                            <Trophy size={18} />
                            Create Tournament
                        </button>

                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-[#080B12]">

                <div className="mx-auto max-w-7xl px-6 py-12">

                    <div className="grid gap-10 md:grid-cols-4">

                        <div>
                            <div className="flex items-center gap-2">
                                <Zap
                                    size={24}
                                    className="fill-[#7C3AED] text-[#7C3AED]"
                                />

                                <span className="font-black">
                                    NextRound
                                </span>
                            </div>

                            <p className="mt-4 text-sm text-gray-500">
                                Compete. Organize. Dominate.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Quick Links
                            </h3>

                            <div className="mt-4 space-y-3 text-sm text-gray-500">
                                <p>Tournaments</p>
                                <p>Games</p>
                                <p>Rankings</p>
                                <p>About</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Support
                            </h3>

                            <div className="mt-4 space-y-3 text-sm text-gray-500">
                                <p>Help Center</p>
                                <p>Contact Us</p>
                                <p>Terms of Service</p>
                                <p>Privacy Policy</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Stay Updated
                            </h3>

                            <p className="mt-4 text-sm text-gray-500">
                                Get the latest tournaments and news.
                            </p>

                            <div className="mt-4 flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="min-w-0 flex-1 rounded-l-lg border border-white/10 bg-[#111827] px-4 py-2.5 text-sm outline-none placeholder:text-gray-600"
                                />

                                <button className="rounded-r-lg bg-[#7C3AED] px-4 text-sm font-semibold">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="mt-12 border-t border-white/10 pt-6 text-sm text-gray-600">
                        © 2026 NextRound. All rights reserved.
                    </div>

                </div>
            </footer>

        </div>
    );
}


/* =========================
   HELPERS
========================= */

function formatDate(date) {
    if (!date) {
        return '';
    }

    return new Date(date).toLocaleDateString(
        'en-US',
        {
            month: 'short',
            day: '2-digit',
        }
    );
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


export default Home;