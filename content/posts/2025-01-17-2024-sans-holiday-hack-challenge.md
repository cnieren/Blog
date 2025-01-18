+++
author      = "Chad Nierenhausen"
date        = "2025-01-17"
title       = "SANS Holiday Hack Challenge"
description = "Learning to be a threat analyst"
thumbnail   = "fa-solid fa-shield-halved"

tags = ["CTF", "digital forensics", "KC7", "KQL", "cyber security" ]
+++

At the end of each year [SANS](https://www.sans.org/about/) hosts their renowned [Holiday Hack Challenge](https://www.sans.org/mlp/holiday-hack-challenge-2024/) competition which they describe as "the most festive and challenging event of the year!". I decided to participate this year and I got a nifty badge to show for it.

<!--more--> 

This year the challenges covered all of these domains:
- Ransomware Reverse Engineering
- Hardware Hacking
- Web App Hacking with MQTT and Video Feed Manipulation
- Video Game Hacking
- Threat Hunting with KQL
- SIM/SEM Analysis
- Mobile App Penetration Testing
- OSINT via Drone Path Analysis
- Web Exploration with cURL
- PowerShell for Cyber Defense

I particularly enjoyed the Hardware Hacking, Video Game Hacking, and Web Exploitation with cURL challenges, but the challenge that surprised me the most was The Great Elf Conflict, hosted by [KC7](https://kc7cyber.com/), which required participants to utilize the [Kusto Query Language](https://learn.microsoft.com/en-us/kusto/query/?view=microsoft-fabric) (KQL) to investigate a simulated phishing attack. This challenge presented a unique opportunity for me to learn some new threat hunting skills, particularly within the realm of Security Information and Event Management (SIEM) analysis.

I grappled with complex scenarios, including identifying the source of the phishing campaign, the users that were targeted, who clicked the link, what the initial infection vector was, then subsequently tracing the attacker's movements across the network, and uncovering their command and control infrastructure. Mastering advanced KQL syntax for data filtering, aggregation, and transformation proved crucial in navigating the vast dataset and extracting meaningful insights.

The most rewarding aspect of the challenge was undoubtedly the intellectual stimulation it provided. It pushed me to think critically, apply my knowledge in a dynamic environment, and develop a new skill set in cloud observability log traversal using KQL. To successfully navigate the challenge, I relied heavily on the Kusto Documentation, utilizing it to learn new commands, refine existing queries, and deepen my understanding of KQL's capabilities.

My advice to anyone considering participating in future SANS Holiday Hack Challenges is simple: Give it a try! You might be surprised by how much you can accomplish. The challenge provides a valuable learning experience, regardless of the outcome. I was shocked to learn after the event that only 4.7% of users finished this challenge and that I was one of them.

![A christmas elf with both thumbs up](/img/sans-2024/elf-challenge.png "The badge I was issued for completing the KC7 'The Great Elf Conflict' module as part of the SANS 2024 holiday hack challenge. Only 4.71% of users earned this badge as part of this years challenge.") 
{.center}