import express, { Router } from "express";
import { products } from "../constants/data.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { addProduct } from "../utils/validation.mjs";

const router = Router();
router.use(express.json());

//get Product

router.get("/", (req, res) => {
  const { filter } = req.query;
  if (filter) {
    const product = products.filter((pro) =>
      pro.name.toLowerCase().includes(filter.toLowerCase())
    );
    return res.send(product);
  }
  return res.send(products);
});

// get a single product

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const index = products.findIndex((ind) => ind.id === parseInt(id));
  if (index === -1) return res.status(404).send("Product not found");

  return res.send(products[index]); // send the product, not just the index
});
// add Product

router.post("/", checkSchema(addProduct), (req, res) => {
  const results = validationResult(req);
  if (results.errors.length > 0) return res.sendStatus(400);
  const body = matchedData(req);
  const product = { id: products.length + 1, ...body };
  const newProducts = [...products, product];
  res.send(newProducts);
});

//edit Product details

router.put("/:id", checkSchema(addProduct), (req, res) => {
  const results = validationResult(req);
  if (results.errors.length > 0) return res.sendStatus(400);
  // check if details are present
  const { id } = req.params;
  if (!id) return res.sendStatus(400);
  // check if id is present
  const findProduct = products.find((dat) => dat.id === parseInt(id));
  if (!findProduct) return res.status(404).send("Product not found");
  // check if product is present
  const updatedProduct = matchedData(req); // update the get product
  const newProducts = products.map((prod) =>
    prod.id === parseInt(id) ? updatedProduct : prod
  );
  //modify the data
  return res.status(201).send(newProducts);
});
//delete Product
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!id) return res.sendStatus(400);
  // check if id is present
  const findProduct = products.find((dat) => dat.id === parseInt(id));
  if (!findProduct) return res.status(404).send("Product not found");
  // check if product is present

  const newProducts = products.filter((prod) => prod.id !== parseInt(id));
  //modify the data
  return res.send(newProducts);
});

export default router;
