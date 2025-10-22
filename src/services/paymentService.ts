import apiClient from './api';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
  payment_method_types: string[];
  created_at: string;
}

export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  payment_method_types?: string[];
  metadata?: Record<string, string>;
}

export interface ConfirmPaymentData {
  payment_intent_id: string;
  payment_method_id?: string;
  return_url?: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  created_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  description: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface RefundRequest {
  transaction_id: string;
  amount?: number;
  reason?: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export class PaymentService {
  /**
   * Create Stripe payment intent
   */
  static async createStripePaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntent> {
    const { data: response } = await apiClient.post('/payment/stripe/create-intent', data);
    return response;
  }

  /**
   * Confirm Stripe payment
   */
  static async confirmStripePayment(data: ConfirmPaymentData): Promise<{ 
    success: boolean; 
    payment_intent: PaymentIntent;
    message: string;
  }> {
    const { data: response } = await apiClient.post('/payment/stripe/confirm', data);
    return response;
  }

  /**
   * Create Razorpay order
   */
  static async createRazorpayOrder(data: { amount: number; currency?: string }): Promise<RazorpayOrder> {
    const { data: response } = await apiClient.post('/payment/razorpay/create-order', data);
    return response;
  }

  /**
   * Verify Razorpay payment
   */
  static async verifyRazorpayPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ 
    success: boolean; 
    message: string;
    transaction_id: string;
  }> {
    const { data: response } = await apiClient.post('/payment/razorpay/verify', data);
    return response;
  }

  /**
   * Get payment methods for current user
   */
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data } = await apiClient.get('/payment/methods');
    return data;
  }

  /**
   * Add new payment method
   */
  static async addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    const { data } = await apiClient.post('/payment/methods', { 
      payment_method_id: paymentMethodId 
    });
    return data;
  }

  /**
   * Remove payment method
   */
  static async removePaymentMethod(paymentMethodId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/payment/methods/${paymentMethodId}`);
    return data;
  }

  /**
   * Set default payment method
   */
  static async setDefaultPaymentMethod(paymentMethodId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post('/payment/methods/set-default', { 
      payment_method_id: paymentMethodId 
    });
    return data;
  }

  /**
   * Get transaction history
   */
  static async getTransactions(page: number = 1, per_page: number = 10): Promise<{
    items: Transaction[];
    total_items: number;
    page: number;
    per_page: number;
    total_pages: number;
  }> {
    const { data } = await apiClient.get('/payment/transactions', {
      params: { page, per_page }
    });
    return data;
  }

  /**
   * Get transaction by ID
   */
  static async getTransactionById(id: string): Promise<Transaction> {
    const { data } = await apiClient.get(`/payment/transactions/${id}`);
    return data;
  }

  /**
   * Request refund
   */
  static async requestRefund(refundData: RefundRequest): Promise<{ 
    success: boolean; 
    refund_id: string;
    message: string;
  }> {
    const { data } = await apiClient.post('/payment/refund', refundData);
    return data;
  }

  /**
   * Get refund status
   */
  static async getRefundStatus(refundId: string): Promise<{
    id: string;
    status: 'pending' | 'completed' | 'failed';
    amount: number;
    reason?: string;
    created_at: string;
    processed_at?: string;
  }> {
    const { data } = await apiClient.get(`/payment/refund/${refundId}`);
    return data;
  }

  /**
   * Process cart checkout
   */
  static async checkoutCart(data: {
    payment_method: 'stripe' | 'razorpay';
    payment_method_id?: string;
    billing_address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  }): Promise<{
    success: boolean;
    payment_intent?: PaymentIntent;
    razorpay_order?: RazorpayOrder;
    message: string;
  }> {
    const { data: response } = await apiClient.post('/payment/checkout', data);
    return response;
  }

  /**
   * Get payment statistics (admin only)
   */
  static async getPaymentStatistics(): Promise<{
    total_transactions: number;
    total_revenue: number;
    successful_payments: number;
    failed_payments: number;
    refunded_amount: number;
    revenue_by_month: Array<{ month: string; revenue: number }>;
    popular_payment_methods: Array<{ method: string; count: number }>;
  }> {
    const { data } = await apiClient.get('/payment/stats');
    return data;
  }

  /**
   * Download invoice
   */
  static async downloadInvoice(transactionId: string): Promise<Blob> {
    const response = await apiClient.get(`/payment/invoice/${transactionId}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Send invoice email
   */
  static async sendInvoiceEmail(transactionId: string, email?: string): Promise<{ message: string }> {
    const { data } = await apiClient.post(`/payment/invoice/${transactionId}/send`, { email });
    return data;
  }

  /**
   * Validate coupon
   */
  static async validateCoupon(couponCode: string): Promise<{
    valid: boolean;
    coupon?: {
      code: string;
      discount_type: 'percentage' | 'fixed';
      discount_value: number;
      min_amount?: number;
      max_discount?: number;
      expires_at?: string;
    };
    message: string;
  }> {
    const { data } = await apiClient.post('/payment/validate-coupon', { code: couponCode });
    return data;
  }

  /**
   * Get payment configuration
   */
  static async getPaymentConfig(): Promise<{
    stripe_publishable_key?: string;
    razorpay_key_id?: string;
    supported_currencies: string[];
    min_amount: number;
    max_amount: number;
  }> {
    const { data } = await apiClient.get('/payment/config');
    return data;
  }
}