# Adding the 2019 IP Conference to the Database

## Overview

This directory contains scripts to add the 2019 "Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World" conference to the GIIP database.

The conference was held at the Penn Wharton China Center in Beijing, China, on June 28-29, 2019.

## What Gets Added

### 1. Event Entry
- **Title**: Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World
- **Dates**: June 28-29, 2019
- **Location**: Penn Wharton China Center, Beijing, China
- **Description**: Full conference description including themes, sponsors, and organizers

### 2. News Article
- **Title**: GIIP Hosts Major Conference on Innovation and Intellectual Property in Beijing
- **Published Date**: June 30, 2019
- **Content**: Comprehensive article covering conference highlights, speakers, sessions, and impact

## Prerequisites

Before running the scripts, ensure:

1. ✅ **Backend server is running**
   ```bash
   cd backend
   npm start
   ```

2. ✅ **Database is set up and running**
   - PostgreSQL must be running
   - Database schema must be initialized
   - Migrations must be applied

3. ✅ **Admin user exists**
   - Email: `admin@giip.info`
   - Password: `Admin@2025`
   - (Or update credentials in the script files)

## Available Scripts

### Option 1: Add Everything (Recommended)

**Windows:**
```bash
cd backend/scripts
add-ip-conference-complete.bat
```

**Linux/Mac:**
```bash
cd backend/scripts
node add-ip-conference-complete.js
```

This script adds both the event and news article in one go.

### Option 2: Add Event Only

**Windows:**
```bash
cd backend/scripts
add-ip-conference-2019.bat
```

**Linux/Mac:**
```bash
cd backend/scripts
node add-ip-conference-2019.js
```

### Option 3: Add News Article Only

**Linux/Mac:**
```bash
cd backend/scripts
node add-ip-conference-news.js
```

## Script Output

Successful execution will show:

```
================================================================================
Adding 2019 IP Conference - Event and News Article
================================================================================

Logging in as admin...
✓ Login successful

Creating conference event...
✓ Event created successfully
  Event ID: 5

Creating news article...
✓ News article created successfully
  News ID: 12

================================================================================
✓ Successfully added conference event and news article!
================================================================================

Summary:
  Event ID: 5
  Event URL: http://localhost:8080/event-detail.html?id=5
  News ID: 12
  Title: Innovation and Intellectual Property: Firm Strategies and...
  Location: Penn Wharton China Center, Beijing, China
  Dates: June 28-29, 2019
```

## Verification

After running the scripts, verify the data was added:

### 1. Check Event
```bash
curl -X GET http://localhost:3000/api/events/[EVENT_ID] \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Or visit: `http://localhost:8080/event-detail.html?id=[EVENT_ID]`

### 2. Check News Article
```bash
curl -X GET http://localhost:3000/api/news/[NEWS_ID] \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Or visit the news section on the website.

### 3. Check Homepage
Visit `http://localhost:8080` to see if the event appears in the upcoming events section (it won't since it's a past event, but it will be in the events archive).

## Troubleshooting

### Error: "Login failed"
- **Solution**: Verify admin credentials are correct
- Check that the admin user exists in the database
- Update credentials in the script if needed

### Error: "Connection refused"
- **Solution**: Ensure backend server is running on port 3000
- Check that the API_BASE_URL in the script is correct

### Error: "Event creation failed"
- **Solution**: Check that all required fields are present
- Verify the events table exists in the database
- Check database logs for detailed error messages

### Error: "News creation failed"
- **Solution**: Check that all required fields are present
- Verify the news table exists in the database
- Ensure the published_date format is correct (YYYY-MM-DD)

## Customization

To modify the conference data:

1. Open the script file (e.g., `add-ip-conference-complete.js`)
2. Edit the `conferenceEvent` or `newsArticle` objects
3. Save and run the script again

### Example: Change Admin Credentials

```javascript
const ADMIN_EMAIL = 'your-admin@example.com';
const ADMIN_PASSWORD = 'YourPassword123';
```

### Example: Change API URL

```javascript
const API_BASE_URL = 'http://your-server:3000/api';
```

## Database Schema

The scripts use these database tables:

### Events Table
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### News Table
```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    published_date DATE NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints Used

- `POST /api/auth/login` - Authenticate and get JWT token
- `POST /api/events` - Create new event
- `POST /api/news` - Create new news article

## Security Notes

- The scripts use admin credentials to create content
- JWT tokens are obtained dynamically and not stored
- Credentials should be updated for production use
- Consider using environment variables for sensitive data

## Related Documentation

- [Events API Documentation](../docs/EVENTS_API.md)
- [News API Documentation](../docs/NEWS_API.md)
- [RBAC Guide](../docs/RBAC_GUIDE.md)
- [Database Schema](../schema.sql)

## Support

If you encounter issues:

1. Check the error message carefully
2. Review the troubleshooting section above
3. Verify all prerequisites are met
4. Check backend server logs
5. Check database logs

## License

These scripts are part of the GIIP project and follow the same license.
