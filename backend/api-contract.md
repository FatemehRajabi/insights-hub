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
  "survey_version": "short_v1",
  "ratings": {
    "overall_satisfaction": 8,
    "speed_satisfaction": 6,
    "recommend_likelihood": 9
  },
  "open_text": {
    "improve_one_thing": "Delivery was slow.",
    "keep_doing_one_thing": "Staff were friendly."
  },
  "topic": "delivery",
  "metadata": {
    "userAgent": "Mozilla/5.0 ...",
    "locale": "en-US"
  }
}
```

2.1 Field Definitions

| Field                            | Type    | Required | Description                                          |
| -------------------------------- | ------- | -------: | ---------------------------------------------------- |
| `survey_version`                 | string  |      yes | Survey version identifier (e.g., `short_v1`).        |
| `ratings`                        | object  |      yes | Container for numeric ratings (1–10).                |
| `ratings.overall_satisfaction`   | integer |      yes | Overall satisfaction score (1–10).                   |
| `ratings.speed_satisfaction`     | integer |      yes | Speed of service/support score (1–10).               |
| `ratings.recommend_likelihood`   | integer |      yes | Likelihood to recommend score (1–10).                |
| `open_text`                      | object  |      yes | Container for open-ended answers.                    |
| `open_text.improve_one_thing`    | string  |      yes | What we could do better.                             |
| `open_text.keep_doing_one_thing` | string  |      yes | What we should keep doing.                           |
| `topic`                          | string  |       no | Optional tag like `delivery`, `support`, `checkout`. |
| `metadata`                       | object  |       no | Optional client context (userAgent, locale, etc.).   |

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

```
{
  "feedback_id": "3f7f2d7a-6c2b-4b1a-9d4c-1f2a7d9d12ab",
  "submitted_at": "2025-12-22T15:30:45Z",
  "survey_version": "short_v1",
  "ratings": {
    "overall_satisfaction": 8,
    "speed_satisfaction": 6,
    "recommend_likelihood": 9
  },
  "open_text": {
    "improve_one_thing": "Delivery was slow.",
    "keep_doing_one_thing": "Staff were friendly."
  },
  "topic": "delivery",
  "metadata": {
    "userAgent": "Mozilla/5.0 ...",
    "locale": "en-US"
  },
  "year": "2025",
  "month": "12",
  "day": "22"
}
```

The record is stored under a date-partitioned path, for example:

```s3://insighthub-data-insighthub-data-2025/raw/feedback/environment=demo/year=YYYY/month=MM/day=DD/<feedback_id>.json

```

## 4. Validation Rules

The backend enforces these rules (via API Gateway request validation):

### 4.1 survey_version

- Required
- Type: string
- Allowed values: `short_v1`

### 4.2 ratings

- Required
- Type: object
- All rating values must be integers between **1 and 10**

Required fields:

- `ratings.overall_satisfaction`
- `ratings.speed_satisfaction`
- `ratings.recommend_likelihood`

### 4.3 open_text

- Required
- Type: object

Required fields:

- `open_text.improve_one_thing`
- `open_text.keep_doing_one_thing`

Each must:

- Be non-empty strings
- Max length: 2000 characters

### 4.4 topic

- Optional
- Type: string
- Example values: `delivery`, `checkout`, `support`

### 4.5 metadata

- Optional
- Type: object
- Contains simple key–value pairs (e.g., strings, numbers, booleans)

If any required field is missing or invalid, the API returns **400 Bad Request**.

## 5. Responses

5.1 Success Response

```
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
  "ratings.overall_satisfaction must be an integer between 1 and 10",
  "open_text.improve_one_thing is required"
]
}

5.3 Server Error – Unexpected Failure

Status: 500 Internal Server Error

{
  "message": "An unexpected error occurred while submitting feedback"
}
```

## 6. End-to-End Flow (Frontend → API → Lambda → S3)

The user fills out the feedback form in the browser.

The browser sends a POST /feedback request with JSON body to Amazon API Gateway.

API Gateway invokes the ingest-feedback Lambda function.

Lambda:

Validates the request.

Enriches the payload with feedback_id, timestamp, year, month, day.

Writes the record into Amazon S3 under:

```
raw/feedback/environment=demo/year=YYYY/month=MM/day=DD/<feedback_id>.json
```

Lambda returns a success or error response.

API Gateway returns the HTTP response to the browser.
