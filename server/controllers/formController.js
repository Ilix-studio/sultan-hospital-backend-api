import asyncHandler from 'express-async-handler'
import Appointment from '../models/appointmentModel.js'

//view todays appointment
//GET Request - /api/form/todays-appointments
//Private

const viewTodaysAppointments = asyncHandler(async (req, res) => {
  const todayStart = new Date().setHours(0, 0, 0, 0); // Start of today
  const todayEnd = new Date().setHours(23, 59, 59, 999); // End of today

  try {
    let query = Appointment.find().where("date").gte(todayStart).lte(todayEnd);
    const todaysAppointments = await query.exec();

    if (todaysAppointments.length === 0) {
      // Return an empty array if no appointments are found
      return res.status(200).json([]);
    }

    // Return the list of today's appointments if found
    res.status(200).json(todaysAppointments);

  } catch (error) {
    // Handle any errors that occur during data fetching
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// View tomorrow's appointments
// GET Request - /api/form/tomorrows-appointments
// Private

const viewTomorrowsAppointments = asyncHandler(async (req, res) => {
  const today = new Date();
  const tomorrowStart = new Date(today);
  tomorrowStart.setDate(today.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0); // Start of tomorrow

  const tomorrowEnd = new Date(today);
  tomorrowEnd.setDate(today.getDate() + 1);
  tomorrowEnd.setHours(23, 59, 59, 999); // End of tomorrow

  try {
    let query = Appointment.find().where("date").gte(tomorrowStart).lte(tomorrowEnd);
    const tomorrowsAppointments = await query.exec();

    if (tomorrowsAppointments.length === 0) {
      // Return an empty array if no appointments are found
      return res.status(200).json([]);
    }

    // Return the list of tomorrow's appointments if found
    res.status(200).json(tomorrowsAppointments);

  } catch (error) {
    // Handle any errors that occur during data fetching
    console.error("Error fetching tomorrow's appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});


//view all appointment
//GET Request - /api/form/view
//Private

const viewAppointment = asyncHandler(async (req, res) => {
  const { date, sortBy = '-date' } = req.query; // Default to sorting by date in descending order

  let query = Appointment.find();

  if (date) {
    query = query.where('date').equals(date)
  }

  query = query.sort(sortBy);

  try {
    const allAppointments = await query.exec();

    if (allAppointments.length === 0) {
      // Return an empty array if no appointments are found
      return res.status(200).json([]);
    }

    // Return the list of all appointments if found
    res.status(200).json(allAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server Error" });
  }
})

//Create appointment
//POST Request - /api/form/create
//Public

const createAppointment = asyncHandler(async (req, res) => {
  const { patientName, phoneNumber, date, timeSchedule } = req.body

  // Validate required fields
  if (!patientName || !phoneNumber || !date || !timeSchedule) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // Extract only the date part (ignoring time) for comparison
    const startOfDay = new Date(date)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)

    // Check if an appointment already exists for the same phone number and date
    const existingAppointment = await Appointment.findOne({
      phoneNumber,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    if (existingAppointment) {
      return res.status(400).json({
        message: 'An appointment already exists for this date and phone number',
      })
    }

    const newAppointment = new Appointment({
      patientName,
      phoneNumber,
      date,
      timeSchedule,
    })

    const appointmentCreated = await newAppointment.save()

    if (!appointmentCreated) {
      throw new Error('Failed to save appointment')
    }

    res.status(201).json(appointmentCreated)
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to create appointment: ${error.message}` })
  }
})

//update an appointment
//PUT Request - /api/form/update/:id
//private

const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { patientName, phoneNumber, timeSchedule, date } = req.body;

  try {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Check if an appointment already exists for the same phone number and date
    const existingAppointment = await Appointment.findOne({
      phoneNumber,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (existingAppointment && existingAppointment._id.toString() !== id) {
      return res.status(400).json({ message: "An appointment already exists for this date and phone number" });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id },
      {
        patientName,
        phoneNumber,
        timeSchedule,
        date,
      },
      { new: true }
    );

    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404);
      throw new Error("Appointment not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//delete appointment
//DEL Request - /api/form/delete/:id
//private

const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params

  const appointment = await Appointment.findById(id)

  if (appointment) {
    await appointment.deleteOne()
    res.json({ message: 'Appointment removed' })
  } else {
    res.status(404)
    throw new Error('Appointment not found')
  }
});

//view a single appointment 
//GET Request - /api/form//view/:id
//Private

const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});



export {
  viewTodaysAppointments,
  viewTomorrowsAppointments,
  createAppointment,
  viewAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentById
};




