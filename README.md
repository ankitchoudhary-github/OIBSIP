# OIBSIP (Oasis Infobyte Tech Internship Project)

This repository contains the projects and assignments I completed during my AICTE Oasis Infobyte Internship Program as a Web Development Intern at Oasis Infobyte. It showcases the Level 3 task completed during my internship period.

# 🍕 Pizza Delivery Full-Stack Application

## Level 3

## Task 1: Pizza Delivery Full-Stack Application

### Objective

Build a production-grade, full-stack pizza ordering and inventory management platform with:

- Separate Admin and User roles
- Real-time order tracking
- Payment integration
- Automated stock notifications

### Tech Stack

- **React.js** — Frontend
- **Node.js + Express.js** — Backend
- **MongoDB** — Database
- **Razorpay** — Payment
- **Jest** — Test mode

---

# Feature Checklist

## User Side

- [ ] User registration with email verification
- [ ] User login with JWT-based authorization
- [ ] Forgot password flow (email reset link)
- [ ] Dashboard displaying available pizza varieties
- [ ] Custom pizza builder
  - [ ] Step 1: Choose a pizza base (5 options)
  - [ ] Step 2: Choose a sauce (5 options)
  - [ ] Step 3: Choose a cheese type
  - [ ] Step 4: Choose vegetables (multiple select)
- [ ] Order summary page before payment
- [ ] Razorpay checkout integration (test mode — clicking “Success” confirms the order)
- [ ] Real-time order status display on user dashboard
  - Order Received → In Kitchen → Sent to Delivery

## Admin Side

- [ ] Separate admin login (not accessible from the user registration flow)
- [ ] Inventory dashboard showing current stock of:
  - Pizza bases
  - Sauces
  - Cheeses
  - Vegetables
- [ ] Stock automatically decremented after each order
- [ ] Manual stock update capability for each inventory item
- [ ] Automated email notification to admin when any inventory item falls below a configurable threshold
  - e.g., pizza bases < 20 units → implement using a scheduled job
- [ ] Order management panel: view all incoming orders, update status for each order
- [ ] Status change reflected in real-time on the user’s dashboard (use polling or WebSockets)


