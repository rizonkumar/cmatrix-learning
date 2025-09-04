import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  X,
  Save,
  AlertTriangle,
  KanbanSquare,
} from "lucide-react";
import Button from "./common/Button";
import Input from "./common/Input";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Calendar, Flag, GripVertical } from "lucide-react";
import { kanbanService } from "../services/kanbanService";
import { DataLoader } from "./common/LoadingSpinner";
import { KanbanCardSkeleton } from "./common/SkeletonLoader";
import { toast } from "react-hot-toast";

const KanbanCard = ({ card, onEdit, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: card.title || "",
    description: card.description || "",
    priority: card.priority || "medium",
    dueDate: card.dueDate
      ? new Date(card.dueDate).toISOString().split("T")[0]
      : "",
  });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 mb-3 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
            {card.title}
          </h4>
          {card.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {card.description}
            </p>
          )}
        </div>
        <div
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing ml-2"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {card.priority && (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                card.priority
              )}`}
            >
              <Flag className="w-3 h-3 inline mr-1" />
              {card.priority}
            </span>
          )}

          {card.dueDate && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(card.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {card.assignee && (
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {card.assignee.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditModal(true);
              }}
              className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              title="Edit Card"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title="Delete Card"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Edit Card
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Update card details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Input
                label="Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Card title"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Card description"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) =>
                      setEditForm({ ...editForm, priority: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <Input
                  label="Due Date"
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dueDate: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onEdit(card.id, editForm);
                    setShowEditModal(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Delete Card
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete the card{" "}
                <strong>"{card.title}"</strong>? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onDelete(card.id);
                    setShowDeleteModal(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Card
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KanbanColumn = ({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) => {
  const { setNodeRef, isOver } = useSortable({ id: column.id });

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[400px] border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${column.color || "bg-blue-500"}`}
          ></div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {column.title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            {cards.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-[300px] ${
          isOver ? "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2" : ""
        }`}
      >
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
          />
        ))}

        <button
          onClick={() => onAddCard(column.id)}
          className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Card
        </button>
      </div>
    </div>
  );
};

const KanbanBoard = ({ boardId }) => {
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const loadBoard = async () => {
    if (!boardId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await kanbanService.getBoardById(boardId);

      if (response && response.data) {
        setBoard(response.data.board || response.data);
        const boardColumns = response.data.columns || [];

        // If board has no columns, create default ones
        if (boardColumns.length === 0) {
          await createDefaultColumns(boardId);
        } else {
          setColumns(boardColumns);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error loading board:", err);
      let errorMessage = "Failed to load board data";

      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        if (status === 404) {
          errorMessage = "Board not found";
        } else if (status === 403) {
          errorMessage = "You don't have permission to access this board";
        } else if (status === 401) {
          errorMessage = "Please log in to access your board";
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultColumns = async (boardId) => {
    try {
      const defaultColumns = [
        { title: "To Do", color: "bg-red-500", order: 0 },
        { title: "In Progress", color: "bg-yellow-500", order: 1 },
        { title: "Review", color: "bg-blue-500", order: 2 },
        { title: "Done", color: "bg-green-500", order: 3 },
      ];

      const createdColumns = [];

      for (const columnData of defaultColumns) {
        try {
          const response = await kanbanService.createColumn(
            boardId,
            columnData
          );
          createdColumns.push(response.data);
        } catch (error) {
          console.error(`Error creating column "${columnData.title}":`, error);
        }
      }

      setColumns(createdColumns);
      if (createdColumns.length > 0) {
        toast.success("Created default columns for your board!");
      }
    } catch (error) {
      console.error("Error creating default columns:", error);
      setColumns([]); // Set empty array so user can manually create columns
    }
  };

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeCardId = active.id;
    const overId = over.id;

    // Check if we're dropping on a card or a column
    const isDroppingOnCard = columns.some((col) =>
      col.cards.some((card) => card.id === overId)
    );

    let targetColumnId;
    let newPosition = 0;

    if (isDroppingOnCard) {
      // Dropping on a card - find its column and position
      const targetColumn = columns.find((col) =>
        col.cards.some((card) => card.id === overId)
      );
      if (!targetColumn) {
        setActiveId(null);
        return;
      }
      targetColumnId = targetColumn.id;

      // Find the position of the target card
      const targetCardIndex = targetColumn.cards.findIndex(
        (card) => card.id === overId
      );
      newPosition = targetCardIndex;
    } else {
      // Dropping on a column
      targetColumnId = overId;
      const targetColumn = columns.find((col) => col.id === targetColumnId);
      if (!targetColumn) {
        setActiveId(null);
        return;
      }
      newPosition = targetColumn.cards.length;
    }

    // Find source column
    const sourceColumn = columns.find((col) =>
      col.cards.some((card) => card.id === activeCardId)
    );

    if (!sourceColumn) {
      setActiveId(null);
      return;
    }

    const sourceColumnId = sourceColumn.id;

    try {
      if (sourceColumnId === targetColumnId) {
        // Reordering within the same column
        const sourceIndex = sourceColumn.cards.findIndex(
          (card) => card.id === activeCardId
        );
        const targetIndex = isDroppingOnCard ? newPosition : newPosition;

        // Only reorder if positions are different
        if (sourceIndex !== targetIndex) {
          const reorderedCardIds = [
            ...sourceColumn.cards.map((card) => card.id),
          ];
          const [movedId] = reorderedCardIds.splice(sourceIndex, 1);
          reorderedCardIds.splice(targetIndex, 0, movedId);

          // Call API to reorder cards
          await kanbanService.reorderCards(targetColumnId, reorderedCardIds);

          // Update local state
          const newColumns = columns.map((column) => {
            if (column.id === targetColumnId) {
              const reorderedCards = reorderedCardIds.map((id) =>
                sourceColumn.cards.find((card) => card.id === id)
              );
              return { ...column, cards: reorderedCards };
            }
            return column;
          });

          setColumns(newColumns);
        }
      } else {
        // Moving to a different column
        await kanbanService.moveCard(activeCardId, {
          newColumnId: targetColumnId,
          newOrder: newPosition,
        });

        // Update local state
        const movedCard = sourceColumn.cards.find(
          (card) => card.id === activeCardId
        );

        const newColumns = columns.map((column) => {
          if (column.id === sourceColumnId) {
            // Remove card from source column
            return {
              ...column,
              cards: column.cards.filter((card) => card.id !== activeCardId),
            };
          } else if (column.id === targetColumnId) {
            // Add card to target column
            const newCards = [...column.cards];
            newCards.splice(newPosition, 0, movedCard);
            return { ...column, cards: newCards };
          }
          return column;
        });

        setColumns(newColumns);
      }

      toast.success("Card moved successfully!");
    } catch (error) {
      console.error("Error moving card:", error);
      toast.error("Failed to move card. Please try again.");
      // Reload board data to revert optimistic update
      loadBoard();
    } finally {
      setActiveId(null);
    }
  };

  const handleAddCard = async (columnId) => {
    try {
      const cardData = {
        title: "New Task",
        description: "Task description",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
      };

      const response = await kanbanService.createCard(columnId, cardData);

      // Add the new card to the local state
      const newColumns = columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: [...column.cards, response.data],
          };
        }
        return column;
      });

      setColumns(newColumns);
    } catch (error) {
      console.error("Error creating card:", error);
      // Optionally show error toast here
    }
  };

  const handleEditCard = async (cardId, cardData) => {
    try {
      await kanbanService.updateCard(cardId, cardData);

      // Update the card in local state
      const newColumns = columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === cardId ? { ...card, ...cardData } : card
        ),
      }));

      setColumns(newColumns);
      toast.success("Card updated successfully!");
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card");
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await kanbanService.deleteCard(cardId);

      // Remove the card from local state
      const newColumns = columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),
      }));

      setColumns(newColumns);
      toast.success("Card deleted successfully!");
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card");
    }
  };

  const activeCard = activeId
    ? columns.flatMap((col) => col.cards).find((card) => card.id === activeId)
    : null;

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <KanbanCardSkeleton key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg">
        <DataLoader
          loading={false}
          error={error}
          onRetry={loadBoard}
          emptyMessage="No board data available"
        >
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unable to load board
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again or create a new board.
            </p>
          </div>
        </DataLoader>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {board?.title || "Study Tasks Board"}
          </h2>
          {board?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {board.description}
            </p>
          )}
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => toast.info("Column creation coming soon!")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Column
        </Button>
      </div>

      {columns.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <KanbanSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No columns yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your board is being set up with default columns. Please wait...
          </p>
        </div>
      ) : (
        <div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {columns.map((column) => (
                <SortableContext
                  key={column.id}
                  items={column.cards.map((card) => card.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    column={column}
                    cards={column.cards}
                    onAddCard={handleAddCard}
                    onEditCard={handleEditCard}
                    onDeleteCard={handleDeleteCard}
                  />
                </SortableContext>
              ))}
            </div>

            <DragOverlay>
              {activeCard ? (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 rotate-3 opacity-90">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {activeCard.title}
                  </h4>
                  {activeCard.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activeCard.description}
                    </p>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
