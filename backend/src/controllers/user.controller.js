const UserService = require('../services/user.service');
const User = require('../models/user.model');
const { AppError } = require('../middleware/errorHandler');
const redis = require('../config/redis');

class UserController {
  static async register(req, res, next) {
    try {
      const { name, username, email, phone, password } = req.body;
      const user = await UserService.register({ name, username, email, phone, password });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        payload: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Task 2: GET /user/:email — Cache-Aside Strategy
  static async getUserByEmail(req, res, next) {
    try {
      const { email } = req.params;
      const cacheKey = `user:${email}`;

      // 1. Check Redis cache first
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        // Cache Hit — return data from Redis
        console.log(`[CACHE HIT] Key "${cacheKey}" found in Redis`);
        return res.status(200).json({
          success: true,
          message: 'User data retrieved from cache (Cache Hit)',
          source: 'cache',
          payload: JSON.parse(cachedData),
        });
      }

      // 2. Cache Miss — fetch from PostgreSQL
      console.log(`[CACHE MISS] Key "${cacheKey}" not found in Redis, querying PostgreSQL...`);
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          payload: null,
        });
      }

      // Remove password from cached data
      const { password, ...userData } = user;

      // 3. Store in Redis with EX 60 seconds TTL
      await redis.set(cacheKey, JSON.stringify(userData), 'EX', 60);
      console.log(`[CACHE SET] Stored key "${cacheKey}" in Redis with TTL 60s`);

      return res.status(200).json({
        success: true,
        message: 'User data retrieved from database (Cache Miss)',
        source: 'database',
        payload: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Task 3: PUT /user/update — Cache Invalidation
  static async updateProfile(req, res, next) {
    try {
      const { id, name, username, email, phone, password, balance } = req.body;
      const updatedUser = await UserService.updateProfile(id, { name, username, email, phone, password, balance });

      // Cache Invalidation: delete the cached user data after successful update
      if (updatedUser && updatedUser.email) {
        const cacheKey = `user:${updatedUser.email}`;
        await redis.del(cacheKey);
        console.log(`[CACHE INVALIDATED] Deleted key "${cacheKey}" from Redis after user update`);
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const history = await UserService.getTransactionHistory(userId);
      res.status(200).json({
        success: true,
        message: 'Transaction history retrieved',
        payload: history,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTotalSpent(req, res, next) {
    try {
      const userId = req.user.userId;
      const totalSpent = await UserService.getTotalSpent(userId);
      res.status(200).json({
        success: true,
        message: 'Total spent retrieved',
        payload: { total_spent: totalSpent },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
