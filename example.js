const NotExpress = require("./src/main");
const ApiRoute = require("./routes/api");
const app = new NotExpress();
//NotExpress.prototype.static('public')
app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use("/api", ApiRoute);
app.use("/hello", (req, res) => {
  console.log("This is app.use()");
});

// next param is apparently useless right now
function testMid(req, res, next) {
  console.log("This is req.body ", req.body);
  next();
}

function anotherOne(req, res, next) {
  console.log("another middleware");
  next();
}

app.get("/ejs", (req, res) => {
  res.render("test");
});

app.get("/hi", (req, res) => {
  res.end("HI [GET]");
});

app.get("/posts/:id/:post", anotherOne, (req, res) => {
  console.log("May have been redirected here");
  res.end("Testing req.params");
});

app.get("/hello", testMid, anotherOne, (req, res) => {
  console.log(req.params);
  console.log("Request header: ", req.get("content-TyPe"));
  //console.log(`req.accepts(): ${req.accepts("json")}`);
  res.redirect("/posts/12/posts/12");
  console.log("This should be the end");
  res.end("Hi");
});
app.post("/hi", (req, res) => {
  console.log(req.body.name);
  console.log(req.params.message);
  res.status(201).json({ message: "Hello" });
});
/*
app.delete('/delete', (req,res) => {
  res.status(200).json({
    message: 'Delete success'
  })
})
*/
app.put("/put", (req, res) => {
  res.status(200).json({
    message: "Put success",
  });
});

app.get("/file", (req, res) => {
  res.sendFile("./index.html");
});
app.listen(4000, () => {
  console.log(`Server running on port 4000`);
});
