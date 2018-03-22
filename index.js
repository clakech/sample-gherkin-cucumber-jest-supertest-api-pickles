const app = require("./app");

app.listen(process.env.PORT || 1337, () => {
  console.log(`server started ➜ http://localhost:${process.env.PORT || 1337}`);
});
