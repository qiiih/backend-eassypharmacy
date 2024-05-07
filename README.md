﻿# How to run backend-eassypharmacy
## Install Dependency
Run this command in the root folder
```bash
npm install
```
## Database Migration & Seeder
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
## Start the App
```bash
npm start
```
