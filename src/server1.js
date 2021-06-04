import express from "express";

// const app = express();

// const PORT = 5000;

const urlMiddleware = (req, res, next) => {
  console.log("Path:", req.url);
  console.log(req.protocol);
  next();
};

const timeMiddleware = (req, res, next) => {
  const [month , date ,year] = new Date().toLocaleDateString("en-US").split("/");
   console.log("Time:",`${year}.${month}.${date}`);
  next();
};

const protectedMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  next();
};

// const secureMiddleware = (req, res ,next) =>{
//     const protocol = req.protocol
//     if (console.dir(protocol === "https")) {
//      console.log("SECURE ⭕")
//     }else{
//     console.log("INSECURE ❌")
//     }
//     next();
// }

app.use(urlMiddleware, timeMiddleware, protectedMiddleware);

app.get("/", (req, res) => res.send("<h1>Home</h1>"));
app.get("/protected", (req, res) => res.send("<h1>Protected</h1>"));

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);


// // Codesandbox gives us a PORT :)
// app.listen(PORT, () => `Listening!✅`);
