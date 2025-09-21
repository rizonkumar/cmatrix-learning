import React, { useState, useEffect, useCallback } from "react";
import {
  Edit,
  Trash2,
  X,
  AlertTriangle,
  KanbanSquare,
  Plus,
  Calendar,
  Flag,
  GripVertical,
  Save,
} from "lucide-react";
import Button from "./common/Button";
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
import { kanbanService } from "../services/kanbanService";
import { toast } from "react-hot-toast";
import Input from "./common/Input";

// Clean Card Component with visible edit/delete icons
const KanbanCard = ({ card, onEdit, onDelete }) => {
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
        return "border-l-red-500 bg-red-50 dark:bg-red-900/10";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10";
      case "low":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/10";
      default:
        return "border-l-gray-300 bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white dark:bg-gray-800 border-l-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 group relative w-full ${getPriorityColor(
          card.priority
        )} ${isDragging ? "opacity-50 rotate-1 shadow-lg" : ""}`}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
              {card.title || "Untitled Card"}
            </h4>
            {card.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {card.description}
              </p>
            )}
          </div>

          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {card.priority && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  card.priority === "high"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : card.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                <Flag className="w-3 h-3 inline mr-1" />
                {card.priority}
              </span>
            )}

            {card.dueDate && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(card.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Action Buttons - Always visible */}
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              title="Edit Card"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              title="Delete Card"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Clean Column Component
const KanbanColumn = ({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) => {
  const columnId = column.id || column._id;
  const { setNodeRef, isOver } = useSortable({ id: columnId });

  const getColumnColor = (color) => {
    const colorMap = {
      "#EF4444": "bg-red-500",
      "#F59E0B": "bg-yellow-500",
      "#10B981": "bg-green-500",
      "#3B82F6": "bg-blue-500",
      "#8B5CF6": "bg-purple-500",
      "#EC4899": "bg-pink-500",
    };
    return colorMap[color] || "bg-blue-500";
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[600px] w-full min-w-[280px] max-w-[400px] flex flex-col">
      {/* Column Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 ${getColumnColor(
                column.color
              )}`}
            />
            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
              {column.title}
            </h3>
            <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 flex-shrink-0">
              {cards.length}
            </span>
          </div>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 sm:p-4 min-h-[400px] overflow-y-auto ${
          isOver ? "bg-blue-50 dark:bg-blue-900/20" : ""
        }`}
      >
        <div className="space-y-3">
          {cards.map((card) => (
            <KanbanCard
              key={card.id || card._id}
              card={card}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
          ))}
        </div>

        {/* Add Card Button - Fixed positioning */}
        <div className="mt-4 flex-shrink-0">
          <button
            onClick={() => onAddCard(columnId)}
            className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 flex items-center justify-center text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Kanban Board Component
const KanbanBoard = ({ boardId }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const loadBoard = useCallback(async () => {
    if (!boardId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await kanbanService.getBoardById(boardId);

      if (response && response.board) {
        const boardColumns = response.columns || [];

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
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const createDefaultColumns = async (boardId) => {
    try {
      const defaultColumns = [
        { title: "To Study", color: "#EF4444", order: 0 },
        { title: "In Progress", color: "#F59E0B", order: 1 },
        { title: "Completed", color: "#10B981", order: 2 },
        { title: "Revision", color: "#3B82F6", order: 3 },
      ];

      const createdColumns = [];

      for (const columnData of defaultColumns) {
        try {
          const response = await kanbanService.createColumn(
            boardId,
            columnData
          );
          createdColumns.push(response);
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
      setColumns([]);
    }
  };

  // Card editing functions
  const handleEditCard = (card) => {
    setEditingCard(card);
    setEditForm({
      title: card.title || "Untitled Card",
      description: card.description || "",
      priority: card.priority || "medium",
      dueDate: card.dueDate
        ? new Date(card.dueDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleSaveCard = async () => {
    if (!editingCard) return;

    try {
      const cardId = editingCard.id || editingCard._id;
      await kanbanService.updateCard(cardId, editForm);

      // Update local state
      const newColumns = columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) => {
          const currentCardId = card.id || card._id;
          const editingCardId = editingCard.id || editingCard._id;
          return currentCardId === editingCardId
            ? { ...card, ...editForm }
            : card;
        }),
      }));

      setColumns(newColumns);
      setEditingCard(null);
      toast.success("Card updated successfully!");
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card");
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const actualCardId = cardId.id || cardId._id || cardId;
      await kanbanService.deleteCard(actualCardId);

      const newColumns = columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => {
          const currentCardId = card.id || card._id;
          return currentCardId !== actualCardId;
        }),
      }));

      setColumns(newColumns);
      toast.success("Card deleted successfully!");
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card");
    }
  };

  useEffect(() => {
    loadBoard();
  }, [boardId, loadBoard]);

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
      col.cards?.some((card) => {
        const cardId = card.id || card._id;
        return cardId === overId;
      })
    );

    let targetColumnId;
    let newPosition = 0;

    if (isDroppingOnCard) {
      const targetColumn = columns.find((col) =>
        col.cards?.some((card) => {
          const cardId = card.id || card._id;
          return cardId === overId;
        })
      );
      if (!targetColumn) {
        setActiveId(null);
        return;
      }
      const targetColumnActualId = targetColumn.id || targetColumn._id;
      targetColumnId = targetColumnActualId;

      const targetCardIndex = targetColumn.cards.findIndex((card) => {
        const cardId = card.id || card._id;
        return cardId === overId;
      });
      newPosition = targetCardIndex;
    } else {
      targetColumnId = overId;
      const targetColumn = columns.find((col) => {
        const colId = col.id || col._id;
        return colId === targetColumnId;
      });
      if (!targetColumn) {
        setActiveId(null);
        return;
      }
      newPosition = targetColumn.cards?.length || 0;
    }

    const sourceColumn = columns.find((col) =>
      col.cards?.some((card) => {
        const cardId = card.id || card._id;
        return cardId === activeCardId;
      })
    );

    if (!sourceColumn) {
      setActiveId(null);
      return;
    }

    const sourceColumnActualId = sourceColumn.id || sourceColumn._id;

    try {
      if (sourceColumnActualId === targetColumnId) {
        const sourceIndex = sourceColumn.cards.findIndex((card) => {
          const cardId = card.id || card._id;
          return cardId === activeCardId;
        });

        if (sourceIndex !== newPosition) {
          const reorderedCardIds = [
            ...sourceColumn.cards.map((card) => card.id || card._id),
          ];
          const [movedId] = reorderedCardIds.splice(sourceIndex, 1);
          reorderedCardIds.splice(newPosition, 0, movedId);

          await kanbanService.reorderCards(targetColumnId, reorderedCardIds);

          const newColumns = columns.map((column) => {
            const columnActualId = column.id || column._id;
            if (columnActualId === targetColumnId) {
              const reorderedCards = reorderedCardIds.map((id) =>
                sourceColumn.cards.find((card) => {
                  const cardId = card.id || card._id;
                  return cardId === id;
                })
              );
              return { ...column, cards: reorderedCards };
            }
            return column;
          });

          setColumns(newColumns);
        }
      } else {
        await kanbanService.moveCard(activeCardId, {
          newColumnId: targetColumnId,
          newOrder: newPosition,
        });

        const movedCard = sourceColumn.cards.find((card) => {
          const cardId = card.id || card._id;
          return cardId === activeCardId;
        });

        const newColumns = columns.map((column) => {
          const columnActualId = column.id || column._id;
          if (columnActualId === sourceColumnActualId) {
            return {
              ...column,
              cards: column.cards.filter((card) => {
                const cardId = card.id || card._id;
                return cardId !== activeCardId;
              }),
            };
          } else if (columnActualId === targetColumnId) {
            const newCards = [...(column.cards || [])];
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
        const currentColumnId = column.id || column._id;
        const targetColumnId = columnId.id || columnId._id || columnId;

        if (currentColumnId === targetColumnId) {
          return {
            ...column,
            cards: [...(column.cards || []), response.data || response],
          };
        }
        return column;
      });

      setColumns(newColumns);
      toast.success("Card created successfully!");
    } catch (error) {
      console.error("Error creating card:", error);
      toast.error("Failed to create card. Please try again.");
    }
  };

  // Get the active card for drag overlay
  const activeCard = activeId
    ? columns
        .flatMap((col) => col.cards || [])
        .find((card) => card.id === activeId)
    : null;

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[600px]">
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mb-3"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[500px]"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-8 animate-pulse"></div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[400px]">
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mb-3"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
        </div>
        <div className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Unable to load board
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button
            onClick={loadBoard}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[600px]">
      {/* Header - Clean, no text */}
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Removed board title and description */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex-1">
        {columns.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <KanbanSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Setting up your board...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Creating default columns for your study tasks.
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 h-full">
              <div className="col-span-full flex gap-4 sm:gap-6 overflow-x-auto pb-4">
                {columns.map((column) => (
                  <div key={column.id || column._id} className="flex-shrink-0">
                    <SortableContext
                      items={
                        column.cards?.map((card) => card.id || card._id) || []
                      }
                      strategy={verticalListSortingStrategy}
                    >
                      <KanbanColumn
                        column={column}
                        cards={column.cards || []}
                        onAddCard={handleAddCard}
                        onEditCard={handleEditCard}
                        onDeleteCard={handleDeleteCard}
                      />
                    </SortableContext>
                  </div>
                ))}
              </div>
            </div>

            <DragOverlay>
              {activeCard ? (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 rotate-3 opacity-95 transform">
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
        )}
      </div>

      {/* Edit Card Modal */}
      {editingCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit Card
              </h3>
              <button
                onClick={() => setEditingCard(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Card description"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setEditingCard(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCard}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
