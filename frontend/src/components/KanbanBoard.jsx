import React, { useState, useEffect } from "react";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Flag,
  GripVertical,
} from "lucide-react";
import Button from "./common/Button";
import { kanbanService } from "../services/kanbanService";
import { DataLoader } from "./common/LoadingSpinner";
import { KanbanCardSkeleton } from "./common/SkeletonLoader";

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

          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add dropdown menu for edit/delete
            }}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ column, cards, onAddCard }) => {
  const { setNodeRef, isOver } = useSortable({ id: column.id });

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[400px]">
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
            onEdit={() => {}}
            onDelete={() => {}}
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
      setBoard(response.data.board);
      setColumns(response.data.columns || []);
    } catch (err) {
      setError("Failed to load board data");
      console.error("Error loading board:", err);
    } finally {
      setLoading(false);
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

    const activeId = active.id;
    const overId = over.id;

    // Find the active card and its current column
    let activeColumnId = null;
    let activeCardIndex = -1;

    columns.forEach((column) => {
      const cardIndex = column.cards.findIndex((card) => card.id === activeId);
      if (cardIndex !== -1) {
        activeColumnId = column.id;
        activeCardIndex = cardIndex;
      }
    });

    if (!activeColumnId) {
      setActiveId(null);
      return;
    }

    // Find target column
    const targetColumn = columns.find((col) => col.id === overId);
    if (!targetColumn) {
      setActiveId(null);
      return;
    }

    try {
      if (activeColumnId === targetColumn.id) {
        // Reordering within the same column
        const oldIndex = activeCardIndex;
        const newIndex = targetColumn.cards.length;

        // Call API to reorder cards
        await kanbanService.reorderCards(
          targetColumn.id,
          targetColumn.cards.map((card) => card.id)
        );

        const newColumns = columns.map((column) => {
          if (column.id === activeColumnId) {
            const newCards = arrayMove(column.cards, oldIndex, newIndex);
            return { ...column, cards: newCards };
          }
          return column;
        });

        setColumns(newColumns);
      } else {
        // Moving to a different column
        // Call API to move card
        await kanbanService.moveCard(activeId, {
          newColumnId: targetColumn.id,
          newOrder: targetColumn.cards.length,
        });

        const newColumns = columns.map((column) => {
          if (column.id === activeColumnId) {
            // Remove card from source column
            const newCards = column.cards.filter(
              (card) => card.id !== activeId
            );
            return { ...column, cards: newCards };
          } else if (column.id === targetColumn.id) {
            // Add card to target column
            const sourceColumn = columns.find(
              (col) => col.id === activeColumnId
            );
            const movedCard = sourceColumn.cards.find(
              (card) => card.id === activeId
            );
            const newCards = [...column.cards, movedCard];
            return { ...column, cards: newCards };
          }
          return column;
        });

        setColumns(newColumns);
      }
    } catch (error) {
      console.error("Error moving card:", error);
      // Optionally show error toast here
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
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {board?.title || "Study Tasks Board"}
        </h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Column
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  );
};

export default KanbanBoard;
