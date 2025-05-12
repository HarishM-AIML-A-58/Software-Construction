# 📱 TextSphere - SMS & Chat Messaging Platform

A modern, scalable, **web-based chat application** built with **Azure services** that simulates SMS/MMS messaging with support for real-time communication, delivery status, multimedia sharing, group messaging, and campaign notifications.



---

## 📌 Features

### ✅ Core Messaging
- Send and receive real-time messages between registered users
- 160-character message limit
- Delivery status: `Sent`, `Delivered`, `Read`
- Push-like notifications on new messages

### 📷 MMS Support
- Upload and send images or media as part of messages
- Store files securely using Azure Blob Storage

### 👥 Group Chats
- Create, join, and manage group chats
- Add or remove members from groups
- Real-time updates delivered to all participants

### 📣 SMS Campaigns (Admin)
- Admins can broadcast messages to all users or targeted segments
- Campaign messages appear as regular messages for recipients

---

## 💻 Tech Stack

| Layer            | Technology Used                     |
|------------------|--------------------------------------|
| **Frontend**     | HTML + CSS+ Js                       |
| **Backend**      | Azure Functions (HTTP Trigger)       |
| **Database**     | Azure Cosmos DB (NoSQL)              |
| **Storage**      | Azure Blob Storage (for MMS)         |
| **Hosting**      | Azure Static Web Apps                |
| **Authentication** | Simple Auth (username) or Azure AD B2C |

---


---

## 🛠️ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/textsphere.git
cd textsphere
```

### 2. Environment Variables
Create a `.env` file for Azure Function App:
```env
COSMOS_DB_CONNECTION_STRING=your_cosmosdb_conn
BLOB_STORAGE_CONNECTION_STRING=your_blob_conn
SIGNALR_CONNECTION_STRING=your_signalr_conn
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Backend Setup
```bash
cd api
func start
```

> Make sure you’ve installed the [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)

---

## 🧪 Testing

- ✅ Unit-tested individual Azure Functions
- ✅ UI tested using manual test cases and sample user sessions
- ✅ Load tested with SignalR for concurrent users

---

## 📈 Azure DevOps (Boards & Delivery Plan)

- Created using Azure Boards with proper **Epics**, **Features**, **User Stories**, and **Tasks**
- Work assigned across 3 developers:
  - `Harish M` – Azure setup, SignalR, Function API
  - `Ganesh` – Frontend and Chat UI
  - `Aniruth` – MMS, Group Chat

> Backlog, queries, and analytics configured

---



## 🚀 Future Improvements

- ✅ Authentication with Azure AD B2C
- ✅ Dark Mode
- ✅ Message Search and Reactions
- ✅ Mobile App (React Native / Flutter)

---

## 👨‍💻 Contributors

- [Harish M](https://github.com/harishm)
- [Ganesh](https://github.com/GaneshS-AIML-46)
- [Aniruth](https://github.com/AniruthSV)

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 🔗 Useful Links

- [Azure Functions Docs](https://learn.microsoft.com/en-us/azure/azure-functions/)
- [Azure SignalR Serverless Guide](https://learn.microsoft.com/en-us/azure/azure-signalr/signalr-concept-serverless-development-config)
- [Azure Cosmos DB NoSQL Guide](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/introduction)
- [Blob Storage for Images](https://learn.microsoft.com/en-us/azure/storage/blobs/)

---

