@echo off

echo ========================================
echo Playwright Project Setup
echo ========================================

echo.
echo Installing dotenv...
call npm install dotenv

echo.
echo Installing Faker...
call npm install @faker-js/faker

echo.
echo Installing Luxon...
call npm install luxon

echo.
echo Installing AJV, CSV Parse and XLSX...
call npm install ajv csv-parse xlsx

echo.
echo Installing Axe Playwright...
call npm install @axe-core/playwright

echo.
echo Installing Allure Playwright...
call npm install allure-playwright

echo.
echo Installing Node.js TypeScript definitions...
call npm install -D @types/node

echo.
echo Installing Playwright browsers...
call npx playwright install

echo.
echo Installing MySQL2...
call npm install mysql2

echo.
echo ========================================
echo Installation completed!
echo ========================================

pause