import { Router } from "express";
import { todoController } from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sanitizeInput } from "../middlewares/validation.middleware.js";

const router = Router();

// Apply authentication and input sanitization to all routes
router.use(verifyJWT);
router.use(sanitizeInput);

// Todo CRUD operations
router
  .route("/")
  .get(todoController.getMyTodos)
  .post(todoController.createTodo);

router
  .route("/:todoId")
  .get(todoController.getTodoById)
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo);

// Toggle completion status
router.route("/:todoId/toggle").patch(todoController.toggleTodoStatus);

// Bulk operations
router.route("/bulk/update").patch(todoController.bulkUpdateTodos);

router.route("/bulk/delete").delete(todoController.bulkDeleteTodos);

// Statistics and analytics
router.route("/stats").get(todoController.getTodoStats);

router.route("/upcoming").get(todoController.getUpcomingTodos);

export default router;
