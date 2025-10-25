# 3rd Conference on Global Innovation and Intellectual Property 2025

## Quick Summary

Successfully created SQL scripts and helper files to add the 3rd Conference on Global Innovation and Intellectual Property (May 17-18, 2025, Shanghai, China) to your database.

## What Was Added

### 1. News Article
A comprehensive call for participation announcement, including:
- Conference theme and context
- Key discussion topics (Finding Facts, Understanding Complexities, Developing Toolboxes)
- Conference highlights and sessions
- Co-sponsors and organizers
- Contact information

### 2. Conference Entry
Detailed conference record with:
- Full conference description and context
- Three key themes with detailed explanations
- Complete program for both days
- Session topics and poster groups
- Co-sponsors, co-organizers, and organization committee
- Registration information

### 3. Event Entry
Event listing with:
- Detailed two-day agenda with specific times
- Session descriptions
- Poster session groups
- Registration and contact information
- Venue details
- Capacity information (200 participants)

## How to Add to Database

### Option 1: Windows Batch Script
```bash
add-giip3-conference.bat
```

### Option 2: Linux/Mac Shell Script
```bash
chmod +x add-giip3-conference.sh
./add-giip3-conference.sh
```

### Option 3: Direct SQL
```bash
psql -h localhost -p 5432 -U giip_user -d giip -f add-giip3-conference-2025.sql
```

### Option 4: Docker
```bash
docker exec -i giip-db psql -U giip_user -d giip < add-giip3-conference-2025.sql
```

## Conference Details

### Basic Information
- **Title**: 3rd Conference on Global Innovation and Intellectual Property
- **Subtitle**: Firm Strategies and Policy Challenges in a Rapidly Changing World
- **Date**: May 17-18, 2025
- **Location**: School of Management, Fudan University, Shanghai, China
- **Capacity**: 200 participants
- **Contact**: GIIP2025@fdsm.fudan.edu.cn

### Conference Theme

Global competition is increasingly characterized by competition for technological leadership. The boundary between firm competitiveness and institutional infrastructure is blurring as intellectual properties, technology standards, and business platforms play increasingly prominent roles. Recent developments in healthcare, AI, and electric vehicles demonstrate how states have come to the forefront of market competition. The coordination and competition among public and private entities across nations will shape future trajectories of global markets.

### Key Discussion Areas

#### 1. Finding Facts
- What are the realities on the ground?
- What are important trends that may shed light to the future?
- Moving beyond entrenched opinions and stereotypical views
- Identifying facts and establishing robust explanations

#### 2. Understanding Complexities
- Is strong IP protection always good?
- Is knowledge outflow always bad?
- How does our understanding of IP in domestic settings apply to global competition?
- What is the right level of indigenous innovation given global interdependence?

#### 3. Developing Toolboxes
- What tools can businesses use beyond filing patents to navigate risky R&D?
- What policy tools beyond IP courts can motivate innovation while reducing risk?
- Will big data and AI help firms see the competitive landscape more clearly?

## Detailed Agenda

### Day 1 - Saturday, May 17, 2025

| Time | Activity |
|------|----------|
| 8:00-8:30am | Registration |
| 8:30-8:50am | Opening Remarks |
| 8:50-10:00am | **Session 1**: Innovation and IP Strategies under De-Coupling |
| 10:00-10:20am | Tea Break |
| 10:20-11:10am | **Session 2**: Secret Patenting and Patenting with Trade Secret |
| 11:10am-12:00pm | **Session 3**: Innovation in the Rapidly Changing World: The Role of Academics |
| 12:00-1:30pm | Lunch |
| 1:30-2:40pm | **Session 4**: Competitive Advantages in a Connected World |
| 2:40-3:30pm | **Session 5**: The Effect of AI on Labor, Competition and Intellectual Property Rights |
| 3:30-3:50pm | Tea Break |
| 3:50-5:00pm | **Session 6**: Innovation and Governance with Informal Institutions |
| 5:00-6:15pm | **Drink and Poster Session** |
| | - Group 1: Patents as probable rights |
| | - Group 2: IP strategy and firm incentives |
| | - Group 3: The impact of trade friction on innovation strategies |
| | - Group 4: New tools in IP research |
| 6:00pm | Dinner for all registered participants |

### Day 2 - Sunday, May 18, 2025

