import { Crown } from 'lucide-react';

function PlayerCard({
    position,
    name,
    points,
}) {
    return (
        <div className="relative rounded-xl border border-white/10 bg-[#111827] p-5 transition hover:border-[#7C3AED]/40">

            <div className="absolute left-4 top-4 rounded-md bg-[#1F2937] px-2.5 py-1 text-xs font-bold text-white">
                #{position}
            </div>

            <div className="flex flex-col items-center">


                <h3 className="mt-4 font-bold text-white">
                    {name}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-[#C4B5FD]">
                    <Crown size={15} />
                    {points.toLocaleString()} pts
                </div>

            </div>
        </div>
    );
}

export default PlayerCard;