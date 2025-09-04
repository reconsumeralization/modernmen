import { EventEmitter } from 'events';

export interface Customer {
  id: string;
  email: string;
  name: string;
  status: CustomerStatus;
  createdAt: Date;
  lastActivity: Date;
  totalValue: number;
  tags: string[];
  metadata: Record<string, any>;
}

export enum CustomerStatus {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  ACTIVE = 'active',
  AT_RISK = 'at_risk',
  CHURNED = 'churned',
  WON_BACK = 'won_back'
}

export interface LifecycleEvent {
  customerId: string;
  eventType: string;
  timestamp: Date;
  data: Record<string, any>;
}

export interface LifecycleRule {
  id: string;
  name: string;
  fromStatus: CustomerStatus;
  toStatus: CustomerStatus;
  conditions: LifecycleCondition[];
  actions: LifecycleAction[];
  enabled: boolean;
}

export interface LifecycleCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
  value: any;
}

export interface LifecycleAction {
  type: 'email' | 'webhook' | 'tag' | 'score_update' | 'assignment';
  config: Record<string, any>;
}

export class CustomerLifecycleManager extends EventEmitter {
  private customers: Map<string, Customer> = new Map();
  private rules: LifecycleRule[] = [];
  private eventHistory: LifecycleEvent[] = [];

  constructor() {
    super();
    this.initializeDefaultRules();
  }

  /**
   * Add or update a customer in the lifecycle system
   */
  async upsertCustomer(customer: Customer): Promise<void> {
    const existingCustomer = this.customers.get(customer.id);
    const previousStatus = existingCustomer?.status;
    
    this.customers.set(customer.id, customer);
    
    if (previousStatus && previousStatus !== customer.status) {
      await this.handleStatusChange(customer, previousStatus, customer.status);
    }
    
    this.emit('customer:updated', customer);
  }

  /**
   * Track a customer event and potentially trigger lifecycle changes
   */
  async trackEvent(event: LifecycleEvent): Promise<void> {
    this.eventHistory.push(event);
    
    const customer = this.customers.get(event.customerId);
    if (!customer) {
      throw new Error(`Customer ${event.customerId} not found`);
    }

    // Update last activity
    customer.lastActivity = event.timestamp;
    
    // Check if this event triggers any lifecycle rules
    await this.evaluateRules(customer, event);
    
    this.emit('event:tracked', event);
  }

  /**
   * Get customer by ID
   */
  getCustomer(customerId: string): Customer | undefined {
    return this.customers.get(customerId);
  }

  /**
   * Get customers by status
   */
  getCustomersByStatus(status: CustomerStatus): Customer[] {
    return Array.from(this.customers.values()).filter(c => c.status === status);
  }

  /**
   * Add a lifecycle rule
   */
  addRule(rule: LifecycleRule): void {
    this.rules.push(rule);
    this.emit('rule:added', rule);
  }

