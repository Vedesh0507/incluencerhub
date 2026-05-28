# Phase 5A — Thunder Client Testing Guide

## Base URL
```
http://localhost:5000/api
```

---

## STEP 1: Login as Business User (get token)

**POST** `http://localhost:5000/api/auth/login`

**Body (JSON):**
```json
{
  "email": "business@example.com",
  "password": "yourpassword"
}
```

**Response** — copy the `token` value. Set it in all subsequent requests:
```
Headers: Authorization: Bearer <TOKEN>
```

---

## STEP 2: Get All Creator Profiles (find a creatorProfile ID)

**GET** `http://localhost:5000/api/creators`

No auth required. Copy `_id` of a creator profile from the response.

---

## STEP 3: Send a Collaboration Request

**POST** `http://localhost:5000/api/collaborations`

**Headers:**
```
Authorization: Bearer <BUSINESS_TOKEN>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "creatorProfile": "<CREATOR_PROFILE_ID>",
  "campaignTitle": "Restaurant Launch Campaign",
  "description": "Need an Instagram reel promotion for our new menu launch.",
  "budget": 5000,
  "barter": false,
  "deliverables": [
    "1 Instagram Reel",
    "2 Story Posts"
  ],
  "platform": "instagram",
  "deadline": "2026-06-01"
}
```

**Expected response (201):**
```json
{
  "success": true,
  "message": "Collaboration request sent successfully",
  "data": {
    "_id": "...",
    "status": "pending",
    ...
  }
}
```

---

## STEP 4: Get Creator Inbox (login as creator first)

**POST** `http://localhost:5000/api/auth/login` with creator credentials → get creator token.

**GET** `http://localhost:5000/api/collaborations/creator`

**Headers:**
```
Authorization: Bearer <CREATOR_TOKEN>
```

**Expected response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [ { "_id": "...", "status": "pending", "businessUser": { "name": "..." }, ... } ]
}
```

---

## STEP 5: Get Business Sent Requests

**GET** `http://localhost:5000/api/collaborations/business`

**Headers:**
```
Authorization: Bearer <BUSINESS_TOKEN>
```

**Expected response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [ { "_id": "...", "status": "pending", "creatorProfile": { "username": "..." }, ... } ]
}
```

---

## STEP 6: Accept a Collaboration (as creator)

**PUT** `http://localhost:5000/api/collaborations/<COLLAB_ID>/status`

**Headers:**
```
Authorization: Bearer <CREATOR_TOKEN>
Content-Type: application/json
```

**Body (JSON):**
```json
{ "status": "accepted" }
```

**Expected response (200):**
```json
{
  "success": true,
  "message": "Collaboration request accepted successfully",
  "data": { "_id": "...", "status": "accepted", ... }
}
```

---

## STEP 7: Reject a Collaboration (as creator)

**PUT** `http://localhost:5000/api/collaborations/<COLLAB_ID>/status`

**Headers:**
```
Authorization: Bearer <CREATOR_TOKEN>
Content-Type: application/json
```

**Body (JSON):**
```json
{ "status": "rejected" }
```

---

## Error Cases to Verify

| Scenario | Expected HTTP | Expected message |
|---|---|---|
| Business tries to access `/creator` | 403 | "Only creator users can access the collaboration inbox" |
| Creator tries to POST a request | 403 | "Only business users can send collaboration requests" |
| Invalid `creatorProfile` ID | 404 | "Creator profile not found" |
| Invalid status value | 400 | "Status must be one of: accepted, rejected, completed" |
| Creator updates someone else's collab | 403 | "You are not authorized to update this collaboration request" |
| No token provided | 401 | "Not authorized, no token" |
