import mongoose from 'mongoose'

const appointmentSchema = mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSchedule: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)
const Appointment = mongoose.model('Appointment', appointmentSchema)
export default Appointment
