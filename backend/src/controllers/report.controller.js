const Report = require('../models/report.model');
const { AppError } = require('../middleware/errorHandler');

class ReportController {
  static async getTopUsers(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const topUsers = await Report.getTopUsers(limit);
      res.status(200).json({
        success: true,
        message: 'Top users retrieved successfully',
        payload: topUsers,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getItemsSold(req, res, next) {
    try {
      const itemsSold = await Report.getItemsSold();
      res.status(200).json({
        success: true,
        message: 'Items sold retrieved successfully',
        payload: itemsSold,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMonthlySales(req, res, next) {
    try {
      const year = parseInt(req.query.year, 10) || new Date().getFullYear();
      const monthlySales = await Report.getMonthlySales(year);
      res.status(200).json({
        success: true,
        message: 'Monthly sales retrieved successfully',
        payload: monthlySales,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;