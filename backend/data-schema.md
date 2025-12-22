# Feedback Data Schema

This document defines the **standard structure** for all customer feedback records used in the Insights Hub platform.

All components (frontend form, API Gateway, Lambda, S3 storage, Athena, and QuickSight) must follow this schema.

---

## 1. Record Structure (Logical Schema)

Each feedback item represents a **single submission** from a customer.

### 1.1 Fields

| Field                            | Type    | Required | Source           | Description                                    |
| -------------------------------- | ------- | -------: | ---------------- | ---------------------------------------------- |
| `feedback_id`                    | string  |      yes | Lambda           | Unique ID (UUID) for the submission.           |
| `submitted_at`                   | string  |      yes | Lambda           | ISO 8601 UTC timestamp when stored.            |
| `survey_version`                 | string  |      yes | Frontend         | Survey version, e.g., `short_v1`.              |
| `environment`                    | string  |       no | API/Lambda       | `dev` or `demo` (can be injected).             |
| `ratings`                        | object  |      yes | Frontend         | Numeric ratings (1–10).                        |
| `ratings.overall_satisfaction`   | integer |      yes | Frontend         | 1–10 overall satisfaction.                     |
| `ratings.speed_satisfaction`     | integer |      yes | Frontend         | 1–10 speed satisfaction.                       |
| `ratings.recommend_likelihood`   | integer |      yes | Frontend         | 1–10 likelihood to recommend.                  |
| `open_text`                      | object  |      yes | Frontend         | Open-ended answers.                            |
| `open_text.improve_one_thing`    | string  |      yes | Frontend         | What to improve.                               |
| `open_text.keep_doing_one_thing` | string  |      yes | Frontend         | What to keep doing.                            |
| `topic`                          | string  |       no | Frontend         | Optional topic like `delivery`, `support`.     |
| `metadata`                       | object  |       no | Frontend/Lambda  | Optional context (userAgent, locale, etc.).    |
| `metadata.userAgent`             | string  |       no | Frontend         | Browser user agent string.                     |
| `metadata.locale`                | string  |       no | Frontend         | Browser locale.                                |
| `year`                           | string  |      yes | Lambda (derived) | Partition: derived from `submitted_at` (YYYY). |
| `month`                          | string  |      yes | Lambda (derived) | Partition: derived from `submitted_at` (MM).   |
| `day`                            | string  |      yes | Lambda (derived) | Partition: derived from `submitted_at` (DD).   |

---

## 2. Frontend → API Payload Schema

This is what the **browser sends** to the API (`POST /feedback`).

The frontend does **not** need to send `feedback_id`, `timestamp`, `year`, `month`, or `day`.  
These are added by the Lambda function.

### 2.1 Request Body (from frontend)

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
