@echo off
title RoomFinder Demo Starter
echo =======================================================
echo           STARTING ROOMFINDER BACKEND & TUNNEL
echo =======================================================

echo.
echo [1/2] Khoi dong Backend Spring Boot trong cua so moi...
start "RoomFinder Backend" cmd /k "cd backend && set APP_BASE_URL=https://roomfinder-tmdt.loca.lt/api/uploads && .\mvnw.cmd spring-boot:run"

echo.
echo [2/2] Khoi dong Localtunnel (Static URL: https://roomfinder-tmdt.loca.lt)...
start "RoomFinder Tunnel" cmd /k "npx --yes localtunnel --port 8080 --subdomain roomfinder-tmdt"

echo.
echo Dang lay dia chi IP cong cong...
for /f "delims=" %%i in ('powershell -command "(Invoke-RestMethod -Uri 'https://api.ipify.org')"') do set PUBLIC_IP=%%i

echo.
echo =======================================================
echo Khoi dong hoan tat!
echo Public API URL cua ban la: https://roomfinder-tmdt.loca.lt/api
echo Bypass Password (neu duoc hoi): %PUBLIC_IP%
echo.
echo Huong dan:
echo Vui long mo trinh duyet va truy cap: https://roomfinder-tmdt.loca.lt/
echo Nhap mat khau bypass la IP o tren de kich hoat tunnel cho trinh duyet.
echo Sau do, tai lai trang web Vercel cua ban de anh va video hien thi!
echo.
echo Chu y: Vui long giu ca 2 cua so Command Prompt vua mo 
echo trong suot qua trinh demo.
echo =======================================================
pause
