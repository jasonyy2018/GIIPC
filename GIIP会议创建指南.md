# GIIP 会议数据创建指南

## 📋 概述

将 GIIP 会议信息创建为：
1. **News** - 会议公告
2. **Event** - 会议活动

## 🚀 方法 1：使用管理后台（推荐）

### 步骤 1：登录管理后台

```
URL: http://localhost/admin.html
邮箱: admin@giip.info
密码: admin123
```

---

### 步骤 2：创建 News

1. 点击 **"News Management"** 标签
2. 点击 **"Add News"** 按钮
3. 填写表单：

**Title:**
```
The 3rd Conference on Global Innovation and Intellectual Property Announced
```

**Content:**
```
School of Management, Fudan University is pleased to announce the 3rd Conference on Global Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World, to be held on May 17-18, 2025 in Shanghai, China.

Global competition is increasingly characterized by competition for technological leadership. Meanwhile, given the increasingly prominent roles of intellectual properties (IPs), technology standards, and business platforms, the boundary between firm competitiveness and institutional infrastructure is blurring. As manifested in the recent developments around healthcare, AI, and electric vehicles, states have come to the forefront of market competition in a wide range of industries. Thus, the coordination and competition among public and private entities across nations will shape the future trajectories of the global markets.

The conference is hosted by School of Management, Fudan University, and co-sponsored by the McDonnell International Scholars Academy, Washington University in St. Louis, and Guanghua School of Management, Peking University.

Key Discussion Topics:

• Finding facts: What are the realities on the ground and what are the important trends that may shed light to the future? Many public discussions so far are based on entrenched opinions and stereotypical views.

• Understanding complexities: Is strong IP protection always good? Is knowledge outflow always bad? To what extent do our understanding about IP, derived mostly from domestic settings, still hold in the context of global competition?

• Developing toolboxes: Besides filing for patents, what are the tools businesses can use to navigate the risky R&D processes, both within and across countries? Besides strengthening the IP courts, what are the tools that policy makers can use to motivate innovation while reducing systematic risk?

The conference will feature multiple sessions covering topics including Innovation and IP Strategies under De-Coupling, Secret Patenting, AI's effect on Labor and Competition, Innovation Governance, and voices from policymakers, business leaders, and legal professionals.

For more information and registration, please contact: GIIP2025@fdsm.fudan.edu.cn
```

**Image URL:**
```
https://www.fdsm.fudan.edu.cn/En/images/news_banner.jpg
```

**Published Date:**
```
2024-11-01
```

4. 点击 **"Create"** 按钮

---

### 步骤 3：创建 Event

1. 点击 **"Events Management"** 标签
2. 点击 **"Add Event"** 按钮
3. 填写表单：

#### 基本信息

**Event Title:**
```
The 3rd Conference on Global Innovation and Intellectual Property
```

**Description:**
```
Firm Strategies and Policy Challenges in a Rapidly Changing World. This conference brings together scholars, policymakers, business leaders, and legal professionals to discuss the future of innovation and intellectual property in the context of global competition and technological leadership.
```

**Event Type:**
```
Conference
```

**Capacity:**
```
200
```

#### 日期和时间

**Start Date:**
```
2025-05-17
```

**End Date:**
```
2025-05-18
```

**Start Time:**
```
08:00
```

**End Time:**
```
18:00
```

#### 地点信息

**Venue:**
```
School of Management, Fudan University
```

**Address:**
```
Shanghai, China
```

**Room/Building:**
```
To be announced
```

#### 组织者信息

**Organizer:**
```
School of Management, Fudan University
```

**Contact Email:**
```
GIIP2025@fdsm.fudan.edu.cn
```

#### 链接和资源

**Registration URL:**
```
https://www.fdsm.fudan.edu.cn/En/news44260.html
```

**Event Website:**
```
https://www.fdsm.fudan.edu.cn/En/news44260.html
```

#### 详细议程

