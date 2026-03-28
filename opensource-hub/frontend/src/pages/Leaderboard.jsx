import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Flame, ArrowUp } from "lucide-react";
import API_BASE_URL from "../config";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real-time score updates from the backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/leaderboard`);
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();

        const mappedPlayers = data.map((user, index) => ({
          id: user._id || index,
          name: user.name || user.githubUsername,
          rank: index + 1,
          score: user.totalScore || 0,
          avatar:
            user.avatar_url ||
            `https://ui-avatars.com/api/?name=${user.githubUsername}`,
        }));

        setPlayers(mappedPlayers);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, []);

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return {
          color: "text-yellow-400",
          border: "border-yellow-400/50",
          glow: "shadow-[0_0_30px_rgba(250,204,21,0.2)]",
        };
      case 2:
        return {
          color: "text-slate-300",
          border: "border-slate-300/50",
          glow: "shadow-[0_0_20px_rgba(203,213,225,0.1)]",
        };
      case 3:
        return {
          color: "text-orange-400",
          border: "border-orange-400/50",
          glow: "shadow-[0_0_20px_rgba(251,146,60,0.1)]",
        };
      default:
        return { color: "text-text-dim", border: "border-white/5", glow: "" };
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-neon rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-float" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex glass-super px-6 py-3 rounded-full mb-6 items-center gap-3">
            <Flame className="text-orange-500 animate-pulse" />
            <span className="font-bold tracking-widest text-xs sm:text-sm uppercase text-text-main">
              Live Standings
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter">
            Global <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-lg md:text-xl text-text-dim px-4">
            Scores update automatically on GitHub pushes.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-white/10 text-text-dim text-sm uppercase font-bold px-4">
            <div className="col-span-2">Rank</div>
            <div className="col-span-7">Coder</div>
            <div className="col-span-3 text-right">Score</div>
          </div>

          {/* Player List */}
          <div className="mt-4 flex flex-col gap-4">
            <AnimatePresence>
              {players.map((player) => {
                const style = getRankStyle(player.rank);
                const isTop3 = player.rank <= 3;

                return (
                  <motion.div
                    key={player.id}
                    layout // This prop enables smooth repositioning animation automatically!
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex flex-wrap sm:grid sm:grid-cols-12 justify-between gap-3 sm:gap-4 items-center p-4 sm:p-5 rounded-2xl bg-white/5 border ${style.border} ${style.glow} transition-colors`}
                  >
                    <div
                      className={`sm:col-span-2 order-1 font-black text-xl sm:text-2xl flex flex-shrink-0 items-center gap-1 sm:gap-2 ${style.color}`}
                    >
                      #{player.rank}
                      {player.rank === 1 && (
                        <Crown
                          size={20}
                          className="animate-bounce sm:w-6 sm:h-6"
                        />
                      )}
                    </div>

                    <div className="sm:col-span-7 order-3 sm:order-2 w-full sm:w-auto flex items-center gap-3 sm:gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={player.avatar}
                          alt="Avatar"
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${style.border}`}
                        />
                        {isTop3 && (
                          <div
                            className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-black rounded-full p-1 ${style.color}`}
                          >
                            <Trophy
                              size={12}
                              className="sm:w-[14px] sm:h-[14px]"
                            />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-lg sm:text-xl font-bold truncate ${isTop3 ? "text-white" : "text-text-main"}`}
                      >
                        {player.name}
                      </span>
                    </div>

                    <div className="sm:col-span-3 order-2 sm:order-3 text-right font-mono text-xl sm:text-2xl font-bold text-accent-neon flex items-center justify-end gap-1 sm:gap-2 ml-auto">
                      <ArrowUp
                        size={14}
                        className="text-green-400 opacity-0 animate-[pulse_1s_ease-in-out_1] sm:w-4 sm:h-4"
                        key={player.score}
                      />
                      {player.score.toLocaleString()}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
