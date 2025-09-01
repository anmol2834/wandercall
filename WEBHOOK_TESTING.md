# Cashfree Webhook Testing Guide

## 🔧 **Webhook Endpoint**
- **URL**: `https://api.wandercall.com/api/webhooks/cashfree-webhook`
- **Method**: POST
- **Content-Type**: application/json

## 📋 **Testing in Postman**

### ✅ **Correct Test Payload:**

**Headers:**
```
Content-Type: application/json
x-webhook-signature: test_signature_here
x-webhook-timestamp: 1640995200
```

**Body (Raw JSON):**
```json
{
  "type": "PAYMENT_SUCCESS_WEBHOOK",
  "data": {
    "order": {
      "order_id": "order_123456789",
      "payment_id": "payment_987654321",
      "order_amount": 1000.00,
      "order_currency": "INR",
      "order_status": "PAID"
    }
  }
}
```

### ✅ **Expected Response:**
```json
{
  "message": "OK",
  "status": "success"
}
```

## 🧪 **Test Scenarios**

### 1. **Payment Success Test:**
```json
{
  "type": "PAYMENT_SUCCESS_WEBHOOK",
  "data": {
    "order": {
      "order_id": "test_order_123",
      "payment_id": "test_payment_456",
      "order_amount": 500.00,
      "order_status": "PAID"
    }
  }
}
```

### 2. **Payment Failed Test:**
```json
{
  "type": "PAYMENT_FAILED_WEBHOOK",
  "data": {
    "order": {
      "order_id": "test_order_123",
      "order_status": "FAILED",
      "failure_reason": "Insufficient funds"
    }
  }
}
```

## 🔐 **Signature Verification**

For production, Cashfree will send:
- `x-webhook-signature`: HMAC SHA256 signature
- `x-webhook-timestamp`: Unix timestamp

**Signature Formula:**
```
signature = HMAC-SHA256(webhook_secret, timestamp + "." + raw_json_body)
```

## ⚠️ **Important Notes**

1. **Raw JSON Required**: Cashfree sends raw JSON, not form-encoded data
2. **Signature Verification**: Required in production for security
3. **200 OK Response**: Must return 200 status for successful processing
4. **Timeout**: Cashfree expects response within 10 seconds
5. **Retries**: Failed webhooks are retried up to 5 times

## 🚀 **Production Setup**

1. **Set Webhook Secret** in environment variables
2. **Configure in Cashfree Dashboard**:
   - URL: `https://api.wandercall.com/api/webhooks/cashfree-webhook`
   - Events: Payment Success, Payment Failed
3. **Enable Signature Verification** in production

## 🔍 **Debugging**

- **Check server logs** for webhook processing
- **Verify environment variables** are set
- **Test with actual Cashfree payload** format
- **Ensure HTTPS** is working properly

Your webhook is now **Cashfree-compliant** and ready for production! 🎉