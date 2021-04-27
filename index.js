#!/usr/bin/env node

// @ts-check

const { yellow, green, cyan, blue, red } = require('kolorist');

async function init() {
  console.log('test workflow');
  console.log(yellow, green, cyan, blue, red);
}

init().catch((e) => {
  console.error(e);
});
