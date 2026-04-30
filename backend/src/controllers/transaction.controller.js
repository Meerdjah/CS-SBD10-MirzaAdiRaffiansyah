const TransactionService = require('../services/transaction.service');
const redis = require('../config/redis');

class TransactionController {
  // Task 4: POST /transaction/create — with Redis Streams Logging
  static async createTransaction(req, res, next) {
    try {
      const { user_id, item_id, quantity, description } = req.body;
      const transaction = await TransactionService.createTransaction({ user_id, item_id, quantity, description });

      // Log transaction to Redis Stream using XADD
      try {
        const streamId = await redis.xadd(
          'transaction-logs',
          '*',
          'userId', String(user_id),
          'itemId', String(item_id),
          'total', String(transaction.total)
        );
        console.log(`[REDIS STREAM] Transaction logged to "transaction-logs" with ID: ${streamId}`);
        console.log(`[REDIS STREAM] Data: userId=${user_id}, itemId=${item_id}, total=${transaction.total}`);
      } catch (redisErr) {
        console.error('[REDIS STREAM] Failed to log transaction:', redisErr.message);
      }

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        payload: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = await TransactionService.getTransactionById(id);
      res.status(200).json({
        success: true,
        message: 'Transaction retrieved successfully',
        payload: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  static async payTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const result = await TransactionService.payTransaction(id, userId);
      res.status(200).json({
        success: true,
        message: 'Payment successful',
        payload: {
          transaction_id: id,
          new_balance: result.newBalance,
          status: 'paid',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTransaction(req, res, next) {
    try {
      const { id } = req.params;
      await TransactionService.deleteTransaction(id);
      res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
        payload: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;