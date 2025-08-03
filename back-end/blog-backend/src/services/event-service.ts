import { EventEmitter } from 'events';
import { NewsletterSubscriberModel } from '../models/newsletter-subscriber-model';
import { sendNewBlogNotification } from '../utils/email';

// Create event emitter instance
export const eventEmitter = new EventEmitter();

// Event types
export const EVENTS = {
  BLOG_CREATED: 'blog:created',
  BLOG_UPDATED: 'blog:updated',
  BLOG_DELETED: 'blog:deleted',
} as const;

// Blog creation event handler
export const handleBlogCreated = async (blogData: any) => {
  try {
    console.log('📧 Blog created event triggered:', blogData.title);
    
    // Get all active subscribers
    const subscribers = await NewsletterSubscriberModel.findAll({
      where: { isActive: true },
      attributes: ['email']
    });
    
    console.log(`📧 Found ${subscribers.length} active subscribers to notify`);
    
    // Send notification to each subscriber
    const emailPromises = subscribers.map(subscriber => 
      sendNewBlogNotification(subscriber.email, blogData)
    );
    
    // Wait for all emails to be sent
    const results = await Promise.allSettled(emailPromises);
    
    // Log results
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    console.log(`📧 Email notifications sent: ${successful} successful, ${failed} failed`);
    
    return {
      totalSubscribers: subscribers.length,
      successfulEmails: successful,
      failedEmails: failed
    };
  } catch (error) {
    console.error('❌ Error handling blog created event:', error);
    throw error;
  }
};

// Blog updated event handler
export const handleBlogUpdated = async (blogData: any) => {
  console.log('📝 Blog updated event triggered:', blogData.title);
  // Future implementation for blog update notifications
};

// Blog deleted event handler
export const handleBlogDeleted = async (blogData: any) => {
  console.log('🗑️ Blog deleted event triggered:', blogData.title);
  // Future implementation for blog deletion notifications
};

// Register event handlers
export const registerEventHandlers = () => {
  eventEmitter.on(EVENTS.BLOG_CREATED, handleBlogCreated);
  eventEmitter.on(EVENTS.BLOG_UPDATED, handleBlogUpdated);
  eventEmitter.on(EVENTS.BLOG_DELETED, handleBlogDeleted);
  
  console.log('🎯 Event handlers registered successfully');
};

// Trigger blog created event
export const triggerBlogCreated = (blogData: any) => {
  eventEmitter.emit(EVENTS.BLOG_CREATED, blogData);
};

// Trigger blog updated event
export const triggerBlogUpdated = (blogData: any) => {
  eventEmitter.emit(EVENTS.BLOG_UPDATED, blogData);
};

// Trigger blog deleted event
export const triggerBlogDeleted = (blogData: any) => {
  eventEmitter.emit(EVENTS.BLOG_DELETED, blogData);
}; 