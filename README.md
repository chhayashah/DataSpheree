# DataSphere — Real-Time Data Analytics Platform

> Enterprise-level full-stack data platform built with Node.js, React, MongoDB, and Socket.io

## Overview

DataSphere is a production-grade data analytics platform that simulates modern cloud data systems. It supports real-time data ingestion, processing, and visualization with AI-powered insights.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Frontend | React (CRA) |
| Real-time | Socket.io |
| Auth | JWT + RBAC |
| Logging | Winston |
| Container | Docker + Compose |

## Features

### Core
- JWT Authentication with Role-Based Access Control (Admin/User)
- CSV file upload and automatic data processing
- REST APIs with MVC + Service layer pattern
- MongoDB aggregation pipelines for analytics
- Centralized error handling middleware
- API rate limiting and security (Helmet, CORS)

### Advanced
- Real-time dashboard updates via Socket.io
- Event-driven architecture (EventEmitter)
- AI-powered insights (trend analysis + anomaly detection)
- User activity tracking (login, upload history)
- Winston logging with file + console transport
- Feature-based React architecture

## Architecture