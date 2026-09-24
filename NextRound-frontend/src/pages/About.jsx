import {
    Trophy,
    Gamepad2,
    Users,
    Swords,
    Bell,
    BarChart3,
    ShieldCheck,
    Zap,
} from 'lucide-react';
import Navbar from "../components/Navbar.jsx";

function About() {
    const features = [
        {
            icon: Trophy,
            title: 'Tournament Management',
            description:
                'Create and manage tournaments from registration to the final match.',
        },
        {
            icon: Swords,
            title: 'Automatic Brackets',
            description:
                'Generate randomized first-round matchups and follow the tournament round by round.',
        },
        {
            icon: Users,
            title: 'Player Registration',
            description:
                'Players can join tournaments while organizers manage registration requests.',
        },
        {
            icon: BarChart3,
            title: 'Rankings',
            description:
                'Track victories, defeats, and points to follow player performance.',
        },
        {
            icon: Bell,
            title: 'Notifications',
            description:
                'Stay informed about registrations, matches, and important tournament updates.',
        },
        {
            icon: ShieldCheck,
            title: 'Secure Platform',
            description:
                'Authentication and role-based permissions keep tournament management organized.',
        },
    ];

    const steps = [
        {
            number: '01',
            title: 'Create a tournament',
            description:
                'Organizers choose the game, player capacity, dates, and tournament details.',
        },
        {
            number: '02',
            title: 'Approve players',
            description:
                'Players register and the organizer manages the registration requests.',
        },
        {
            number: '03',
            title: 'Start the tournament',
            description:
                'Once the tournament is full, the bracket and first-round matches are generated automatically.',
        },
        {
            number: '04',
            title: 'Play and progress',
            description:
                'Results determine the winners of each round until the tournament reaches its final.',
        },
    ];

    return (

        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_40%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_35%)]" />

                <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
                    <div className="max-w-3xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300">
                            <Zap className="h-4 w-4" />
                            Welcome to NextRound
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Where every match leads to the{' '}
                            <span className="text-[#7C3AED]">
                                next round.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
                            NextRound is a tournament management platform
                            designed to make competitive gaming easier to
                            organize, follow, and enjoy.
                        </p>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
                                About NextRound
                            </p>

                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                Built for competitive gaming.
                            </h2>

                            <p className="mt-6 leading-7 text-gray-400">
                                Organizing a tournament can involve a lot of
                                manual work: managing players, building
                                brackets, recording results, and keeping
                                everyone informed.
                            </p>

                            <p className="mt-4 leading-7 text-gray-400">
                                NextRound brings these elements together in
                                one platform so organizers can focus on
                                running their tournaments and players can
                                focus on competing.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
                                <Gamepad2 className="h-7 w-7 text-purple-400" />
                            </div>

                            <h3 className="mt-6 text-2xl font-bold">
                                One platform. Every round.
                            </h3>

                            <p className="mt-4 leading-7 text-gray-400">
                                From the first registration to the final
                                result, NextRound provides the tools needed
                                to manage the tournament journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
                            Platform features
                        </p>

                        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                            Everything you need to run a tournament
                        </h2>

                        <p className="mt-4 text-gray-400">
                            NextRound connects tournament organization,
                            player participation, and match progression in
                            one place.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-purple-500/30"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                                        <Icon className="h-6 w-6 text-purple-400" />
                                    </div>

                                    <h3 className="mt-5 text-lg font-semibold">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
                                How it works
                            </p>

                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                From registration to the final.
                            </h2>

                            <p className="mt-5 leading-7 text-gray-400">
                                NextRound simplifies the tournament lifecycle
                                into a clear and structured process.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step) => (
                                <div
                                    key={step.number}
                                    className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-sm font-bold text-purple-400">
                                        {step.number}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            {step.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-gray-400">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                    <div className="rounded-3xl border border-purple-500/20 bg-purple-500/[0.06] px-6 py-12 text-center sm:px-12">
                        <Trophy className="mx-auto h-10 w-10 text-purple-400" />

                        <h2 className="mt-5 text-3xl font-bold">
                            Ready for the next round?
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                            Discover tournaments, join the competition, and
                            follow every match from start to finish.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;