# API Contract – Feedback Submission

This document defines the API used by the frontend to submit customer feedback to Insights Hub.

---

## 1. Endpoint Overview

**Method:** `POST`  
**Path:** `/feedback`  
**Protocol:** HTTPS (via Amazon API Gateway)  
**Content-Type:** `application/json`

The browser sends a `POST /feedback` request to API Gateway, which triggers the `ingest-feedback` Lambda function.

---

## 2. Request Schema (from Frontend)

The frontend sends the following JSON payload:

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
