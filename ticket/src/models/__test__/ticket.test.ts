import Ticket from "../ticket";

it("should update version when updating a doc", async function () {
  const ticket = Ticket.build({ title: "test", price: 123, userId: "1" });
  await ticket.save();
  const ticketOne = await Ticket.findOne({
    title: "test",
    price: 123,
    userId: "1",
  });
  const ticketTwo = await Ticket.findOne({
    title: "test",
    price: 123,
    userId: "1",
  });
  ticketOne!.title = "One Rec";
  ticketTwo!.title = "Two Rec";

  await ticketOne!.save();
  try {
    await ticketTwo!.save();
  } catch (e) {
    return;
  }
});
