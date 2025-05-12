# Firestore Database Schema

This document outlines the schema for the Firestore database used in the Gorlea Snaps application.

## Collections

### users

The `users` collection stores information about registered users.

**Document ID**: User's UID from Firebase Authentication

**Fields**:
- `displayName` (string): User's display name
- `email` (string): User's email address
- `photoURL` (string, optional): URL to user's profile picture
- `createdAt` (timestamp): When the user account was created
- `lastLoginAt` (timestamp): When the user last logged in
- `preferences` (map, optional):
  - `theme` (string): User's preferred theme (e.g., "light", "dark")
  - `notifications` (boolean): Whether the user wants to receive notifications

**Example**:
```json
{
  "displayName": "John Doe",
  "email": "john.doe@example.com",
  "photoURL": "https://example.com/profile.jpg",
  "createdAt": "2023-05-15T10:30:00Z",
  "lastLoginAt": "2023-05-16T08:45:00Z",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

### stories

The `stories` collection stores generated stories and their associated metadata.

**Document ID**: Auto-generated

**Fields**:
- `userId` (string): UID of the user who created the story
- `title` (string): Title of the story
- `content` (string): The generated story text
- `imageURL` (string): URL to the uploaded image in Firebase Storage
- `genre` (string): The genre selected for the story (e.g., "fantasy", "sci-fi", "horror")
- `createdAt` (timestamp): When the story was created
- `isPublic` (boolean): Whether the story is publicly viewable
- `likes` (number): Number of likes the story has received
- `tags` (array): Array of tags associated with the story

**Example**:
```json
{
  "userId": "user123",
  "title": "The Mysterious Forest",
  "content": "Once upon a time in a mysterious forest...",
  "imageURL": "https://storage.googleapis.com/gorlea-snaps.appspot.com/images/image123.jpg",
  "genre": "fantasy",
  "createdAt": "2023-05-16T14:20:00Z",
  "isPublic": true,
  "likes": 5,
  "tags": ["forest", "mystery", "adventure"]
}
```

### favorites

The `favorites` collection stores references to stories that users have favorited.

**Document ID**: Auto-generated

**Fields**:
- `userId` (string): UID of the user who favorited the story
- `storyId` (string): ID of the favorited story
- `createdAt` (timestamp): When the story was favorited

**Example**:
```json
{
  "userId": "user123",
  "storyId": "story456",
  "createdAt": "2023-05-17T09:15:00Z"
}
```

## Subcollections

### users/{userId}/notifications

Stores notifications for a specific user.

**Document ID**: Auto-generated

**Fields**:
- `type` (string): Type of notification (e.g., "like", "comment", "system")
- `message` (string): Notification message
- `read` (boolean): Whether the notification has been read
- `createdAt` (timestamp): When the notification was created
- `relatedId` (string, optional): ID of the related resource (e.g., story ID)

**Example**:
```json
{
  "type": "like",
  "message": "Someone liked your story 'The Mysterious Forest'",
  "read": false,
  "createdAt": "2023-05-18T10:30:00Z",
  "relatedId": "story456"
}
```

## Indexes

The following composite indexes will be needed:

1. `stories` collection:
   - `userId` (ascending) + `createdAt` (descending)
   - `isPublic` (ascending) + `createdAt` (descending)
   - `genre` (ascending) + `createdAt` (descending)

2. `favorites` collection:
   - `userId` (ascending) + `createdAt` (descending)

## Implementation Notes

- Use Firebase Authentication UID as the document ID for the `users` collection to easily link users to their data
- Use Firestore timestamps for all date fields
- Implement security rules to ensure users can only access their own data
- Consider using Firestore's array-contains queries for searching by tags
- Use batch writes when updating multiple documents to ensure atomicity