  /**
   * Remove a lifecycle rule
   */
  removeRule(ruleId: string): boolean {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      const rule = this.rules.splice(index, 1)[0];
      this.emit('rule:removed', rule);
      return true;
    }
    return false;
  }

  /**
   * Get customer lifecycle analytics
   */
  getAnalytics(): {
    statusDistribution: Record<CustomerStatus, number>;
    totalCustomers: number;
    averageLifetimeValue: number;
    churnRate: number;
  } {
    const customers = Array.from(this.customers.values());
    const statusDistribution = {} as Record<CustomerStatus, number>;
    
    // Initialize status counts
    Object.values(CustomerStatus).forEach(status => {
      statusDistribution[status] = 0;
    });
    
    // Count customers by status
    customers.forEach(customer => {
      statusDistribution[customer.status]++;
    });
    
    const totalCustomers = customers.length;
    const averageLifetimeValue = totalCustomers > 0 
      ? customers.reduce((sum, c) => sum + c.totalValue, 0) / totalCustomers 
      : 0;
    
    const churnRate = totalCustomers > 0 
      ? statusDistribution[CustomerStatus.CHURNED] / totalCustomers 
      : 0;

    return {
      statusDistribution,
      totalCustomers,
      averageLifetimeValue,
      churnRate
    };
  }

  /**
   * Initialize default lifecycle rules
   */
  private initializeDefaultRules(): void {
    // Lead to Prospect rule
    this.addRule({
      id: 'lead-to-prospect',
      name: 'Lead to Prospect',
      fromStatus: CustomerStatus.LEAD,
      toStatus: CustomerStatus.PROSPECT,
      conditions: [
        { field: 'totalValue', operator: 'greater_than', value: 0 }
      ],
      actions: [
        { type: 'tag', config: { tag: 'converted-prospect' } },
        { type: 'email', config: { template: 'welcome-prospect' } }
      ],
      enabled: true
    });

    // Prospect to Active rule
    this.addRule({
      id: 'prospect-to-active',
      name: 'Prospect to Active',
      fromStatus: CustomerStatus.PROSPECT,
      toStatus: CustomerStatus.ACTIVE,
      conditions: [
        { field: 'totalValue', operator: 'greater_than', value: 100 }
      ],
      actions: [
        { type: 'tag', config: { tag: 'active-customer' } },
        { type: 'email', config: { template: 'welcome-active' } }
      ],
      enabled: true
    });

    // Active to At Risk rule
    this.addRule({
      id: 'active-to-at-risk',
      name: 'Active to At Risk',
      fromStatus: CustomerStatus.ACTIVE,
      toStatus: CustomerStatus.AT_RISK,
      conditions: [
        { field: 'daysSinceLastActivity', operator: 'greater_than', value: 30 }
      ],
      actions: [
        { type: 'tag', config: { tag: 'at-risk' } },
        { type: 'email', config: { template: 'retention-campaign' } }
      ],
      enabled: true
    });
  }

  /**
   * Evaluate rules against a customer and event
   */
  private async evaluateRules(customer: Customer, event: LifecycleEvent): Promise<void> {
    const applicableRules = this.rules.filter(rule => 
      rule.enabled && rule.fromStatus === customer.status
    );

    for (const rule of applicableRules) {
      if (await this.evaluateConditions(customer, event, rule.conditions)) {
        await this.executeRule(customer, rule);
      }
    }
  }

  /**
   * Evaluate rule conditions
   */
  private async evaluateConditions(
    customer: Customer, 
    event: LifecycleEvent, 
    conditions: LifecycleCondition[]
  ): Promise<boolean> {
    for (const condition of conditions) {
      let value: any;
      
      // Get the field value
      if (condition.field === 'daysSinceLastActivity') {
        const daysDiff = Math.floor((Date.now() - customer.lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        value = daysDiff;
      } else if (condition.field.startsWith('event.')) {
        const eventField = condition.field.substring(6);
        value = event.data[eventField];
      } else {
        value = (customer as any)[condition.field];
      }
      
      // Evaluate condition
      const conditionMet = this.evaluateCondition(value, condition.operator, condition.value);
      if (!conditionMet) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(value: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case 'equals':
        return value === expectedValue;
      case 'not_equals':
        return value !== expectedValue;
      case 'greater_than':
        return value > expectedValue;
      case 'less_than':
        return value < expectedValue;
      case 'contains':
        return Array.isArray(value) ? value.includes(expectedValue) : 
               typeof value === 'string' ? value.includes(expectedValue) : false;
      default:
        return false;
    }
  }

  /**
   * Execute a lifecycle rule
   */
  private async executeRule(customer: Customer, rule: LifecycleRule): Promise<void> {
    // Update customer status
    const previousStatus = customer.status;
    customer.status = rule.toStatus;
    
    // Execute actions
    for (const action of rule.actions) {
      await this.executeAction(customer, action);
    }
    
    await this.handleStatusChange(customer, previousStatus, rule.toStatus);
    this.emit('rule:executed', { customer, rule });
  }

  /**
   * Execute a lifecycle action
   */
  private async executeAction(customer: Customer, action: LifecycleAction): Promise<void> {
    switch (action.type) {
      case 'tag':
        if (!customer.tags.includes(action.config.tag)) {
          customer.tags.push(action.config.tag);
        }
        break;
      case 'email':
        this.emit('action:email', { customer, template: action.config.template });
        break;
      case 'webhook':
        this.emit('action:webhook', { customer, url: action.config.url, data: action.config.data });
        break;
      case 'score_update':
        customer.metadata.score = (customer.metadata.score || 0) + action.config.delta;
        break;
      case 'assignment':
        customer.metadata.assignedTo = action.config.userId;
        break;
    }
  }

  /**
   * Handle customer status changes
   */
  private async handleStatusChange(
    customer: Customer, 
    fromStatus: CustomerStatus, 
    toStatus: CustomerStatus
  ): Promise<void> {
    const statusChangeEvent: LifecycleEvent = {
      customerId: customer.id,
      eventType: 'status_change',
      timestamp: new Date(),
      data: { fromStatus, toStatus }
    };
    
    this.eventHistory.push(statusChangeEvent);
    this.emit('customer:status_changed', { customer, fromStatus, toStatus });
  }
}
