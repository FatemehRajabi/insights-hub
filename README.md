# Insights Hub – Customer Feedback & Insights Platform

A serverless, cloud-native application for collecting customer feedback and generating actionable insights using AWS services.

# Performance Expectations (Demo Scope)

The InsightHub ingestion pipeline is designed for low-volume, interactive demo traffic rather than production-scale workloads.

## Expected submission latency:

< 500 ms per feedback submission (end-to-end: API Gateway → Lambda → S3)

## Throughput:

Low volume (tens of requests per minute during demos)

## Bottleneck considerations:

- API Gateway request validation minimizes invalid requests

- Lambda execution time expected to be short (< 1 second)

# Compliance, Security & Governance Considerations

The following controls ensure basic security and compliance for the capstone demo:

## PII handling

- The feedback form does not intentionally collect PII

- Open-text fields are treated as unstructured input and stored as-is

## Encryption

- Data encrypted in transit via HTTPS

- S3 objects encrypted at rest using SSE-S3

## Access control

- S3 access restricted via IAM roles

- Root account locked down with MFA

- Daily operations performed using role-based IAM access

## Logging & monitoring

- Lambda execution logs captured in Amazon CloudWatch Logs

- API Gateway provides request-level metrics for monitoring

- These controls are sufficient for a demo environment and can be extended for production use.

## Tech Stack

Frontend: Simple HTML/JS feedback form

API Layer: Amazon API Gateway

Compute: AWS Lambda

Storage: Amazon S3

Tables: AWS Glue Data Catalog

Analytics: Athena

Visualization & AI Assistant: QuickSight + Amazon Q

## Features

Customer feedback form

API to ingest feedback

Store data in S3 (structured JSON/CSV)

Query data using Athena through the Glue Data Catalog

Dashboards and insights in QuickSight

Natural language Q&A powered by Amazon Q

## Tagging Strategy

All AWS resources for the InsightHub project follow a consistent tagging strategy to support cost tracking, environment separation, and ownership.

| Tag Key     | Tag Value           |
| ----------- | ------------------- |
| Project     | InsightHub          |
| Environment | dev / demo          |
| Owner       | InsightHub-Team     |
| CostCenter  | PerScholas-Capstone |

## S3 Bucket Strategy (InsightHub)

### Goal

Store customer feedback data and analytics outputs in S3.

### Buckets

We will use one S3 bucket with environment separation via prefixes.

**Bucket name pattern:**

- `insighthub-data-...`

### Partitioning approach

We partition data by environment and date (year/month/day).

### Data formats

- **Raw:** JSON
- **Processed:** JSON
