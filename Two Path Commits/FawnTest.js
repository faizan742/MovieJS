const mongoose = require('mongoose');
const Fawn = require("fawn");
require("dotenv").config();

async function performTransaction() {
  try {
    //await mongoose.connect("mongodb://127.0.0.1:27017/Movie");

    Fawn.init("mongodb://127.0.0.1:27017/Movie");

    const task = Fawn.Task();
    console.log(task);

    await task
      .update("Accounts", { Name: "FAIZAN" }, { $inc: { Balances: -20 } })
      .update("Accounts", { Name: "ZIA" }, { $inc: { Balances: 20 } })
      .run()
      .then(function (results) {
        const firstUpdateResult = results[0];
        const secondUpdateResult = results[1];
        console.log(firstUpdateResult);
        console.log(secondUpdateResult);
      });

    mongoose.disconnect(); // Close the connection when done
  } catch (error) {
    console.error(error);
  }
}

performTransaction();
