const { client } = require("./users");

async function createProduct(reportFields) {
  // Get all of the fields from the passed in object
  const { name, description, price, category, inventory, picture } = reportFields;
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      INSERT INTO products(name, description, price, category, inventory, picture)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [name, description, price, category, inventory, picture]
    );
    // return the new product
    return product;
  } catch (error) {
    throw error;
  }
}
// used in loop when showing all products. only owner/seller should be able to delete.
async function deleteProduct(productId) {
  try {
    const {
      rows: [products],
    } = await client.query(`
      DELETE FROM products
      WHERE id=${productId};
      `);
    return products;
  } catch (error) {
    throw error;
  }
}

async function getProductsByName(name) {
  try {
    const {
      rows: [products],
    } = await client.query(`
      SELECT * FROM products
      WHERE name=${name};
      `);
    return products;
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  try {
    const { rows: products } = await client.query(`
    SELECT * FROM products;
    `);
    return products;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(id, name, description, price, category, inventory, picture) {
  try{
    const {rows:[that]} = await client.query(
      `
      UPDATE products
      SET
      name = $1,
      description = $2,
      price = $3,
      category = $4,
      inventory = $5,
      picture = $6
      WHERE id=$7;
      `,[name, description, price, category, inventory, picture, id]
    )
    return that;
  }catch (error){
    throw error;
  }
}

module.exports = {
  createProduct,
  getProductsByName,
  getAllProducts,
  deleteProduct,
  updateProduct
};
