# Innovation and Intellectual Property Conference 2019

## Quick Summary

Successfully created SQL scripts and helper files to add the inaugural Innovation and Intellectual Property Conference (June 28-29, 2019, Beijing, China) to your database.

## What Was Added

### 1. News Article
A comprehensive conference summary, including:
- Conference context and background (U.S.-China trade dispute era)
- Key discussion areas (Finding Facts, Understanding Complexities, Developing Toolboxes)
- Conference highlights from both days
- Keynote speakers and topics
- Co-sponsors and organizers

### 2. Conference Entry
Detailed conference record with:
- Full conference description and context
- Three key themes with detailed explanations
- Complete program for both days
- All 9 academic sessions with paper titles and authors
- Keynote speeches and panel discussions
- Co-sponsors, co-organizers information

### 3. Event Entry
Event listing with:
- Detailed two-day agenda with specific times
- Session descriptions with chairs and discussants
- Paper presentations and authors
- Practitioner sessions
- Reception and dinner information
- Venue details

## How to Add to Database

### Option 1: Windows Batch Script
```bash
add-giip1-conference.bat
```

### Option 2: Linux/Mac Shell Script
```bash
chmod +x add-giip1-conference.sh
./add-giip1-conference.sh
```

### Option 3: Direct SQL
```bash
psql -h localhost -p 5432 -U giip_user -d giip -f add-giip1-conference-2019.sql
```

### Option 4: Docker
```bash
docker exec -i giip-db psql -U giip_user -d giip < add-giip1-conference-2019.sql
```

## Conference Details

### Basic Information
- **Title**: Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World
- **Date**: June 28-29, 2019
- **Location**: Penn Wharton China Center, Beijing, China
- **Capacity**: 150 participants
- **Type**: Inaugural conference (GIIP1)

### Historical Context

This conference took place during a critical period in global innovation and IP relations, coinciding with the U.S.-China trade dispute. It addressed how states have come to the forefront of market competition and how shifts from coordination to conflict can escalate to systematic risks to the global economy.

### Conference Theme

Global competition is increasingly characterized by competition for technological leadership. The boundary between firm competitiveness and institutional infrastructure is blurring as intellectual properties, technology standards, and business platforms play increasingly prominent roles.

### Three Key Discussion Areas

#### 1. Finding Facts
- What are the realities on the ground?
- What are important trends that may shed light to the future?
- Moving beyond entrenched opinions and stereotypical views
- Identifying facts and establishing robust explanations

#### 2. Understanding Complexities
- Is strong IP protection always good?
- Is knowledge spillover always bad?
- How does our understanding of IP in domestic settings apply to global competition?
- What is the right level of indigenous R&D given global interdependence?

#### 3. Developing Toolboxes
- What policy tools beyond IP courts can motivate innovation while reducing systematic risk?
- What business tools beyond patent filing can navigate risky R&D processes?
- Will big data help firms see their competitive position more clearly?

## Detailed Agenda

### Day 1 - Friday, June 28, 2019

| Time | Activity |
|------|----------|
| 12:00-1:20pm | Lunch and Registration |
| 1:20-1:30pm | Welcome |
| 1:30-2:50pm | **Session 1: Innovation and IP with Chinese Characteristics** |
| | Chair: Minyuan Zhao (UPenn) \| Discussant: Tony Tong (U of Colorado Boulder) |
| | • The Limits of Commanding Innovation: Evidence from Chinese Patents |
| | • China's Patent Subsidy Policy and its Impacts |
| | • Antecedents of Chinese New-to-the-world Innovations |
| | • Managing "Forced" Technology Transfer in Emerging Markets |
| 2:50-3:10pm | Tea Break |
| 3:10-4:30pm | **Session 2: Creating & Appropriating Value from Innovation** |
| | Chair: Changqi Wu (Peking U) \| Discussant: Suting Hong (ShanghaiTech U) |
| | • Appropriability of Knowledge Assets in Firm Innovation |
| | • Market Orientation and Return to R&D Investment |
| | • Can Innovation Create Value without IPR? |
| | • Patent Trolls and Litigating Patent Monetization |
| 4:30-5:30pm | **Session 3: Coopetition, Frenemies, and Retaliation** |
| | Chair: Shengce Ren (Tongji U) \| Discussant: Lihong Qian (Portland State U) |
| | • Dynamics in Collaboration for Appropriating Value |
| | • Learning from Successful MNCs in China |
| | • Is Retaliation a Good Thing? |
| 6:00-8:30pm | Reception & Dinner at Madam Zhu's Kitchen |

