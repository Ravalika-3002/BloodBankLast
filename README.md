#  BloodBankLast

A full-stack **Blood Bank Management System** built using **MERN Stack**  
(MongoDB, Express.js, React.js, Node.js).

This application helps manage blood donors, hospitals, blood inventories, and blood requests efficiently.

---

##  Features

###  Admin
- Approve / reject hospitals
- View all hospital inventories
- View donors and donation records
- Monitor system analytics

###  Hospital
- Record blood donations
- Manage blood inventory (all blood groups)
- View low-stock alerts
- Accept / decline blood requests
- View donation history

###  Donor
- Register and login
- Donate blood to nearby hospitals
- View donation history

---

##  Blood Groups Supported
- A+, A-
- B+, B-
- O+, O-
- AB+, AB-

---

##  Tech Stack

### Frontend
- React.js
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---



##  Project Structure

BloodBankLast
│
├── Backend
│ ├── config
│ ├── middleware
│ ├── models
│ ├── routes
│ ├── server.js
│ └── .env
│
├── blood-bank-frontend
│ ├── src
│ ├── public
│ └── package.json
│
└── README.md
##  How to Run the Project


```bash
cd Backend
npm install
npm start


cd blood-bank-frontend
npm install
npm start

Create a .env file inside Backend:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
###############
Status:
Still under development





