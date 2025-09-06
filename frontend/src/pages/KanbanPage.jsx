import React, { useState, useEffect } from "react";
import {
  KanbanSquare,
  Plus,
  Settings,
  Share,
  Download,
  Loader2,
} from "lucide-react";
import KanbanBoard from "../components/KanbanBoard";
import Button from "../components/common/Button";
import { kanbanService } from "../services/kanbanService";
import { toast } from "react-hot-toast";

const KanbanPage = () => {
  const [boardId, setBoardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrCreateBoard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get user's boards first
      const boards = (await kanbanService.getBoards()) || [];

      if (boards.length > 0) {
        // Use the first board (you can modify this to show a board selector)
        setBoardId(boards[0]._id);
      } else {
        // No boards exist, create a default one
        const newBoardData = {
          boardName: "My Study Tasks",
          description: "Organize your learning tasks and track progress",
        };

        const newBoard = await kanbanService.createBoard(newBoardData);

        if (newBoard && newBoard._id) {
          setBoardId(newBoard._id);
          toast.success("Created your first Kanban board!");
        } else {
          throw new Error("Failed to create board");
        }
      }
    } catch (err) {
      console.error("Error loading board:", err);
      setError("Failed to load or create board. Please try again.");
      toast.error("Unable to load board data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewBoard = async () => {
    try {
      const newBoardData = {
        boardName: `Study Board ${Date.now()}`,
        description: "New study planning board",
      };

      const newBoard = await kanbanService.createBoard(newBoardData);

      if (newBoard && newBoard._id) {
        setBoardId(newBoard._id);
        toast.success("New board created successfully!");
      }
    } catch (err) {
      console.error("Error creating board:", err);
      toast.error("Failed to create new board");
    }
  };

  useEffect(() => {
    loadOrCreateBoard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <KanbanSquare className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Study Kanban Board
                </h1>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Organize your learning tasks visually
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled={loading}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" disabled={loading}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" disabled={loading}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCreateNewBoard}
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Board
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Loading your board...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Setting up your Kanban workspace
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <KanbanSquare className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Unable to load board
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button
                onClick={loadOrCreateBoard}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : boardId ? (
          <KanbanBoard boardId={boardId} />
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No board available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Unable to load or create a board at this time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanPage;
