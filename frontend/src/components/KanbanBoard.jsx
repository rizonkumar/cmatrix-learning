import React, { useState, useEffect, useCallback } from "react";
import {
  Edit,
  Trash2,
  X,
  AlertTriangle,
  KanbanSquare,
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
        {...attributes}
        {...listeners}
        className={`bg-white dark:bg-gray-800 border-l-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-4 group relative w-full cursor-move ${getPriorityColor(
          card.priority
        )} ${isDragging ? "opacity-50 rotate-1 shadow-xl scale-105" : ""}`}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate leading-tight">
              {card.title || "Untitled Card"}
            </h4>
            {card.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {card.description}
              </p>
            )}
          </div>

          {/* Drag Indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
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
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md">
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
                e.preventDefault();
                e.stopPropagation();
                onEdit(card);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title="Edit Card"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(card);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
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
const KanbanColumn = ({ column, cards, onEditCard, onDeleteCard }) => {
  const columnId = column.id || column._id;
  const { setNodeRef, isOver } = useSortable({
    id: columnId,
    disabled: true, // Disable column sorting to focus on card movement
  });

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
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 min-h-[600px] w-full shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div
              className={`w-4 h-4 rounded-full flex-shrink-0 shadow-sm ${getColumnColor(
                column.color
              )}`}
            />
            <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">
              {column.title}
            </h3>
            <span className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0 shadow-sm">
              {cards.length}
            </span>
          </div>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 min-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent transition-colors duration-200 ${
          isOver ? "bg-blue-50 dark:bg-blue-900/20 rounded-b-2xl" : ""
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

        {/* Empty state when no cards */}
        {cards.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <KanbanSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No tasks yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Add tasks to get started
              </p>
            </div>
          </div>
        )}
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

      // Create columns sequentially to ensure proper ordering
      for (const columnData of defaultColumns) {
        try {
          const response = await kanbanService.createColumn(
            boardId,
            columnData
          );
          createdColumns.push(response);
        } catch (error) {
          console.error(`Error creating column "${columnData.title}":`, error);
          // Continue with other columns even if one fails
        }
      }

      // Filter out any null/undefined responses
      const validColumns = createdColumns.filter((col) => col);

      if (validColumns.length > 0) {
        setColumns(validColumns);
        toast.success(
          `Created ${validColumns.length} default columns for your board!`
        );
      } else {
        setColumns([]);
        toast.error("Failed to create default columns. Please try again.");
      }
    } catch (error) {
      console.error("Error creating default columns:", error);
      setColumns([]);
      toast.error("Failed to create default columns");
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

  const handleDeleteCard = async (card) => {
    try {
      const cardId = card.id || card._id;
      if (!cardId) {
        toast.error("Invalid card ID");
        return;
      }

      await kanbanService.deleteCard(cardId);

      const newColumns = columns.map((column) => ({
        ...column,
        cards: column.cards.filter((cardItem) => {
          const currentCardId = cardItem.id || cardItem._id;
          return currentCardId !== cardId;
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
        distance: 3, // Reduced from 8 to make dragging easier
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to find column by card ID
  const findColumnByCardId = (cardId) => {
    return columns.find((col) =>
      col.cards?.some((card) => {
        const currentCardId = card.id || card._id;
        return currentCardId === cardId;
      })
    );
  };

  // Helper function to find card by ID
  const findCardById = (cardId) => {
    for (const column of columns) {
      const card = column.cards?.find((card) => {
        const currentCardId = card.id || card._id;
        return currentCardId === cardId;
      });
      if (card) return card;
    }
    return null;
  };

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

    // Find source column and card
    const sourceColumn = findColumnByCardId(activeCardId);
    const movedCard = findCardById(activeCardId);

    if (!sourceColumn || !movedCard) {
      console.error(
        "Could not find source column or card for ID:",
        activeCardId
      );
      setActiveId(null);
      return;
    }

    const sourceColumnId = sourceColumn.id || sourceColumn._id;

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
      // Dropping on a card - find the target column and position
      const targetColumn = findColumnByCardId(overId);
      if (!targetColumn) {
        setActiveId(null);
        return;
      }

      targetColumnId = targetColumn.id || targetColumn._id;
      const targetCardIndex = targetColumn.cards.findIndex((card) => {
        const cardId = card.id || card._id;
        return cardId === overId;
      });
      newPosition = targetCardIndex;
    } else {
      // Dropping on a column
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

    // Find source index
    const sourceIndex = sourceColumn.cards.findIndex((card) => {
      const cardId = card.id || card._id;
      return cardId === activeCardId;
    });

    // If same column, check if position changed
    if (sourceColumnId === targetColumnId) {
      if (sourceIndex === newPosition) {
        setActiveId(null);
        return; // No change needed
      }
    }

    try {
      if (sourceColumnId === targetColumnId) {
        // Same column reordering
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
      } else {
        // Moving to different column
        await kanbanService.moveCard(activeCardId, {
          newColumnId: targetColumnId,
          newOrder: newPosition,
        });

        // Update local state
        const newColumns = columns.map((column) => {
          const columnActualId = column.id || column._id;
          if (columnActualId === sourceColumnId) {
            // Remove card from source column
            return {
              ...column,
              cards: column.cards.filter((card) => {
                const cardId = card.id || card._id;
                return cardId !== activeCardId;
              }),
            };
          } else if (columnActualId === targetColumnId) {
            // Add card to target column
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
      // Refresh board data on error
      loadBoard();
    } finally {
      setActiveId(null);
    }
  };

  // Get the active card for drag overlay
  const activeCard = activeId
    ? columns
        .flatMap((col) => col.cards || [])
        .find((card) => card.id === activeId || card._id === activeId)
    : null;

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[600px]">
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 min-h-[500px] shadow-sm"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse"></div>
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-full w-10 animate-pulse"></div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm"
                    >
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </div>
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
          <div className="animate-pulse flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Unable to load board
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {error}
          </p>
          <Button
            onClick={loadBoard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[600px] overflow-hidden">
      {/* Content */}
      <div className="p-4 sm:p-6 flex-1 overflow-hidden">
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
            modifiers={[]} // No modifiers to allow free movement
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 h-full">
              <div className="col-span-full flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {/* Single SortableContext for all columns to allow cross-column movement */}
                <SortableContext
                  items={columns.flatMap(
                    (column) =>
                      column.cards?.map((card) => card.id || card._id) || []
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  {columns.map((column) => (
                    <div
                      key={column.id || column._id}
                      className="flex-shrink-0 w-80"
                    >
                      <KanbanColumn
                        column={column}
                        cards={column.cards || []}
                        onEditCard={handleEditCard}
                        onDeleteCard={handleDeleteCard}
                      />
                    </div>
                  ))}
                </SortableContext>
              </div>
            </div>

            <DragOverlay>
              {activeCard ? (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 rotate-3 opacity-95 transform backdrop-blur-sm scale-105">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {activeCard.title}
                    </h4>
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                  {activeCard.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activeCard.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    {activeCard.priority && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activeCard.priority === "high"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            : activeCard.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        <Flag className="w-3 h-3 inline mr-1" />
                        {activeCard.priority}
                      </span>
                    )}
                    {activeCard.dueDate && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(activeCard.dueDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Edit Card Modal */}
      {editingCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Edit Card
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update your task details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingCard(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <Input
                label="Card Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Enter task title"
                required
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
                  placeholder="Describe your task (optional)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingCard(null)}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  disabled={!editForm.title.trim()}
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
