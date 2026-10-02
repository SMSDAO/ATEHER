import { useEffect, useState, useCallback } from "react";
import { getSocket } from "../lib/socket";

export interface Project {
  id: string;
  title: string;
  status: string;
  timestamp: string;
}

export function useCollaboration() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const handleInit = (data: { projects: Project[] }) => setProjects(data.projects);
    const handleAdd = (project: Project) => setProjects(prev => [project, ...prev]);
    const handleRemove = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("init_state", handleInit);
    socket.on("project_added", handleAdd);
    socket.on("project_removed", handleRemove);

    // Initial state check in case socket is already connected
    setIsConnected(socket.connected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("init_state", handleInit);
      socket.off("project_added", handleAdd);
      socket.off("project_removed", handleRemove);
    };
  }, []);

  const createProject = useCallback((title: string) => {
    getSocket().emit("create_project", { title });
  }, []);

  const deleteProject = useCallback((id: string) => {
    getSocket().emit("delete_project", id);
  }, []);

  return {
    projects,
    isConnected,
    createProject,
    deleteProject
  };
}
