import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trophy, Star, Terminal } from "lucide-react";
import toast from "react-hot-toast";
import API_BASE_URL from "../config";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Hacker",
    totalScore: 0,
    avatar_url: "",
    selectedProjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    number: "",
    year: "",
    branch: "",
    section: "",
  });

  const refreshUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        withCredentials: true,
      });

      setUser(res.data);
      setForm({
        name: res.data.name || "",
        number: res.data.number || "",
        year: res.data.year || "",
        branch: res.data.branch || "",
        section: res.data.section || "",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        console.error("Profile fetch error:", error);
        toast.error("Failed to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
const res = await axios.put(
  `${API_BASE_URL}/api/auth/me`,
  form,
  { withCredentials: true }
);      setUser(res.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleLeaveProject = async (projectId) => {
    try {
      await axios.post(
  `${API_BASE_URL}/api/projects/${projectId}/leave`,
  {},
  { withCredentials: true }
);
      setUser((prev) => ({
        ...prev,
        selectedProjects: prev.selectedProjects.filter(
          (p) => p._id !== projectId,
        ),
      }));
      toast.success("Removed from project");
    } catch (error) {
      toast.error("Could not leave project");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-neon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const selectedProjects = Array.isArray(user.selectedProjects)
    ? user.selectedProjects
    : [];

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent_40%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row gap-8">
        {/* Sidebar Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/3 glass-super p-8 rounded-3xl flex flex-col items-center text-center h-fit"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-accent-neon blur-xl opacity-30 rounded-full animate-pulse-slow"></div>
            <img
              src={user.avatar_url || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="relative w-32 h-32 rounded-full border-4 border-white/10 shadow-2xl object-cover"
            />
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="w-full space-y-3 text-left">
              <label className="block text-sm">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
              <label className="block text-sm">Phone</label>
              <input
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
              <label className="block text-sm">Year</label>
              <input
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
              <label className="block text-sm">Branch</label>
              <input
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
              <label className="block text-sm">Section</label>
              <input
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
              <div className="flex gap-3 mt-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-accent-neon text-white rounded-xl"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-white/10 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
              <p className="text-text-dim mb-2 flex items-center gap-2 justify-center">
                <Terminal size={16} /> @{user.githubUsername}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-bold text-sm"
              >
                Edit Profile
              </button>
            </>
          )}

          <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 mb-6 flex flex-col items-center mt-6">
            <Trophy className="text-yellow-400 mb-2 w-10 h-10" />
            <div className="text-text-dim uppercase text-xs font-bold tracking-widest mb-1">
              Total Score
            </div>
            <div className="text-4xl font-black text-accent-neon">
              {user.totalScore}
            </div>
          </div>
        </motion.div>

        {/* Main Content: Joined Projects */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-2/3"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Star className="text-accent-cyan" /> My Projects
          </h3>

          {selectedProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedProjects.map((project) => (
                <div
                  key={project._id}
                  className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors border border-white/5 group"
                >
                  <div className="mb-4">
                    <h4 className="text-xl font-bold group-hover:text-accent-cyan transition-colors">
                      {project.title || `Project ID ${project._id}`}
                    </h4>
                    <p className="text-text-dim text-sm">
                      {project.author || "Unknown author"}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    {project.discordLink ? (
                      <a
                        href={project.discordLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 text-center bg-accent-neon/20 text-accent-neon hover:bg-accent-neon/30 text-sm font-bold rounded-lg transition-colors"
                      >
                        Discord
                      </a>
                    ) : (
                      <div className="flex-1 py-2 text-center bg-white/10 text-text-dim rounded-lg">
                        No Discord
                      </div>
                    )}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 text-center bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      GitHub
                    </a>
                  </div>

                  <button
                    onClick={() => handleLeaveProject(project._id)}
                    className="w-full py-2 mt-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                  >
                    Leave Project
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-12 rounded-3xl text-center flex flex-col items-center justify-center border border-white/5">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Star className="text-text-dim opacity-50 w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">No Projects Yet</h4>
              <p className="text-text-dim mb-6 max-w-sm">
                You haven't joined any open-source projects. Head over to the
                hub to start contributing and earning points.
              </p>
              <a
                href="/projects"
                className="px-6 py-3 bg-white text-primary font-bold rounded-full hover:scale-105 transition-transform"
              >
                Explore Hub
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
