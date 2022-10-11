const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true],
  },
  date: {
    type: String,
    required: [false],
  },
  emailDate: {
    type: String,
    required: [false],
  },
  upserveId: {
    type: String,
    required: [false],
  },
  sevenRoomsId: {
    type: String,
    required: [false],
  },
  venue: {
    type: String,
    required: [false],
  },
  reservationsList: {
    type: Object,
    required: [false],
  },
  upserveInfo: {
    type: Object,
    required: [false],
  },
});

//this method search for a reservation by email
reservationSchema.statics.findByReservationByUpserveId = async (upserveId) => {
  const reservation = await Reservation.find({ upserveId });
  console.log(reservation);
  if (!reservation) {
    throw new Error({ error: "invalid reservation id" });
  }

  return reservation;
};

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
