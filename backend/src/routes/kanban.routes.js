import { Router } from "express";
import { kanbanController } from "../controllers/kanban.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sanitizeInput } from "../middlewares/validation.middleware.js";

const router = Router();

// Apply authentication and input sanitization to all routes
router.use(verifyJWT);
router.use(sanitizeInput);

// Board routes
router
  .route("/boards")
  .get(kanbanController.getMyBoards)
  .post(kanbanController.createBoard);

router
  .route("/boards/:boardId")
  .get(kanbanController.getBoardById)
  .put(kanbanController.updateBoard)
  .delete(kanbanController.deleteBoard);

// Board statistics
router.route("/boards/:boardId/stats").get(kanbanController.getBoardStats);

// Column routes
router.route("/boards/:boardId/columns").post(kanbanController.createColumn);

router
  .route("/columns/:columnId")
  .put(kanbanController.updateColumn)
  .delete(kanbanController.deleteColumn);

// Column reordering
router
  .route("/boards/:boardId/columns/reorder")
  .patch(kanbanController.reorderColumns);

// Card routes
router.route("/columns/:columnId/cards").post(kanbanController.createCard);

router
  .route("/cards/:cardId")
  .put(kanbanController.updateCard)
  .delete(kanbanController.deleteCard);

// Card operations
router.route("/cards/:cardId/move").patch(kanbanController.moveCard);

// Card reordering within column
router
  .route("/columns/:columnId/cards/reorder")
  .patch(kanbanController.reorderCards);

export default router;
