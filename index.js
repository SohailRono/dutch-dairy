const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('products'));
app.use(fileUpload({ createParentPath: true }));
const port = 5000;

app.get('/', (req, res) => {
  res.send("hello from db it's working working fffff");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.on0vi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db('dutch').collection('products');
  const usersCollection = client.db('dutch').collection('users');

  // productsCollection.insertOne(bf).then((result) => {
  //   console.log(result);
  // });

  app.get('/products', (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      // console.log(documents);
      res.send(documents);
    });
  });

  app.post('/addProduct', (req, res) => {
    // const file = req.files.img;

    const name = req.body.name;
    const category = req.body.category;

    const purchasePrice = req.body.purchasePrice;
    const cost = req.body.cost;
    const price = req.body.price;
    const breed = req.body.breed;
    const tag = req.body.tag;
    const weight = req.body.weight;

    const countInStock = req.body.countInStock;
    const custName = req.body.custName;
    const custPhone = req.body.custPhone;
    const custAddress = req.body.custAddress;

    const sellerName = req.body.sellerName;
    const sellerAddress = req.body.sellerAddress;
    const purchaseDate = req.body.purchaseDate;

    // const newImg = file.data;
    // const encImg = newImg.toString('base64');

    // var image = {
    //   contentType: file.mimetype,
    //   size: file.size,
    //   img: Buffer.from(encImg, 'base64'),
    // };

    console.log(
      name,
      category,
      purchasePrice,
      cost,
      price,
      breed,
      tag,
      weight,
      countInStock,
      custName,
      custPhone,
      custAddress,
      sellerName,
      sellerAddress,
      purchaseDate
    );

    productsCollection
      .insertOne({
        name,
        category,
        purchasePrice,
        cost,
        price,
        breed,
        tag,
        weight,
        countInStock,
        custName,
        custPhone,
        custAddress,
        sellerName,
        sellerAddress,
        purchaseDate,
      })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    usersCollection
      .find({ email: email, password: password })
      .toArray((err, documents) => {
        console.log(email, password);
        res.send(documents.length > 0);
      });
  });

  app.delete('/delete', (req, res) => {
    const _id = req.body._id;
    console.log(_id);
    // productsCollection.deleteOne(_id);
    // res.status(200).json({
    //   success: true,
    //   message: `Category has been deleted successfully!`,
    // });
  });
  // perform actions on the collection object
  //   client.close();
});

app.listen(process.env.PORT || port);
