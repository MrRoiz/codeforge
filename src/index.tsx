#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from '@app/App';
import { enterFullScreen, exitFullScreen } from '@utils/screen';

if (!process.stdin.isTTY) {
  console.error('codeforge is an interactive TUI — run it directly in a terminal.');
  process.exit(1);
}

enterFullScreen();

const app = render(React.createElement(App));

const restore = () => exitFullScreen();
process.on('exit', restore);
process.on('SIGINT', () => {
  restore();
  process.exit(0);
});
process.on('SIGTERM', () => {
  restore();
  process.exit(0);
});

app.waitUntilExit().then(restore);
