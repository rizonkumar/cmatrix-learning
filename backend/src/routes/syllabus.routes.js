import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { sanitizeInput } from "../middlewares/validation.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles("admin"));

router.use(sanitizeInput);

router
  .route("/syllabi")
  .get(adminController.getAllSyllabi)
  .post(adminController.createSyllabus);

router
  .route("/syllabi/:syllabusId")
  .get(adminController.getSyllabusById)
  .put(adminController.updateSyllabus)
  .delete(adminController.deleteSyllabus);

router
  .route("/syllabi/:syllabusId/toggle-active")
  .patch(adminController.toggleSyllabusActive);

router
  .route("/syllabi/class/:classLevel")
  .get(adminController.getSyllabiByClassLevel);

router
  .route("/syllabi/class/:classLevel/active")
  .get(adminController.getActiveSyllabus);

router.route("/syllabi/bulk-update").patch(adminController.bulkUpdateSyllabi);

// Add subject to existing syllabus
router
  .route("/syllabi/:syllabusId/subjects")
  .post(adminController.addSubjectToSyllabus);

// Add chapter to existing subject in syllabus
router
  .route("/syllabi/:syllabusId/subjects/:subjectName/chapters")
  .post(adminController.addChapterToSubject);

// Delete chapter from subject in syllabus
router
  .route("/syllabi/:syllabusId/subjects/:subjectName/chapters/:chapterTitle")
  .delete(adminController.deleteChapterFromSubject);

export default router;
