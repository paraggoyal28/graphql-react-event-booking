const Booking = require("../../models/Booking");
const Event = require("../../models/event");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const bookings = await Booking.find({user: req.userId});
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const booking = await Booking.findByIdAndDelete(args.bookingId).populate(
        "event"
      );
      return transformEvent(booking.event);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
