const mongoose = require("mongoose");

if (process.argv.length < 3) {
  throw Error("Please provide a password");
}

console.log(process.argv);

const password = process.argv[2];

const url = `mongodb+srv://hectormb:${password}@part3.uv0ec8s.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3];
const number = process.argv[4];

mongoose
  .connect(url)
  .then(async () => {
    if (name) {
      const contact = new Person({
        name,
        number,
      });

      return contact.save();
    } else {
      let db = await Person.find({});
      console.log(db);
    }
  })
  .then(() => {
    if (name) {
      console.log(`Added ${name} number ${number} to phonebook`);
    }

    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
