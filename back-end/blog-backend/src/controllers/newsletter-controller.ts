import { Request, Response } from 'express';
import { NewsletterSubscriberModel } from '../models/newsletter-subscriber-model';
import { ResponseService } from '../utils/response';

// Subscribe to newsletter
export const subscribeToNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return ResponseService({
        res,
        status: 400,
        success: false,
        message: 'Email is required',
      });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ResponseService({
        res,
        status: 400,
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Check if already subscribed
    const existingSubscriber = await NewsletterSubscriberModel.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return ResponseService({
          res,
          status: 409,
          success: false,
          message: 'You are already subscribed to our newsletter',
        });
      } else {
        // Reactivate subscription
        await existingSubscriber.update({
          isActive: true,
          unsubscribedAt: undefined,
          updatedAt: new Date(),
        });

        return ResponseService({
          res,
          message: 'Welcome back! Your newsletter subscription has been reactivated',
          data: {
            email: existingSubscriber.email,
            subscribedAt: existingSubscriber.subscribedAt,
          },
        });
      }
    }

    // Create new subscription
    const newSubscriber = await NewsletterSubscriberModel.create({
      email: email.toLowerCase(),
      isActive: true,
      subscribedAt: new Date(),
    });

    return ResponseService({
      res,
      message: 'Successfully subscribed to newsletter',
      data: {
        email: newSubscriber.email,
        subscribedAt: newSubscriber.subscribedAt,
      },
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return ResponseService({
      res,
      status: 500,
      success: false,
      message: 'Failed to subscribe to newsletter',
    });
  }
};

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return ResponseService({
        res,
        status: 400,
        success: false,
        message: 'Email is required',
      });
    }

    // Find subscriber
    const subscriber = await NewsletterSubscriberModel.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!subscriber) {
      return ResponseService({
        res,
        status: 404,
        success: false,
        message: 'Email not found in our newsletter subscribers',
      });
    }

    if (!subscriber.isActive) {
      return ResponseService({
        res,
        status: 409,
        success: false,
        message: 'You are already unsubscribed from our newsletter',
      });
    }

    // Unsubscribe
    await subscriber.update({
      isActive: false,
      unsubscribedAt: new Date(),
      updatedAt: new Date(),
    });

    return ResponseService({
      res,
      message: 'Successfully unsubscribed from newsletter',
      data: {
        email: subscriber.email,
        unsubscribedAt: subscriber.unsubscribedAt,
      },
    });
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    return ResponseService({
      res,
      status: 500,
      success: false,
      message: 'Failed to unsubscribe from newsletter',
    });
  }
};

// Get all subscribers (admin only)
export const getAllSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await NewsletterSubscriberModel.findAll({
      order: [['createdAt', 'DESC']],
    });

    return ResponseService({
      res,
      message: 'Subscribers retrieved successfully',
      data: {
        total: subscribers.length,
        active: subscribers.filter(s => s.isActive).length,
        inactive: subscribers.filter(s => !s.isActive).length,
        subscribers: subscribers.map(sub => ({
          id: sub.id,
          email: sub.email,
          isActive: sub.isActive,
          subscribedAt: sub.subscribedAt,
          unsubscribedAt: sub.unsubscribedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    return ResponseService({
      res,
      status: 500,
      success: false,
      message: 'Failed to retrieve subscribers',
    });
  }
};

// Get subscriber count
export const getSubscriberCount = async (req: Request, res: Response) => {
  try {
    const totalSubscribers = await NewsletterSubscriberModel.count();
    const activeSubscribers = await NewsletterSubscriberModel.count({
      where: { isActive: true },
    });

    return ResponseService({
      res,
      message: 'Subscriber count retrieved successfully',
      data: {
        total: totalSubscribers,
        active: activeSubscribers,
        inactive: totalSubscribers - activeSubscribers,
      },
    });
  } catch (error) {
    console.error('Get subscriber count error:', error);
    return ResponseService({
      res,
      status: 500,
      success: false,
      message: 'Failed to retrieve subscriber count',
    });
  }
}; 