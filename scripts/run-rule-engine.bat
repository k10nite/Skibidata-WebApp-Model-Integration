@echo off
setlocal enabledelayedexpansion

REM Set variables
set ENGINE_DIR=_stashed_untracked\soil-fertility-engine
set PORT=8001
set REPO=https://github.com/k10nite/soil-fertility-classification-dataset.git

echo [run-rule-engine] Starting rule-based engine setup...

REM Create _stashed_untracked directory if it doesn't exist
if not exist "_stashed_untracked\" (
    echo [run-rule-engine] Creating _stashed_untracked directory...
    mkdir _stashed_untracked
    if !errorlevel! neq 0 (
        echo [run-rule-engine] ERROR: Failed to create _stashed_untracked directory
        exit /b 1
    )
)

REM Clone engine repo if it doesn't exist
if not exist "%ENGINE_DIR%\" (
    echo [run-rule-engine] Cloning engine repo...
    git clone %REPO% %ENGINE_DIR%
    if !errorlevel! neq 0 (
        echo [run-rule-engine] ERROR: Failed to clone repository
        exit /b 1
    )
)

REM Change to RulebasedTest directory
echo [run-rule-engine] Changing to engine directory...
cd /d %ENGINE_DIR%\RulebasedTest
if !errorlevel! neq 0 (
    echo [run-rule-engine] ERROR: Failed to navigate to RulebasedTest directory
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist ".venv\" (
    echo [run-rule-engine] Creating virtual environment...
    python -m venv .venv
    if !errorlevel! neq 0 (
        echo [run-rule-engine] ERROR: Failed to create virtual environment
        exit /b 1
    )
)

REM Activate virtual environment
echo [run-rule-engine] Activating virtual environment...
call .venv\Scripts\activate.bat
if !errorlevel! neq 0 (
    echo [run-rule-engine] ERROR: Failed to activate virtual environment
    exit /b 1
)

REM Install dependencies
echo [run-rule-engine] Installing dependencies...
pip install -q -r requirements.txt fastapi uvicorn
if !errorlevel! neq 0 (
    echo [run-rule-engine] ERROR: Failed to install dependencies
    exit /b 1
)

REM Start the API server
echo [run-rule-engine] Starting API server on port %PORT%...
cd src
uvicorn RuleBasedAPI:app --port %PORT% --reload