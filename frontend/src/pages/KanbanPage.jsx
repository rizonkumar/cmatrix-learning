import React, { useState, useEffect } from "react";
import {
  KanbanSquare,
  Plus,
  Download,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";
import KanbanBoard from "../components/KanbanBoard";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { kanbanService } from "../services/kanbanService";
import { toast } from "react-hot-toast";

const KanbanPage = () => {
  const [boardId, setBoardId] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");

  const loadOrCreateBoard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get user's boards first
      const response = await kanbanService.getBoards();
      const boardsList = response.boards || response || []; // Handle different response formats

      console.log("Boards response:", boardsList); // Debug log

      if (boardsList.length > 0) {
        setBoards(boardsList);

        // If only one board, use it directly
        if (boardsList.length === 1) {
          setBoardId(boardsList[0]._id);
          console.log("Selected single board ID:", boardsList[0]._id); // Debug log
        } else {
          // Show board selector for multiple boards
          setShowBoardSelector(true);
        }
      } else {
        // No boards exist, create a default one
        const newBoardData = {
          boardName: "My Study Tasks",
          description: "Organize your learning tasks and track progress",
        };

        const newBoard = await kanbanService.createBoard(newBoardData);

        if (newBoard && newBoard._id) {
          setBoardId(newBoard._id);
          setBoards([newBoard]);
          toast.success("Created your first Kanban board!");
          console.log("Created new board ID:", newBoard._id); // Debug log
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

  const handleCreateNewBoard = () => {
    setNewBoardName("");
    setNewBoardDescription("");
    setShowNewBoardModal(true);
  };

  const handleNewBoardSubmit = async () => {
    if (!newBoardName.trim()) {
      toast.error("Please enter a board name");
      return;
    }

    try {
      const newBoardData = {
        boardName: newBoardName.trim(),
        description: newBoardDescription.trim() || "New study planning board",
      };

      const newBoard = await kanbanService.createBoard(newBoardData);

      if (newBoard && newBoard._id) {
        setBoardId(newBoard._id);
        setBoards((prev) => [...prev, newBoard]);
        setShowBoardSelector(false);
        setShowNewBoardModal(false);
        toast.success("New board created successfully!");
      }
    } catch (err) {
      console.error("Error creating board:", err);
      toast.error("Failed to create new board");
    }
  };

  const handleExportBoard = async () => {
    if (!boardId || !getCurrentBoard()) {
      toast.error("No board selected");
      return;
    }

    try {
      // Get the current board data from the server
      const response = await kanbanService.getBoardById(boardId);

      if (!response || !response.board) {
        toast.error("Failed to load board data for export");
        return;
      }

      const boardData = {
        board: response.board,
        columns: response.columns || [],
        exportedAt: new Date().toISOString(),
        exportedBy: "C-Matrix Learning User",
      };

      // Create and download the file
      const dataStr = JSON.stringify(boardData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${response.board.boardName || "kanban-board"}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      toast.success("Board exported successfully!");
    } catch (err) {
      console.error("Error exporting board:", err);
      toast.error("Failed to export board");
    }
  };

  const handleBoardSelect = (board) => {
    setBoardId(board._id);
    setShowBoardSelector(false);
  };

  const getCurrentBoard = () => {
    return boards.find((board) => board._id === boardId);
  };

  useEffect(() => {
    loadOrCreateBoard();
  }, []);

  // Close board selector and modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showBoardSelector && !event.target.closest(".board-selector")) {
        setShowBoardSelector(false);
      }
      if (showNewBoardModal && !event.target.closest(".new-board-modal")) {
        setShowNewBoardModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBoardSelector, showNewBoardModal]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sm:py-0 sm:h-16">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <KanbanSquare className="w-6 h-6 text-blue-600" />
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {showBoardSelector || boards.length > 1 ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowBoardSelector(!showBoardSelector)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-w-0"
                      >
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                          {getCurrentBoard()?.boardName || "Study Kanban Board"}
                        </h1>
                        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      </button>

                      {showBoardSelector && (
                        <div className="board-selector absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                          <div className="max-h-60 overflow-y-auto">
                            {boards.map((board) => (
                              <button
                                key={board._id}
                                onClick={() => handleBoardSelect(board)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                  boardId === board._id
                                    ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
                                    : ""
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-gray-900 dark:text-white truncate">
                                    {board.boardName}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {board.description}
                                  </div>
                                </div>
                                {boardId === board._id && (
                                  <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                            <Button
                              onClick={handleCreateNewBoard}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create New Board
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {getCurrentBoard()?.boardName || "Study Kanban Board"}
                    </h1>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline truncate">
                Organize your learning tasks visually
              </span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="hidden sm:flex"
                  onClick={handleExportBoard}
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">Export</span>
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                  onClick={handleCreateNewBoard}
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">New Board</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </div>
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
        ) : boardId && boards.length > 0 ? (
          <KanbanBoard boardId={boardId} />
        ) : showBoardSelector ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <KanbanSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Select a Board
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a board from the dropdown above to get started.
              </p>
            </div>
          </div>
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

      {/* New Board Modal */}
      {showNewBoardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="new-board-modal bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Create New Board
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Set up a new Kanban board for your tasks
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewBoardModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Input
                label="Board Name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Enter board name (e.g., Math Problem Solving)"
                required
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  placeholder="Describe what this board is for..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNewBoardModal(false)}
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNewBoardSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                  disabled={!newBoardName.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Board
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanPage;
