@echo off
title RoomFinder Demo Starter
echo =======================================================
echo           STARTING ROOMFINDER BACKEND & TUNNEL
echo =======================================================

echo.
echo [1/2] Khoi dong Backend Spring Boot trong cua so moi...
start "RoomFinder Backend" cmd /k "cd backend && .\mvnw.cmd spring-boot:run"

echo.
echo [2/2] Khoi dong Localtunnel (Static URL: https://roomfinder-tmdt.loca.lt)...
start "RoomFinder Tunnel" cmd /k "npx --yes localtunnel --port 8080 --subdomain roomfinder-tmdt"

echo.
echo =======================================================
echo Khoi dong hoan tat!
echo Public API URL cua ban la: https://roomfinder-tmdt.loca.lt/api
echo Bypass Password (neu duoc hoi): 171.251.234.148
echo.
echo Chu y: Vui long giu ca 2 cua so Command Prompt vua mo 
echo trong suot qua trinh demo.
echo =======================================================
pause
