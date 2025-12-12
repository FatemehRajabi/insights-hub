# Feedback Data Schema

This document defines the **standard structure** for all customer feedback records used in the Insights Hub platform.

All components (frontend form, API Gateway, Lambda, S3 storage, Athena, and QuickSight) must follow this schema.

---

## 1. Record Structure (Logical Schema)

Each feedback item represents a **single submission** from a customer.

### 1.1 Fields

| Field         | Type    | Required | Source            | Description                                                    |
|--------------|---------|----------|-------------------|----------------------------------------------------------------|
| feedback_id  | string  | yes      | Lambda            | Unique ID for the feedback entry (UUID).                      |
| timestamp    | string  | yes      | Lambda            | ISO 8601 UTC timestamp when feedback is processed.            |
| rating       | integer | yes      | Frontend          | Customer rating (1–5) representing satisfaction.              |
| feedback_text| string  | yes      | Frontend          | Free-text feedback provided by the customer.                  |
| topic        | string  | no       | Frontend          | topic or area the feedback is about (e.g., `checkout`, `delivery`). |
| metadata     | object  | no       | Lambda/Frontend   | Optional extra fields (e.g., browser info, campaign, etc.).   |
| year         | string  | yes      | Lambda (derived)  | Partition key for Athena, derived from `timestamp` (YYYY).    |
| month        | string  | yes      | Lambda (derived)  | Partition key for Athena, derived from `timestamp` (MM).      |
| day          | string  | yes      | Lambda (derived)  | Partition key for Athena, derived from `timestamp` (DD).      |

---

## 2. Frontend → API Payload Schema

This is what the **browser sends** to the API (`POST /feedback`).

The frontend does **not** need to send `feedback_id`, `timestamp`, `year`, `month`, or `day`.  
These are added by the Lambda function.

### 2.1 Request Body (from frontend)

```json
{
  "rating": 4,
  "feedback_text": "The checkout process was easy, but delivery was slow.",
  "topic": "delivery",
    "metadata": {
    "browser": "Chrome",
    "locale": "en-US"
  }
}

