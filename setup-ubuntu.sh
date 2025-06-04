#!/bin/bash

echo "🐧 Ubuntu/WSL Portfolio Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Update package lists
echo -e "${YELLOW}📦 Updating package lists...${NC}"
sudo apt update

# Install curl if not present
if ! command -v curl &> /dev/null; then
    echo -e "${YELLOW}📦 Installing curl...${NC}"
    sudo apt install -y curl
fi

# Install Node.js using NodeSource repository (recommended method)
echo -e "${YELLOW}📦 Installing Node.js 20 LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
NODE_VERSION=$(node --version 2>/dev/null)
NPM_VERSION=$(npm --version 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
    echo -e "${GREEN}✅ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js installation failed${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed!${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd ../frontend
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed!${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${CYAN}To start your portfolio:${NC}"
echo -e "${CYAN}  ./start-ubuntu.sh${NC}"
echo ""
echo -e "${CYAN}Your URLs will be:${NC}"
echo -e "${CYAN}  Backend:  http://localhost:5000${NC}"
echo -e "${CYAN}  Frontend: https://errasti13.github.io/portfolio-tester${NC}"
echo "" 