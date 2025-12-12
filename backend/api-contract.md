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

2.1 Field Definitions

| Field         | Type    | Required | Description                                                                    |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------ |
| rating        | integer | yes      | Customer rating (1–5) representing satisfaction.                               |
| feedback_text | string  | yes      | Free-text feedback provided by the customer.                                   |
| topic         | string  | no       | Topic or area the feedback is about (e.g., `checkout`, `delivery`, `support`). |
| metadata      | object  | no       | Optional extra data (e.g., browser info).                                      |


The frontend does not send feedback_id, timestamp, year, month, or day.
These are added by the Lambda function according to the defined data schema.

## 3. Backend Enrichment (Lambda)

When a valid request is received, the Lambda function will:

Generate:

feedback_id

timestamp

year, month, day (derived from timestamp)

Write the enriched record to S3 using the defined folder structure.

3.1 Example Enriched Record (written to S3)
{
  "feedback_id": "fb-20251212-0001",
  "timestamp": "2025-12-12T15:30:45Z",
  "rating": 4,
  "feedback_text": "The checkout process was easy, but delivery was slow.",
  "topic": "delivery",
  "metadata": {
    "browser": "Chrome",
    "locale": "en-US"
  },
  "year": "2025",
  "month": "12",
  "day": "12"
}


The record is stored under a date-partitioned path, for example:

s3://insights-hub-feedback-dev/raw/year=2025/month=12/day=12/feedback-2025-12-12.json

## 4. Validation Rules

The backend enforces these rules:

4.1 rating

Required

Type: integer

Allowed values: 1, 2, 3, 4, 5

4.2 feedback_text

Required

Type: string

Must be non-empty

Suggested max length: 2000 characters

4.3 topic

Optional

Type: string

Example values: delivery, checkout, payment, support

4.4 metadata

Optional

Type: object

Contains simple key–value pairs (e.g., strings, numbers, booleans)

If any required field is invalid or missing, the API returns a 400 Bad Request.

## 5. Responses
5.1 Success Response

Status: 200 OK

{
  "message": "Feedback submitted successfully",
  "feedback_id": "fb-20251212-0001",
  "timestamp": "2025-12-12T15:30:45Z"
}

5.2 Client Error – Invalid Input

Status: 400 Bad Request

{
  "message": "Invalid request payload",
  "errors": [
    "rating is required and must be an integer between 1 and 5",
    "feedback_text is required"
  ]
}

5.3 Server Error – Unexpected Failure

Status: 500 Internal Server Error

{
  "message": "An unexpected error occurred while submitting feedback"
}

## 6. End-to-End Flow (Frontend → API → Lambda → S3)

The user fills out the feedback form in the browser.

The browser sends a POST /feedback request with JSON body to Amazon API Gateway.

API Gateway invokes the ingest-feedback Lambda function.

Lambda:

Validates the request.

Enriches the payload with feedback_id, timestamp, year, month, day.

Writes the record into Amazon S3 under:

/raw/year=YYYY/month=MM/day=DD/


Lambda returns a success or error response.

API Gateway returns the HTTP response to the browser.
