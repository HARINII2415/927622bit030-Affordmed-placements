# 📈 Stoxify - Real-Time Stock Aggregation Dashboard Question -1

![Banner](https://img.shields.io/badge/React-Vite-blue?style=for-the-badge&logo=react)  ![Status](https://img.shields.io/badge/Status-Working-brightgreen?style=for-the-badge)

> 🔥 A full stack stock dashboard that shows real-time stock trends, price statistics, and visualizes market activity in a smooth, interactive UI.

---
 Watch Full live => 🚀[live](https://stoxiffy.onrender.com/)
## 🚀 Features

- 📊 Real-time Stock Chart with Vite + React
- 🧮 Backend with API endpoints
- 🔁 Dynamic data updates using Fetch
- 📋 Detailed Stock Stats (Price, Volatility, Market Cap)
- 💡 Clean UI with Tab-based Navigation (Stock Charts / Correlation)
- 🌐 Fully responsive & modern design

---

## 📸 Screenshots

| Dashboard View | Correlation View |
|----------------|----------|
| ![UI](./screenshots/dashboard.png) | ![API](./screenshots/correlation.png) |

---

## 🧰 Tech Stack

| Frontend | Backend |
|----------|---------|
| React (Vite) |
| TypeScript  |
| Recharts | REST APIs |
| CSS Modules | JSON In-Memory DB |

---
# ⚙️ Average Calculator HTTP Microservice- Question 2


![Status](https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge)

A scalable microservice that consumes third-party numeric data and returns a rolling average result in real time, built for Affordmed's full stack technical assessment.

---


Supported `numberid` types:
- `p` → Prime numbers
- `f` → Fibonacci numbers
- `e` → Even numbers
- `r` → Random numbers

---

## 🛠️ Features

- 📥 Fetches numbers from a given third-party server
- 🧠 Maintains a dynamic sliding window of the last N unique numbers
- 📊 Calculates and returns a rolling average
- ❌ Ignores slow responses (over 500ms) and duplicates
- ⚡ Responds in under 500ms consistently
- ✅ JSON response format

---

## ⚙️ How It Works

> The service fetches numbers from the third-party test API, manages a rolling window of unique numbers, and calculates the average.

### ✅ Response Format

```json
{
  "windowPrevState": [1, 3, 5],
  "windowCurrState": [1, 3, 5, 7],
  "numbers": [7],
  "avg": 4.00
}