### Day 2 - Saturday, June 29, 2019

| Time | Activity |
|------|----------|
| 8:30-9:50am | **Session 4: The Role of Firm Boundaries** |
| | • Innovation and Equity Holding Network |
| | • KFTC's Qualcomm Decisions: Competition Law Responsibilities |
| 8:30-9:50am | **Session 5: MNE Patenting in China** |
| | • How Local IPR Protection Affects Foreign Firms' Patenting |
| | • Solving Patent Premium Dilemma in Weak IPR Markets |
| 9:50-10:10am | Tea Break |
| 10:10am-12:00pm | **Session 6: IP in Practice** |
| | • IP Protection and Innovation in the Digital Age (Alibaba) |
| | • IP Impact on Agriculture Innovation (Bayer Crop Science) |
| | • Motivating R&D and IP Protection (Shanghai Academy) |
| 12:00-1:30pm | **Lunch with Keynote Speeches** |
| | • Christopher Yoo (UPenn): "Climbing up the Value Chain" |
| | • Jietang Tian (State Council): "China's Innovation Policy Trends" |
| 1:30-2:30pm | **Panel Discussion: "From Inside Out, From Outside In"** |
| | • Brad Farnsworth, Bernard Yeung, Xiucheng Han |
| 2:30-3:30pm | **Session 7: Secrecy** |
| | • Misappropriation Hazards and Firm Secrecy Defense |
| | • Protecting Trade Secret through Litigation |
| 3:30-3:50pm | Tea Break |
| 3:50-4:30pm | **Session 8: Technology and the Changing Society** |
| | • Automation and Worker Welfare |
| | • Voices from the Young Generation |
| 4:30-5:30pm | **Session 9: Knowledge Flow within and across Firms** |
| | • R&D Offshoring and Knowledge Diffusion |
| | • Cultural Intelligence Effects on Innovation |
| | • Technology Acquisitions and Spillover Effects |
| | • University Technology Licensing in China |
| 5:30-5:40pm | Closing Remarks |

## Academic Sessions Overview

### Session 1: Innovation and IP with Chinese Characteristics
Examining China's unique innovation ecosystem, patent policies, and technology transfer dynamics.

**Featured Research:**
- Yuen Yuen Ang (U of Michigan), Nan Jia (USC), Kenneth Huang (NUS)
- Jia Lin (CEIBS), Ho-Mou Wu (CEIBS, Peking U)
- Zhijing Zhu (U of Nottingham Ningbo), J. Peter Murmann (U of St.Gallen)
- Dan Prud'homme (EMLV, Duke Kunshan U), Max von Zedtwitz (Southern Denmark U)

### Session 2: Creating & Appropriating Value from Innovation
Exploring how firms create and capture value from innovation with and without formal IP protection.

**Featured Research:**
- Kunxian Zhang (Peking U), Yifei Pan (Peking U)
- Henry Chesbrough (UC Berkeley), Feng Helen Liang (Western Kentucky U)
- Wei Yang (UT Austin), Francisco Polidoro (UT Austin)
- Mingtao Xu (Purdue U)

### Session 3: Coopetition, Frenemies, and Retaliation
Analyzing competitive dynamics, collaboration strategies, and retaliation in global markets.

**Featured Research:**
- Jialei Yang (U of Oulu)
- Ka Yee Mak (U of Macau)
- Richard Chisik (Ryerson U), Chuyi Fang (Shanghai U)

### Session 4: The Role of Firm Boundaries
Investigating how firm boundaries and network structures affect innovation.

**Featured Research:**
- Jeffrey Junhui Cai (UPenn), Xian Gu (CUFE & UPenn), Linda Zhao (UPenn), Wu Zhu (UPenn)
- Sang-Seung Yi (Seoul National U)

### Session 5: MNE Patenting in China
Examining foreign firms' patenting strategies in China's evolving IP environment.

**Featured Research:**
- Meng Song (Aston U)
- Can Huang (Zhejiang U), Lanhua Li (Zhejiang U), Yadong Luo (U of Miami), Zhe Qu (Fudan U)

### Session 6: IP in Practice
Practitioner perspectives from leading companies and institutions.

**Featured Speakers:**
- Junwei Fan (Alibaba) - IP Protection and Innovation in the Digital Age
- Linda Jing (Bayer Crop Science) - IP Impact on Agriculture Innovation
- Lu Wei (Shanghai Academy) - Motivating R&D and IP Protection