| Time | Activity |
|------|----------|
| 8:30-9:20am | **Session 7**: Institutions for Innovation: IP and Industrial Policies |
| 9:20-9:40am | **Session 8**: Voices from Policymakers |
| 9:40-10:00am | Tea Break |
| 10:00-11:30am | **Session 9**: Voices from Business Leaders |
| 11:30am-12:40pm | **Session 10**: Voices from Legal Professionals |
| 12:40-12:45pm | Closing Remarks |
| 12:45pm | Lunch, Social, and Farewell |

## Session Topics

### Research Sessions (Day 1)
1. **Innovation and IP Strategies under De-Coupling** - Examining how firms adapt their innovation and IP strategies in an era of technological decoupling
2. **Secret Patenting and Patenting with Trade Secret** - Exploring the strategic use of patents and trade secrets
3. **Innovation in the Rapidly Changing World: The Role of Academics** - Understanding how academic research contributes to innovation
4. **Competitive Advantages in a Connected World** - Analyzing how firms build and maintain competitive advantages in interconnected markets
5. **The Effect of AI on Labor, Competition and Intellectual Property Rights** - Investigating AI's transformative impact on multiple dimensions
6. **Innovation and Governance with Informal Institutions** - Examining the role of informal institutions in innovation governance

### Practitioner Sessions (Day 2)
7. **Institutions for Innovation: IP and Industrial Policies** - Discussing institutional frameworks for innovation
8. **Voices from Policymakers** - Perspectives from government and policy experts
9. **Voices from Business Leaders** - Insights from industry executives
10. **Voices from Legal Professionals** - Legal perspectives on IP and innovation challenges

### Poster Session Groups
- **Group 1**: Patents as probable rights
- **Group 2**: IP strategy and firm incentives
- **Group 3**: The impact of trade friction on innovation strategies
- **Group 4**: New tools in IP research

## Co-Sponsors

1. **McDonnell International Scholars Academy**, Washington University in St. Louis
2. **School of Management**, Fudan University
3. **Guanghua School of Management**, Peking University
4. **Olin Business School**, Washington University in St. Louis

## Co-Organizers

- **Prof. Changqi Wu** - Peking University
- **Prof. Minyuan Zhao** - Washington University in St. Louis

## Organization Committee

- **Prof. Xuhong Li** - Fudan University
- **Prof. Tian Wei** - Fudan University

## Files Created

1. **add-giip3-conference-2025.sql** - Main SQL script with all INSERT statements
2. **add-giip3-conference.bat** - Windows batch script for easy execution
3. **add-giip3-conference.sh** - Linux/Mac shell script for easy execution
4. **GIIP3_CONFERENCE_2025_SUMMARY.md** - This summary document (English)
5. **全球创新与知识产权第三届会议-添加说明.md** - Summary document (Chinese)

## Verification

After running the script, verify the data was added:

```sql
-- Check news article
SELECT title, published_date FROM news 
WHERE title LIKE '%3rd Conference on Global Innovation%';

-- Check conference entry
SELECT title, date_range, location FROM conferences 
WHERE title LIKE '%3rd Conference on Global Innovation%';

-- Check event entry
SELECT title, date, location FROM events 
WHERE title LIKE '%3rd Conference on Global Innovation%';
```

## Key Features

- **Future Event**: This is an upcoming conference (May 2025), so it will appear in upcoming events listings
- **Cross-Disciplinary**: Brings together academics, policymakers, business leaders, and legal professionals
- **Timely Topics**: Addresses current challenges in global innovation including AI, de-coupling, and trade friction
- **Practical Focus**: Includes both research presentations and practitioner perspectives
- **Networking Opportunities**: Features poster sessions, drinks reception, and social events

## Notes

- All entries are created by the admin@giip.info user
- The news article uses CURRENT_DATE so it will show as recently published
- This is a future event (May 2025), making it ideal for the upcoming events section
- Content emphasizes the practical and policy-relevant aspects of the conference
- Contact email (GIIP2025@fdsm.fudan.edu.cn) is included for registration inquiries

## Next Steps

1. Run the appropriate script for your system
2. Verify the data was added correctly
3. Check the frontend to see how the conference appears in:
   - News section (call for participation)
   - Events listing (upcoming events)
   - Conference information
4. Update website banners or featured events to highlight this upcoming conference
5. Consider adding a registration form or link to the conference brochure

The GIIP3 conference data is now ready to be displayed on your website!
