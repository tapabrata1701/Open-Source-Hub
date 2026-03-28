import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ShieldAlert, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
const API = import.meta.env.VITE_API_URL;
const Admin = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    author: "",
    githubUrl: "",
    desc: "",
    documentationLink: "",
    language: "",
    discordLink: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [meRes, projRes] = await Promise.all([
          axios.get(`${API}/api/auth/me`, { withCredentials: true }),
          axios.get(`${API}/api/projects`, { withCredentials: true }),
        ]);

        if (meRes.data.role !== "admin") {
          toast.error("Unauthorized access");
          window.location.href = "/";
        }
        setProjects(projRes.data);
      } catch (err) {
        toast.error("Failed to load admin panel");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/projects", newProject);
      setProjects([...projects, res.data]);
      setNewProject({
        title: "",
        author: "",
        githubUrl: "",
        desc: "",
        documentationLink: "",
        language: "",
        discordLink: "",
      });
      toast.success("Project added successfully!");
    } catch (err) {
      toast.error("Creation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-red-500/20 text-red-500 rounded-xl">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-text-dim">Superuser control panel.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 glass-super p-6 rounded-3xl border border-red-500/20"
          >
            <h2 className="text-xl font-bold mb-6">Create New Project</h2>
            <form
              onSubmit={handleCreateProject}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Project Name"
                required
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
              <input
                type="text"
                placeholder="Author/Org"
                required
                value={newProject.author}
                onChange={(e) =>
                  setNewProject({ ...newProject, author: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
              <input
                type="text"
                placeholder="Language"
                value={newProject.language}
                onChange={(e) =>
                  setNewProject({ ...newProject, language: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
              <input
                type="url"
                placeholder="GitHub URL"
                required
                value={newProject.githubUrl}
                onChange={(e) =>
                  setNewProject({ ...newProject, githubUrl: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
              <input
                type="url"
                placeholder="Documentation Link (Optional)"
                value={newProject.documentationLink}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    documentationLink: e.target.value,
                  })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
              <input
                type="url"
                placeholder="Discord Server Link (Optional)"
                value={newProject.discordLink}
                onChange={(e) =>
                  setNewProject({ ...newProject, discordLink: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500"
              />
              <textarea
                placeholder="Description"
                required
                value={newProject.desc}
                onChange={(e) =>
                  setNewProject({ ...newProject, desc: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 h-24 resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors mt-2"
              >
                Deploy Project
              </button>
            </form>
          </motion.div>

          {/* Project Management Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-super p-6 rounded-3xl"
          >
            <h2 className="text-xl font-bold mb-6">Manage Live Projects</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-text-dim text-sm uppercase">
                    <th className="pb-3 pl-4">Project</th>
                    <th className="pb-3">Participants</th>
                    <th className="pb-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 pl-4">
                        <div className="font-bold">{project.title}</div>
                        <div className="text-xs text-text-dim">
                          {project.author}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-accent-cyan" />
                          <span className="font-bold">
                            {project.participants?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right pr-4">
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 text-text-dim hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-8 text-center text-text-dim"
                      >
                        No projects loaded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
