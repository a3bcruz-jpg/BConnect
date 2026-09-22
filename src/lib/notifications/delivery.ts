import type { BConnectNotification, NotificationPriority } from './types';

export type DeliveryChannel = 'in_app' | 'push' | 'sms';

export type DeliveryPlan = {
  channels: DeliveryChannel[];
  priority: NotificationPriority;
};

/**
 * Builds a delivery plan without performing network I/O.
 * Critical notifications keep SMS as a fallback; normal events remain in-app first.
 */
export function buildDeliveryPlan(notification: Pick<BConnectNotification, 'priority'>): DeliveryPlan {
  if (notification.priority === 'critical') {
    return { channels: ['in_app', 'push', 'sms'], priority: 'critical' };
  }

  if (notification.priority === 'high') {
    return { channels: ['in_app', 'push', 'sms'], priority: 'high' };
  }

  return { channels: ['in_app', 'push'], priority: 'normal' };
}

export function shouldUseSmsFallback(pushFailed: boolean, priority: NotificationPriority) {
  return pushFailed && priority !== 'normal';
}
