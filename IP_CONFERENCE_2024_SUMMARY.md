# International Conference on Intellectual Property and Innovation 2024

## Quick Summary

Successfully created SQL scripts and helper files to add the International Conference on Intellectual Property and Innovation (May 25-26, 2024, Hangzhou, China) to your database.

## What Was Added

### 1. News Article
A comprehensive news article summarizing the conference, including:
- Conference highlights and key outcomes
- Plenary speakers and topics
- Research sessions overview
- Panel discussions
- Inaugural ceremony of Zhejiang Provincial Data Intellectual Property Research Center

### 2. Conference Entry
Detailed conference record with:
- Full conference description
- List of distinguished speakers
- Conference themes and topics
- Research presentation details
- Panel discussion information
- Complete summary

### 3. Event Entry
Event listing with:
- Complete two-day agenda
- Registration information
- Venue details
- Capacity information (150 participants)
- Day-by-day schedule

## How to Add to Database

### Option 1: Windows Batch Script
```bash
add-ip-conference.bat
```

### Option 2: Linux/Mac Shell Script
```bash
chmod +x add-ip-conference.sh
./add-ip-conference.sh
```

### Option 3: Direct SQL
```bash
psql -h localhost -p 5432 -U giip_user -d giip -f add-ip-conference-2024.sql
```

### Option 4: Docker
```bash
docker exec -i giip-db psql -U giip_user -d giip < add-ip-conference-2024.sql
```

## Conference Details

### Schedule
- **Registration**: May 24, 2024, 14:00-21:00 (Ou Ya Mei International Hotel)
- **Conference**: May 25-26, 2024 (Hai Na Yuan Conference Room, Zijingang Campus)

### Day 1 - May 25, 2024

**Morning Sessions**
- 08:30-08:40: Welcome
- 08:40-09:20: Plenary Speech - IPR Enforcement and Firm Performance
- 09:20-10:10: Session 1 - Patenting Strategies
- 10:30-11:35: Session 2 - What Can We Learn from Data?
- 11:35-12:25: Session 3 - Litigation and the Direction of Innovation

**Afternoon Sessions**
- 13:50-14:30: Plenary Speech - Disruption and Open Innovation
- 14:30-15:20: Session 4 - Foreignness and Emergingness
- 15:40-16:45: Session 5 - Value Appropriation
- 16:35-18:00: Poster Session
- 18:00-20:00: Conference Dinner

### Day 2 - May 26, 2024

- 09:00-10:00: Inaugural Ceremony - Zhejiang Provincial Data Intellectual Property Research Center
- 10:15-11:15: Plenary Speech - Frontiers of IP and Innovation Management
- 11:15-12:15: Panel 1 - China's IP Legal System
- 13:15-14:15: Panel 2 - IP Management and Innovation of Multinational Enterprises
- 14:15-15:15: Panel 3 - IP Management in Automobile Industry
- 15:15-15:30: Closing Ceremony

## Key Speakers

- **Prof. Xiaobo Wu** - Zhejiang University
- **Prof. Shaker Zahra** - University of Minnesota
- **Prof. Michael Leiblein** - Ohio State University
- **Prof. Tony Tong** - University of Colorado Boulder
- **Prof. Jiatao Li** - Hong Kong University of Science and Technology
- **Prof. Catherine Magelssen** - London Business School
- **Ruud Peters** - Peters IP Consultancy

## Research Topics Covered

1. **Patenting Strategies** - Utility model patents, dual-application strategies
2. **Data-Driven Innovation** - Machine learning for technology prediction, false science detection
3. **Patent Litigation** - Impact on innovation direction, startup financing
4. **Foreignness & Emergingness** - IP litigation in emerging markets, international standards
5. **Value Appropriation** - Patent invalidation, technology search, M&A transactions
6. **IP Legal Systems** - China's IP framework, policy developments
7. **Multinational IP Management** - Cross-border strategies, enforcement
8. **Industry-Specific IP** - Automotive sector focus

## Participating Institutions

- Zhejiang University
- Tsinghua University
- Peking University
- Renmin University of China
- University of Minnesota
- Ohio State University
- University of Colorado Boulder
- Hong Kong University of Science and Technology
- National University of Singapore
- McGill University
- CEIBS
- And many more...

## Files Created

1. **add-ip-conference-2024.sql** - Main SQL script with all INSERT statements
2. **add-ip-conference.bat** - Windows batch script for easy execution
3. **add-ip-conference.sh** - Linux/Mac shell script for easy execution
4. **IP_CONFERENCE_2024_SUMMARY.md** - This summary document (English)
5. **知识产权与创新国际会议-添加说明.md** - Summary document (Chinese)

## Verification

After running the script, verify the data was added:

```sql
-- Check news article
SELECT title, published_date FROM news 
WHERE title LIKE '%International Conference on Intellectual Property%';

-- Check conference entry
SELECT title, date_range, location FROM conferences 
WHERE title LIKE '%International Conference on Intellectual Property%';

-- Check event entry
SELECT title, date, location FROM events 
WHERE title LIKE '%International Conference on Intellectual Property%';
```

## Notes

- All entries are created by the admin@giip.info user
- Dates and times are properly formatted for PostgreSQL
- The conference is marked as a past event (May 2024)
- Content is in English for consistency with existing database entries
- All three tables (news, conferences, events) are populated for maximum visibility

## Next Steps

1. Run the appropriate script for your system
2. Verify the data was added correctly
3. Check the frontend to see how the conference appears in:
   - News section
   - Events listing
   - Conference archives
4. Adjust content or formatting if needed

The conference data is now ready to be displayed on your GIIP website!