### Session 7: Secrecy
Exploring trade secrets, misappropriation risks, and legal protection strategies.

**Featured Research:**
- Jiaming Zhang (U of Melbourne)
- Hao Chen (Beijing DHH Law Firm)

### Session 8: Technology and the Changing Society
Examining technology's impact on society, labor, and the next generation.

**Featured Research:**
- I.P.L. Png (National U of Singapore)
- Voices from young scholars and students

### Session 9: Knowledge Flow within and across Firms
Analyzing knowledge diffusion, R&D offshoring, and technology transfer.

**Featured Research:**
- Guangwei Li (ShanghaiTech U)
- Khalid Akhal (CGTN)
- Yoon-Suk Baik (Kaist)
- Subrina Xirong Shen (Cornell U), Ximing Yin (Tsinghua U)

## Keynote Speakers

### Christopher Yoo (University of Pennsylvania)
**Topic**: "Climbing up the Value Chain: the Experience of Asian Countries"
Examining how Asian countries have successfully moved up the value chain through innovation and IP strategies.

### Jietang Tian (Development Research Center of the State Council)
**Topic**: "Understanding 3 Perspectives of China's Innovation Policy Trends"
Providing insights into China's innovation policy from government perspective.

## Panel Discussion

**"From Inside Out, From Outside In"**

Panelists:
- **Brad Farnsworth** - Center for Internationalization and Global Engagement
- **Bernard Yeung** - National University of Singapore Business School
- **Xiucheng Han** - Intellectual Property Development & Research Center, China National Intellectual Property Administration

## Co-Sponsors

1. **China Research and Engagement Fund**, University of Pennsylvania
2. **The Wharton School**, University of Pennsylvania
3. **Guanghua School of Management**, Peking University
4. **College of Business**, Shanghai University of Finance and Economics
5. **SHU-UTS SILC Business School**, Shanghai University

## Co-Organizers

- **Prof. Changqi Wu** - Peking University
- **Prof. Minyuan Zhao** - University of Pennsylvania

## Files Created

1. **add-giip1-conference-2019.sql** - Main SQL script with all INSERT statements
2. **add-giip1-conference.bat** - Windows batch script for easy execution
3. **add-giip1-conference.sh** - Linux/Mac shell script for easy execution
4. **GIIP1_CONFERENCE_2019_SUMMARY.md** - This summary document (English)
5. **创新与知识产权会议2019-添加说明.md** - Summary document (Chinese)

## Verification

After running the script, verify the data was added:

```sql
-- Check news article
SELECT title, published_date FROM news 
WHERE title LIKE '%Innovation and Intellectual Property Conference 2019%';

-- Check conference entry
SELECT title, date_range, location FROM conferences 
WHERE title LIKE '%Innovation and Intellectual Property Conference 2019%';

-- Check event entry
SELECT title, date, location FROM events 
WHERE title LIKE '%Innovation and Intellectual Property: Firm Strategies%';
```

## Key Features

- **Historical Event**: This is a past conference (June 2019), documenting the inaugural GIIP conference
- **Timely Context**: Held during U.S.-China trade tensions, addressing critical global IP issues
- **Academic Rigor**: Featured cutting-edge research from top institutions worldwide
- **Practitioner Insights**: Included perspectives from Alibaba, Bayer, government officials, and IP lawyers
- **Cross-Disciplinary**: Bridged academic research and practical application
- **Foundation Event**: Established the GIIP conference series

## Notes

- All entries are created by the admin@giip.info user
- This is a historical event (June 2019), documenting the first GIIP conference
- Content emphasizes both academic research and practical insights
- Featured prominent scholars including Henry Chesbrough (open innovation pioneer)
- Included voices from major companies (Alibaba, Bayer) and government agencies
- Reception dinner at Madam Zhu's Kitchen provided networking opportunities

## Historical Significance

This inaugural conference established the foundation for the GIIP conference series, bringing together:
- Leading scholars from top universities worldwide
- Business executives from major corporations
- Government policymakers
- IP legal professionals

The conference successfully bridged the gap between academic research and practical application, setting the stage for future GIIP conferences in 2024 and 2025.

## Next Steps

1. Run the appropriate script for your system
2. Verify the data was added correctly
3. Check the frontend to see how the conference appears in:
   - News section (conference summary)
   - Conference archives (historical record)
   - Events listing (past events)
4. Consider creating a timeline view showing the evolution of GIIP conferences (2019, 2024, 2025)

The GIIP1 conference data is now ready to be displayed on your website as part of your conference history!
