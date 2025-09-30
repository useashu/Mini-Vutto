const { pool } = require('../db/database');

module.exports = {
  async getAll({ brand, model }) {
    let query = 'SELECT * FROM bikes';
    const params = [];
    if (brand || model) {
      query += ' WHERE';
      if (brand) {
        params.push(`%${brand}%`);
        query += ` brand ILIKE $${params.length}`;
      }
      if (model) {
        if (params.length > 1) query += ' AND';
        params.push(`%${model}%`);
        query += ` model ILIKE $${params.length}`;
      }
    }
    query += ' ORDER BY created_at DESC';
    const res = await pool.query(query, params);
    return res.rows;
  },
  async getById(id) {
    const res = await pool.query('SELECT * FROM bikes WHERE id = $1', [id]);
    return res.rows[0];
  },
  async create(bike) {
    const res = await pool.query(
      `INSERT INTO bikes (brand, model, year, price, kilometers_driven, location, image_url, seller_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        bike.brand,
        bike.model,
        bike.year,
        bike.price,
        bike.kilometers_driven,
        bike.location,
        bike.image_url,
        bike.seller_id,
      ]
    );
    return res.rows[0];
  },
  async update(id, bike) {
    const res = await pool.query(
      `UPDATE bikes SET brand=$1, model=$2, year=$3, price=$4, kilometers_driven=$5, location=$6, image_url=$7
       WHERE id=$8 RETURNING *`,
      [
        bike.brand,
        bike.model,
        bike.year,
        bike.price,
        bike.kilometers_driven,
        bike.location,
        bike.image_url,
        id,
      ]
    );
    return res.rows[0];
  },
  async delete(id) {
    await pool.query('DELETE FROM bikes WHERE id = $1', [id]);
  },
  async getBySeller(seller_id) {
    const res = await pool.query('SELECT * FROM bikes WHERE seller_id = $1', [seller_id]);
    return res.rows;
  },
};
