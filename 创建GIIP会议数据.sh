#!/bin/bash

# GIIP 会议数据创建脚本
# 使用方法: bash 创建GIIP会议数据.sh

echo "=========================================="
echo "创建 GIIP 会议 News 和 Event"
echo "=========================================="
echo ""

# 1. 登录获取 Token
echo "[1/3] 登录获取 Token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@giip.info",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ 登录失败！"
    echo "响应: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ 登录成功！"
echo ""

# 2. 创建 News
echo "[2/3] 创建 News..."
NEWS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "The 3rd Conference on Global Innovation and Intellectual Property Announced",
    "content": "School of Management, Fudan University is pleased to announce the 3rd Conference on Global Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World, to be held on May 17-18, 2025 in Shanghai, China.\n\nGlobal competition is increasingly characterized by competition for technological leadership. Meanwhile, given the increasingly prominent roles of intellectual properties (IPs), technology standards, and business platforms, the boundary between firm competitiveness and institutional infrastructure is blurring. As manifested in the recent developments around healthcare, AI, and electric vehicles, states have come to the forefront of market competition in a wide range of industries. Thus, the coordination and competition among public and private entities across nations will shape the future trajectories of the global markets.\n\nThe conference is hosted by School of Management, Fudan University, and co-sponsored by the McDonnell International Scholars Academy, Washington University in St. Louis, and Guanghua School of Management, Peking University.\n\nKey Discussion Topics:\n\n• Finding facts: What are the realities on the ground and what are the important trends that may shed light to the future? Many public discussions so far are based on entrenched opinions and stereotypical views.\n\n• Understanding complexities: Is strong IP protection always good? Is knowledge outflow always bad? To what extent do our understanding about IP, derived mostly from domestic settings, still hold in the context of global competition?\n\n• Developing toolboxes: Besides filing for patents, what are the tools businesses can use to navigate the risky R&D processes, both within and across countries? Besides strengthening the IP courts, what are the tools that policy makers can use to motivate innovation while reducing systematic risk?\n\nThe conference will feature multiple sessions covering topics including Innovation and IP Strategies under De-Coupling, Secret Patenting, AI'\''s effect on Labor and Competition, Innovation Governance, and voices from policymakers, business leaders, and legal professionals.\n\nFor more information and registration, please contact: GIIP2025@fdsm.fudan.edu.cn",
    "published_date": "2024-11-01",
    "image_url": "https://www.fdsm.fudan.edu.cn/En/images/news_banner.jpg"
  }')

if echo "$NEWS_RESPONSE" | grep -q '"success":true'; then
    echo "✅ News 创建成功！"
    NEWS_ID=$(echo $NEWS_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo "   News ID: $NEWS_ID"
else
    echo "❌ News 创建失败！"
    echo "响应: $NEWS_RESPONSE"
fi
echo ""

# 3. 创建 Event
echo "[3/3] 创建 Event..."
EVENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "The 3rd Conference on Global Innovation and Intellectual Property",
    "description": "Firm Strategies and Policy Challenges in a Rapidly Changing World. This conference brings together scholars, policymakers, business leaders, and legal professionals to discuss the future of innovation and intellectual property in the context of global competition and technological leadership.\n\n<!-- Extended Info: {\"event_type\":\"conference\",\"end_date\":\"2025-05-18\",\"start_time\":\"08:00\",\"end_time\":\"18:00\",\"address\":\"Shanghai, China\",\"room\":\"To be announced\",\"organizer\":\"School of Management, Fudan University\",\"contact_email\":\"GIIP2025@fdsm.fudan.edu.cn\",\"contact_phone\":\"\",\"registration_url\":\"https://www.fdsm.fudan.edu.cn/En/news44260.html\",\"agenda_url\":\"\",\"website\":\"https://www.fdsm.fudan.edu.cn/En/news44260.html\",\"detailed_agenda\":\"Saturday, May 17, 2025\\n\\n8:00-8:30am: Registration\\n8:30-8:50am: Opening Remarks\\n8:50-10:00am: Session 1 - Innovation and IP Strategies under De-Coupling\\n10:00-10:20am: Tea Break\\n10:20-11:10am: Session 2 - Secret Patenting and Patenting with Trade Secret\\n11:10am-12:00pm: Session 3 - Innovation in the Rapidly Changing World: The Role of Academics\\n12:00-1:30pm: Lunch\\n1:30-2:40pm: Session 4 - Competitive Advantages in a Connected World\\n2:40-3:30pm: Session 5 - The Effect of AI on Labor, Competition and Intellectual Property Rights\\n3:30-3:50pm: Tea Break\\n3:50-5:00pm: Session 6 - Innovation and Governance with Informal Institutions\\n5:00-6:15pm: Drink and Poster Session\\n  • Group 1: Patents as probable rights\\n  • Group 2: IP strategy and firm incentives\\n  • Group 3: The impact of trade friction on innovation strategies\\n  • Group 4: New tools in IP research\\n6:00pm: Dinner for all registered participants\\n\\nSunday, May 18, 2025\\n\\n8:30-9:20am: Session 7 - Institutions for Innovation: IP and Industrial Policies\\n9:20-9:40am: Session 8 - Voices from Policymakers\\n9:40-10:00am: Tea Break\\n10:00-11:30am: Session 9 - Voices from Business Leaders\\n11:30am-12:40pm: Session 10 - Voices from Legal Professionals\\n12:40-12:45pm: Closing Remarks\\n12:45pm: Lunch, Social, and Farewell\",\"speakers\":\"Co-organizers:\\n• Changqi Wu, Peking University\\n• Minyuan Zhao, Washington University in St. Louis\\n\\nOrganization Committee:\\n• Xuhong Li, Fudan University\\n• Tian Wei, Fudan University\\n\\nSessions will feature scholars, policymakers, business leaders, and legal professionals from leading institutions worldwide.\",\"tags\":\"innovation, intellectual property, IP, conference, global competition, technology, patents, AI, policy\",\"status\":\"published\",\"featured\":true} -->",
    "date": "2025-05-17",
    "location": "School of Management, Fudan University",
    "capacity": 200
  }')

if echo "$EVENT_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Event 创建成功！"
    EVENT_ID=$(echo $EVENT_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo "   Event ID: $EVENT_ID"
else
    echo "❌ Event 创建失败！"
    echo "响应: $EVENT_RESPONSE"
fi
echo ""

echo "=========================================="
echo "✅ 完成！"
echo "=========================================="
echo ""
echo "查看结果："
echo "• News: http://localhost/index.html#news"
echo "• Event: http://localhost/index.html#events"
echo "• 管理后台: http://localhost/admin.html"
echo ""
