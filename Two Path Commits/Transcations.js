const { MongoClient } = require('mongodb');

// Replace the connection string with your MongoDB connection string
const uri =  'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=myReplicaSet/';
const client = new MongoClient(uri);

async function coreTest(client) {
  try {
    await client.connect();

    const session = client.startSession();
    try {
      session.startTransaction();

      const savingsColl = client.db("Movie").collection("Accounts");
      await savingsColl.findOneAndUpdate(
        { Name: "Faizan" },
        { $inc: { Balances: -100 } },
        { session }
      );

      const checkingColl = client.db("Movie").collection("History");
      await checkingColl.findOneAndUpdate(
        { Name: "ZIA" },
        { $inc: { Balances: 100 } },
        { session }
      );

      

      await session.commitTransaction();
      console.log("Transaction committed.");
    } catch (error) {
      console.log("An error occurred during the transaction:" + error);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    await client.close();
  }
}

coreTest(client);
