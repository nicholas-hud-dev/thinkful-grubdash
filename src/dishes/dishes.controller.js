const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//VALIDATION 

    //NAME VALIDATION
function isNameValid (req, res, next) {
    const { data: name } = req.body;
    if (
      req.body.data.name === null ||
      req.body.data.name === "" ||
      req.body.data.name === undefined
    ) {
      next({ status: 400, message: "Dish must include a name." });
    }
    next();
};

    //DESCRIPTION VALIDATION:
function descriptionExists (req, res, next){
    const {data: {description} = {}} = req.body;
    if (description){
      res.locals.description = description;
        return next()
    }
    next({
        status: 400,
        message: "Dish must include a description."
    })
};

function isDescriptionValid (req, res, next) {
  const { data: { description } = {} } = req.body;
  if (
      req.body.data.description === null ||
      req.body.data.description === "" ||
      req.body.data.description === undefined
    ) {
      next({ status: 400, message: "Dish must include a description." });
    }
    next();
  }

    //PRICE VALIDATION:
function priceExists (req, res, next) {
    const {data: {price} = {}} = req.body;
    if (price){
      res.locals.price = price;
        return next()
    }
    next({
        status: 400,
        message: "Dish must include a price."
    })
}

function isPriceValid (req, res, next) {
  const { data: { price } = {} } = req.body;
   if (
        req.body.data.price === null ||
        req.body.data.price === "" ||
        req.body.data.price === undefined
    ) {
    next({ status: 400, message: "Dish must include a price." });
    }
    if (typeof req.body.data.price === "number" && req.body.data.price > 0) {
    return next();
    } else {
        next({
            status: 400,
            message: `The price must be a number greater than 0.`,
        });
  }
}

    //IMAGE_URL VALIDATION:
function imageUrlExists (req, res, next) {
    const {data: {image_url} = {}} = req.body;
    if(image_url){
      res.locals.imageUrl = image_url;
        return next();
    }

    next({
        status: 400, 
        message: "Dish must include a image_url."
    })
}

function isImageUrlValid (req, res, next) {
    const { data: { image_url } = {} } = req.body;
    if (
        req.body.data.image_url === null ||
        req.body.data.image_url === undefined ||
        req.body.data.image_url === ""
    ) {
    next({ status: 400, message: "Dish must include an image_url." });
    }
    next();
}

    //DISH VALIDATION
function dishExists (req, res, next) {
    const  dishId  = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        next();
    } else {
        next({ status: 404, message: `Dish ${dishId} not found.` });
    }
}

    //DATA ID VALIDATION
function doesDataIdMatchDishId (req, res, next) {
    const { data: { id } = {} } = req.body;
    //const id = req.body.data.id;
    const dishId = req.params.dishId;
    if (id !== undefined && id !== null && id !== "" && id !== dishId) {
        next({
        status: 400,
        message: `id ${id} must match dataId provided in parameters`,
        });
    }
        return next();
    };
//



//CRUDL FUNCTIONS
function create (req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newId = new nextId();
    const newDish = {
        id: newId,
        name: name, 
        description: description, 
        price: price,
        image_url: image_url,
    }
    dishes.push(newDish);
    res.status(201).json( { data: newDish } );
};

function read (req, res) {
    res.json({ data: res.locals.dish })
};

function update (req, res) {
    const dish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
    res.json({data: dish})
};

function list (req, res) {
    res.json({ data: dishes })
};

module.exports = {
    list,
    create: [
        isNameValid, 
        descriptionExists, 
        isDescriptionValid, 
        priceExists,
        isPriceValid,
        imageUrlExists,
        isImageUrlValid,
        create
    ],
    read: [dishExists, read],
    update: [
        dishExists,
        doesDataIdMatchDishId,
        isNameValid,
        descriptionExists,
        isDescriptionValid,
        priceExists,
        isPriceValid,
        imageUrlExists,
        isImageUrlValid,
        update
    ],
};