const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId,
    });
    try {
      const result = await event.save();
      const createdEvent = transformEvent(result);
      const creatorUser = await User.findById(req.userId);
      creatorUser.createdEvents.push(event);
      await creatorUser.save();
      return createdEvent;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
