const Product = require("../model/product");
const Category = require("../model/category");

const checkProduct = (productExists, paramaters) => {
  let _id;
  return new Promise(function (resolve, reject) {
    if (productExists) {
      _id = productExists._id;
      Product.updateOne(
        { name: paramaters.name },
        {
          $push: { address: paramaters.address },
          $inc: { quantity: paramaters.quantity },
        },
        function (err, data) {
          if (err) {
            reject(err);
          }
        }
      );
      resolve(_id);
    } else {
      const product = new Product({
        name: paramaters.name,
        address: paramaters.address,
        quantity: paramaters.quantity,
      });

      try {
        Product.create(product, (err, data) => {
          if (err) reject(err);
          console.log(data);
          _id = data._id;
          console.log(_id);
          resolve(_id);
        });
      } catch (error) {
        reject(error);
        return res.send("error");
      }
    }
  });
};

exports.post = async (req, res) => {
  if (req.session.type !== "admin") {
    return res.json("not allowed for this user");
  }
  const productExists = await Product.findOne({ name: req.body.name });

  checkProduct(productExists, req.body)
    .then(async (response) => {
      console.log(response);
      const categoryExists = await Category.findOne({
        name: req.body.category,
      });
      console.log(`categoryExists`, categoryExists);
      if (categoryExists) {
        const productInCategoryExists = await Category.findOne({
          items: { $in: response },
        });
        console.log(`productInCategoryExists`, productInCategoryExists);
        if (!productInCategoryExists) {
          Category.updateOne(
            { name: req.body.category },
            { $push: { items: response } },
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      } else {
        const category = new Category({
          name: req.body.category,
          items: response,
        });

        try {
          Category.create(category, (err, data) => {
            // console.log(data);
            if (err) return res.json(err).status(400);
            return res.json(data).status(201);
          });
        } catch (error) {
          res.send("error");
        }
      }
    })
    .catch((err) => console.log(err));
};

exports.get = async (req, res) => {
  const products = await Product.findOne({});
  console.log(products);
};
