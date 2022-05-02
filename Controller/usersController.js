

const bcrypt = require('bcrypt')

const userModel = require("../Model/userModel");
const HttpError = require("../Model/util/httpError");

const getUsers = async (req, res, next) => {
  console.log(req.body);
  let users;
  try {
    users = await userModel.find({});
  } catch (err) {
    console.log(err);
    const error = new HttpError("Ooops An error Occured", 500);
    return next(error);
  }
  if (!users) {
    const error = new HttpError("Don't have the right MF", 403);
    return next(error);
  }
  console.log(users);

  res.status(200).json({
    users: users.map((elem) => elem.toObject({ getters: true })),
  });
};
const postUsers = async (req, res, next) => {
  console.log(req.body);
  if (req.body.email == null) {
    const error = new HttpError("Bad Email",400);
    return next(error);
  }
  const hashedPassword=await bcrypt.hash(req.body.password,10); //a pwd with a 10 salt
  const newUser = new userModel({
    name: (req.body.name?req.body.name:"anonym"),
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error: email already in use", 500);
    return next(error);
  }
  res.status(201).json({
    status: "ok",
  });
};
const login = async (req, res, next) => {
  console.log(req.body);
};
exports.getUsers = getUsers;
exports.postUsers = postUsers;
exports.login = login;
/* 
//login routes
app.get('/users', (req, res) => {
    res.json(users)
  })
  
  app.post('/users', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = { name: req.body.name, password: hashedPassword }
      users.push(user)
      res.status(201).send()
    } catch {
      res.status(500).send()
    }
  })
  
  app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
      } else {
        res.send('Not Allowed')
      }
    } catch {
      res.status(500).send()
    }
  })
   */
