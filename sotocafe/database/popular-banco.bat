@echo off
echo ========================================
echo Popular Banco de Dados - Soto Cafe
echo ========================================
echo.

REM Tente encontrar o psql no caminho comum do PostgreSQL
set PSQL_PATH=
if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\16\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\15\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\14\bin\psql.exe
if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" set PSQL_PATH=C:\Program Files\PostgreSQL\13\bin\psql.exe

if "%PSQL_PATH%"=="" (
    echo ERRO: psql nao encontrado!
    echo.
    echo Por favor, execute manualmente:
    echo   psql -U postgres -d soto_cafe -f seed.sql
    echo.
    echo Ou encontre o caminho do psql e execute:
    echo   "C:\Program Files\PostgreSQL\XX\bin\psql.exe" -U postgres -d soto_cafe -f seed.sql
    pause
    exit /b 1
)

echo Usando: %PSQL_PATH%
echo.
echo Executando script seed.sql...
echo.

set PGPASSWORD=postgres
"%PSQL_PATH%" -U postgres -d soto_cafe -f "%~dp0seed.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Banco populado com sucesso!
    echo ========================================
    echo.
    echo Credenciais de login:
    echo   Email: joao@email.com
    echo   Senha: 123456
    echo.
) else (
    echo.
    echo ERRO ao popular banco!
    echo Verifique se:
    echo   1. PostgreSQL esta rodando
    echo   2. Banco soto_cafe existe
    echo   3. Usuario postgres tem acesso
    echo.
)

pause

