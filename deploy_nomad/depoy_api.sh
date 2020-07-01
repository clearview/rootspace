#!/bin/bash
yarn install
time npx shipit staging_api deploy