**Agenda Content:**
```
Saturday, May 17, 2025

8:00-8:30am: Registration
8:30-8:50am: Opening Remarks
8:50-10:00am: Session 1 - Innovation and IP Strategies under De-Coupling
10:00-10:20am: Tea Break
10:20-11:10am: Session 2 - Secret Patenting and Patenting with Trade Secret
11:10am-12:00pm: Session 3 - Innovation in the Rapidly Changing World: The Role of Academics
12:00-1:30pm: Lunch
1:30-2:40pm: Session 4 - Competitive Advantages in a Connected World
2:40-3:30pm: Session 5 - The Effect of AI on Labor, Competition and Intellectual Property Rights
3:30-3:50pm: Tea Break
3:50-5:00pm: Session 6 - Innovation and Governance with Informal Institutions
5:00-6:15pm: Drink and Poster Session
  • Group 1: Patents as probable rights
  • Group 2: IP strategy and firm incentives
  • Group 3: The impact of trade friction on innovation strategies
  • Group 4: New tools in IP research
6:00pm: Dinner for all registered participants

Sunday, May 18, 2025

8:30-9:20am: Session 7 - Institutions for Innovation: IP and Industrial Policies
9:20-9:40am: Session 8 - Voices from Policymakers
9:40-10:00am: Tea Break
10:00-11:30am: Session 9 - Voices from Business Leaders
11:30am-12:40pm: Session 10 - Voices from Legal Professionals
12:40-12:45pm: Closing Remarks
12:45pm: Lunch, Social, and Farewell
```

#### 演讲者信息

**Speaker List:**
```
Co-organizers:
• Changqi Wu, Peking University
• Minyuan Zhao, Washington University in St. Louis

Organization Committee:
• Xuhong Li, Fudan University
• Tian Wei, Fudan University

Sessions will feature scholars, policymakers, business leaders, and legal professionals from leading institutions worldwide.
```

#### 附加信息

**Tags:**
```
innovation, intellectual property, IP, conference, global competition, technology, patents, AI, policy
```

**Status:**
```
Published
```

**Featured Event:**
```
☑ Yes (勾选)
```

4. 点击 **"Create Event"** 按钮

---

## 🔧 方法 2：使用 API（高级）

### 前提条件
```bash
# 确保 Docker 容器正在运行
docker ps
```

### 执行脚本

**Linux/Mac:**
```bash
bash 创建GIIP会议数据.sh
```

**Windows:**
```bash
# 使用 Git Bash 或 WSL
bash 创建GIIP会议数据.sh
```

---

## ✅ 验证结果

### 查看 News
1. 访问：http://localhost/index.html#news
2. 应该看到新创建的会议公告

### 查看 Event
1. 访问：http://localhost/index.html#events
2. 应该看到新创建的会议活动

### 在管理后台查看
1. 访问：http://localhost/admin.html
2. 在 News Management 和 Events Management 中查看

---

## 📊 数据摘要

### News 数据
- **标题**: The 3rd Conference on Global Innovation and Intellectual Property Announced
- **日期**: 2024-11-01
- **类型**: 会议公告

### Event 数据
- **标题**: The 3rd Conference on Global Innovation and Intellectual Property
- **日期**: 2025-05-17 至 2025-05-18
- **地点**: School of Management, Fudan University, Shanghai
- **类型**: Conference
- **容量**: 200 人
- **状态**: Published
- **特色**: Yes

---

## 🎯 关键信息

### 会议主题
- Innovation and IP Strategies under De-Coupling
- Secret Patenting and Patenting with Trade Secret
- AI's effect on Labor, Competition and IP Rights
- Innovation Governance with Informal Institutions
- Voices from Policymakers, Business Leaders, and Legal Professionals

### 主办方
- School of Management, Fudan University
- McDonnell International Scholars Academy, WashU
- Guanghua School of Management, Peking University

### 联系方式
- Email: GIIP2025@fdsm.fudan.edu.cn
- Website: https://www.fdsm.fudan.edu.cn/En/news44260.html

---

## 📝 注意事项

1. **图片链接**: 如果原网站的图片链接无效，可以：
   - 留空
   - 使用占位图片
   - 上传自己的图片

2. **日期格式**: 确保使用 YYYY-MM-DD 格式

3. **内容格式**: 
   - 保持段落分隔
   - 使用项目符号（•）
   - 保持议程的清晰结构

4. **特色活动**: 勾选 "Featured Event" 会让活动在首页显著显示

---

## 🎉 完成！

创建完成后，GIIP 会议信息将：
- ✅ 在首页的 News 部分显示
- ✅ 在首页的 Events 部分显示
- ✅ 可以在管理后台编辑和管理
- ✅ 如果标记为 Featured，会在首页突出显示

---

**创建日期**: 2025-10-20  
**数据来源**: https://www.fdsm.fudan.edu.cn/En/news44260.html  
**状态**: ✅ 准备就绪
