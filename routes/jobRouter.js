import { Router } from "express";
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from "../controllers/jobController.js";
import { validateJobInput } from "../middleware/validationMiddleware.js";
import { validateIdParam } from "../middleware/validationMiddleware.js";
import { checkForTestUser } from "../middleware/authmiddleware.js";
const router = Router();

router
  .route("/")
  .get(getAllJobs)
  .post(checkForTestUser, validateJobInput, createJob);
router.route("/stats").get(showStats);
router
  .route("/:id")
  .get(validateIdParam, getJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForTestUser, validateIdParam, deleteJob);

// // Get all Jobs
// app.get("/", getAllJobs);
// // Create Job
// app.post("/", createJob);
// //Get single job
// app.get("/:id", getJob);
// // Edit job
// app.patch("/:id", updateJob);
// // Delete job
// app.delete("/:id", deleteJob);

export default router;
