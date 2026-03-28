import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderGit2,
  Star,
  CheckCircle,
  Plus,
  X,
  BookOpen,
  MessageSquare,
  Terminal,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", githubUrl: "" });

  useEffect(() => {
    const init = async () => {
      try {
        const [meRes, projRes] = await Promise.all([
          axios.get("/api/auth/me").catch(() => ({ data: null })),
          axios.get("/api/projects"),
        ]);
        setUser(meRes.data);
        if (Array.isArray(projRes.data)) {
          setProjects(projRes.data);
        } else {
          setProjects([]);
          toast.error("Backend is not returning JSON. Is the server running?");
        }
      } catch (err) {
        toast.error("Failed to connect to server");
        setProjects([]);
      }
    };
    init();
  }, []);
  const API = import.meta.env.VITE_API_URL;
  const handleJoinProject = async (projectId) => {
    if (!user) {
      toast.error("Please log in to join projects");
      setTimeout(() => (window.location.href = "/signup"), 1500);
      return;
    }

    try {
      await axios.post(`${API}/api/projects/join/${projectId}`,{},
      { withCredentials: true }
    );
      toast.success("Successfully joined!");
      setProjects(
        projects.map((p) =>
          p._id === projectId
            ? { ...p, participants: [...(p.participants || []), user._id] }
            : p,
        ),
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to join");
    }
  };

  const handleAddProject = () => {
    toast.success("Project request submitted to admins!");
    setShowModal(false);
    setNewProject({ title: "", githubUrl: "" });
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Select <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-text-dim text-lg">
              Pick the open-source projects you want to contribute to.
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 md:mt-0 glass px-6 py-3 min-h-[48px] rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Plus size={20} className="text-accent-neon" /> Add Missing
              Project
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {projects.map((project, idx) => {
            // Check if user's ID is in the participants array (works if populated or string IDs)
            const hasJoined =
              user &&
              project.participants?.some((id) => (id._id || id) === user._id);

            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`flex flex-col glass-super p-6 rounded-3xl transition-all duration-300 relative overflow-hidden group ${hasJoined ? "ring-2 ring-accent-cyan bg-white/5" : ""}`}
              >
                {hasJoined && (
                  <div className="absolute top-4 right-4 text-accent-cyan">
                    <CheckCircle size={24} className="animate-pulse" />
                  </div>
                )}

                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-text-dim">
                  <FolderGit2 size={24} />
                </div>

                <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                <p className="text-sm text-text-dim mb-4">{project.author}</p>
                <p className="text-white/80 mb-6 text-sm flex-grow line-clamp-3">
                  {project.desc}
                </p>

                {hasJoined ? (
                  <div className="flex flex-col gap-2 mt-4 mt-auto">
                    {project.documentationLink && (
                      <a
                        href={project.documentationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-center text-sm font-bold rounded-lg flex justify-center items-center gap-2"
                      >
                        <BookOpen size={16} /> Docs
                      </a>
                    )}
                    <div className="flex gap-2">
                      {project.discordLink ? (
                        <a
                          href={project.discordLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 bg-accent-neon/20 text-accent-neon hover:bg-accent-neon/30 text-center text-sm font-bold rounded-lg flex justify-center items-center gap-2"
                        >
                          <MessageSquare size={16} /> Chat
                        </a>
                      ) : (
                        <div className="flex-1 py-2 bg-white/10 text-text-dim text-center text-sm font-bold rounded-lg flex justify-center items-center gap-2 cursor-not-allowed opacity-50">
                          <MessageSquare size={16} /> No Chat
                        </div>
                      )}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-white text-primary hover:bg-gray-200 text-center text-sm font-bold rounded-lg flex justify-center items-center gap-2"
                      >
                        <Terminal size={16} /> Code
                      </a>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinProject(project._id)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors mt-auto min-h-[48px]"
                  >
                    Join Project
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-super p-8 rounded-3xl w-full max-w-md relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-text-dim hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Submit New Project</h2>
              <p className="text-text-dim mb-6 text-sm">
                If your cohort's project isn't listed, add its GitHub URL here
                so others can join.
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-text-dim focus:outline-none focus:ring-1 focus:ring-accent-neon"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="GitHub Repository URL"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-text-dim focus:outline-none focus:ring-1 focus:ring-accent-neon"
                  value={newProject.githubUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, githubUrl: e.target.value })
                  }
                />
                <button
                  onClick={handleAddProject}
                  className="w-full py-3 bg-gradient-to-r from-accent-neon to-accent-cyan text-white font-bold rounded-xl hover:opacity-90 transition-opacity mt-4"
                >
                  Request Addition
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
