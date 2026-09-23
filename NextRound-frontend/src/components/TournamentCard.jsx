import { CalendarDays, Users } from 'lucide-react';
import {useNavigate} from "react-router-dom";

function TournamentCard({
    id,
    image,
    game,
    title,
    organizer,
    players,
    maxPlayers,
    startDate,
    endDate,
    status,
}) {
    const statusStyles = {
        Open: 'bg-green-500/20 text-green-400',
        'In Progress': 'bg-blue-500/20 text-blue-400',
        Closed: 'bg-orange-500/20 text-orange-400',
        Finished: 'bg-gray-500/20 text-gray-400',
    };
    const navigate = useNavigate();
    return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111827] transition duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/50">

            {/* Image */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={image}
                    alt={game}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />

                <span
                    className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
                >
                    {status}
                </span>
            </div>

            {/* Content */}
            <div className="p-5">

                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
                    {game}
                </p>

                <h3 className="text-lg font-bold text-white">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                    By {organizer}
                </p>

                <div className="mt-5 space-y-3 text-sm text-gray-400">

                    <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>
                            {players} / {maxPlayers} players
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span>
                            {startDate} – {endDate}
                        </span>
                    </div>

                </div>

                <button
                    onClick={() => navigate(`/tournaments/${id}`)}
                    className="mt-5 w-full rounded-lg bg-[#7C3AED] py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
                >
                    View Tournament
                </button>
            </div>
        </div>
    );
}

export default TournamentCard;