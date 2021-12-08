// code to build and initialize DB goes here
const { user } = require("pg/lib/defaults");
const {
  createSeller,
  getUserByUsername,
  createProduct,
  client,
  createUser,
  getAllUsers,
  getAllProducts,
  getAllSellers,
  createOrder,
  createAdmin,
} = require("./index");

async function dropTables() {
  try {
    console.log("starting to drop tables");
    await client.query(`
    DROP TABLE IF EXISTS admin;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS sellers;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    `);

    console.log("finished dropping tables");
  } catch (error) {
    console.log("error building tables");
    throw error;
  }
}

async function buildTables() {
  try {
    console.log("Starting to build tables");
    //add role onto users
    await client.query(`
    CREATE TABLE admin(
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      pin INTEGER NOT NULL,
      canDoAnything BOOLEAN
    );
      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        cart INTEGER,
        canSell BOOLEAN
      );
      CREATE TABLE products(
        id SERIAL PRIMARY KEY, 
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price INTEGER,
        category TEXT NOT NULL,
        inventory INTEGER,
        picture TEXT NOT NULL
      );
      CREATE TABLE sellers(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        password VARCHAR(255),
        description TEXT NOT NULL,
        products INTEGER [],
        canSell BOOLEAN
      );
      CREATE TABLE orders(
        id SERIAL PRIMARY KEY,
        userId INTEGER,
        products INTEGER [],
	      totalPrice INTEGER,
        isOpen BOOLEAN
      );
    `);

    // build tables in correct order
    console.log("finished building tables");
  } catch (error) {
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Trying to create users...");
    const userOne = await createUser({
      username: "amber",
      password: "51isTheKey",
      cart: '1',
    });
    const userTwo = await createUser({
      username: "logan",
      password: "iLoveF4ri3s",
      cart: '0',
    });
    const userThree = await createUser({
      username: "matt",
      password: "kingwasright",
      cart: '1',
    });
    console.log("Success creating users!");
    return [userOne, userTwo, userThree];
  } catch (error) {
    console.error("Error while creating reports!");
    throw error;
  }
}

async function createInitialProducts() {
  try {
    console.log("Trying to create Products...");
    const ProductOne = await createProduct({
      name: "cheese",
      description: "cheese",
      price: "2500",
      category: "cheese",
      inventory: "5",
      picture: "oof can't find",
    });
    const ProductTwo = await createProduct({
      name: "bread",
      description: "bread",
      price: "1500",
      category: "bread",
      inventory: "6",
      picture: "oof can't find",
    });
    const ProductThree = await createProduct({
      name: "human food",
      description: "human food",
      price: "10000000",
      category: "human food",
      inventory: "1",
      picture: "oof can't find",
    });
    console.log("Success creating Product!");
    return [ProductOne, ProductTwo, ProductThree];
  } catch (error) {
    console.error("Error while creating Products!");
    throw error;
  }
}

async function createInitialSellers() {
  try {
    console.log("Trying to create sellers...");
    const userOne = await createSeller({
      username: "Ed",
      password: "isthebest",
      description: "I sell great knowledge",
      products: '{1}',
    });
    const userTwo = await createSeller({
      username: "Tanveer",
      password: "isthebest",
      description: "I also sell great knowledge",
      products: '{2}',
    });
    const userThree = await createSeller({
      username: "Payton",
      password: "istheworst",
      description: "I sell bad products",
      products: '{3}',
    });
    console.log("Success creating sellers!");
    return [userOne, userTwo, userThree];
  } catch (error) {
    console.error("Error while creating sellers!");
    throw error;
  }
}

async function createInitialOrders() {
  try {
    console.log("Trying to create orders...");
    const orderOne = await createOrder({
      userId: '1',
      products: '{1}',
      isOpen: true,
    });
    const orderTwo = await createOrder({
      userId: '2',
      products: '{2}',
      isOpen: false,
    });
    const orderTwoPointFive = await createOrder({
      userId: '2',
      products: '{0}',
      isOpen: true,
    });
    const orderThree = await createOrder({
      userId: '3',
      products: '{3}',
      isOpen: true,
    });
    console.log("Success creating orders!");
    return [orderOne, orderTwo, orderTwoPointFive, orderThree];
  } catch (error) {
    console.error("Error while creating orders!");
    throw error;
  }
}


async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await buildTables();
    await createAdmin();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialSellers();
    await createInitialOrders();
  } catch (error) {
    console.log("error during rebuildDB");
    throw error;
  }
}

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());
