const db = require('../config/database');

class Report {
  static async getTopUsers(limit = 10) {
    const result = await db.query(
      `SELECT 
        u.id,
        u.name,
        u.username,
        COALESCE(SUM(t.total), 0) as total_spent,
        RANK() OVER (ORDER BY COALESCE(SUM(t.total), 0) DESC) as rank
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id AND t.status = 'paid'
      GROUP BY u.id, u.name, u.username
      ORDER BY total_spent DESC
      LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  static async getItemsSold() {
    const result = await db.query(
      `SELECT 
        i.id,
        i.name,
        i.price,
        COALESCE(SUM(t.quantity), 0) as total_quantity_sold,
        COALESCE(SUM(t.total), 0) as total_revenue
      FROM items i
      LEFT JOIN transactions t ON i.id = t.item_id AND t.status = 'paid'
      GROUP BY i.id, i.name, i.price
      ORDER BY total_revenue DESC`
    );
    return result.rows;
  }

  static async getMonthlySales(year) {
    const result = await db.query(
      `SELECT 
        date_trunc('month', t.created_at)::date as month,
        COUNT(DISTINCT t.id) as transaction_count,
        COUNT(DISTINCT t.user_id) as unique_buyers,
        COALESCE(SUM(t.quantity), 0) as total_items_sold,
        COALESCE(SUM(t.total), 0) as total_revenue
      FROM transactions t
      WHERE t.status = 'paid' 
        AND EXTRACT(YEAR FROM t.created_at) = $1
      GROUP BY date_trunc('month', t.created_at)
      ORDER BY month`,
      [year]
    );
    return result.rows;
  }
}

module.exports = Report;
