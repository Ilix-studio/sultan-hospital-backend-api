import express from 'express'
import {
  createAppointment,
  viewAppointment,
  updateAppointment,
  deleteAppointment,
  viewTodaysAppointments,
  getAppointmentById,
  viewTomorrowsAppointments,
} from "../controllers/formController.js";
import verifyJWT from "../middleware/verifyJwt.js";
const router = express.Router();

router.post("/create", createAppointment);
router.get("/todays-appointments",verifyJWT,viewTodaysAppointments);
router.get("/tomorrows-appointments",verifyJWT,viewTomorrowsAppointments);
router.get("/view", verifyJWT, viewAppointment);
router.put("/update/:id", verifyJWT, updateAppointment);
router.delete("/delete/:id", verifyJWT, deleteAppointment);
router.get('/view/:id', verifyJWT, getAppointmentById);

export default router
