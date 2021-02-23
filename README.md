# canvasBot
when a teacher post some announcements to his course in canvas.instructure.com, this bot will find then post it to its corresponding channel in discord

any announcement has a type (now supports only Zoom links)

## Zoom links
each time the course teacher shares Zoom link as an announcement, it will get posted and pinned automatically in the predefined channel in the discord
and if there are any previous zoom messages pinned it gets erased and replaced by the new one
> **Note** each **pinned post** will be **removed** after **two day**

## Requirements
* student account that has been enrolled in the wanted course
* firebase account (as the main strategy for saving old announcements)
* discord bot
