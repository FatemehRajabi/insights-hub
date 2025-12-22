# Insights Hub – Customer Feedback & Insights Platform

A serverless, cloud-native application for collecting customer feedback and generating actionable insights using AWS services.

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
