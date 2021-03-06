#!/usr/bin/env node
const program = require('commander');

const halving_factor = 2;
const initial_reward = 50;
const block_halving = 210000; // Number of blocks before reward halving

var block_height = 558216; // Current height; TODO add a way to get the current height automatically

program
  .version('0.1.0')
  .option('-h, --height [value]', 'Block height to calculate from')
  .option('-a, --asc', 'Orders the round in ascending order')
  .parse(process.argv)

/**
 * Process options
 */
if(program.height) {
  let nInput = program.height;
  program.height = Number(program.height);
  if (isNaN(program.height)) {
    console.log(`${nInput} is invalid. Please enter a number as [block_height].`);
    process.exit();
  } else {
    block_height = program.height;
  }
} else {
  console.log(`

  Using default height: ${block_height}
  (To enter a custom height use the flag -h followed by the block height)

  `)
}

let blocks_to_next_halving = block_height % block_halving; // This could be equals to block_height if block_height <= block_halving
let halving_times = Math.floor(block_height / block_halving);
let current_reward = initial_reward / Math.pow(halving_factor, halving_times);
let current_period = halving_times + 1;

let current_supply, total_supply;
total_supply = current_supply = current_reward * blocks_to_next_halving;

let periodStats = [{
  period: current_period,
  period_reward: current_reward,
  period_supply: current_supply,
  halving_times: halving_times
}]; // Populate with the current period
console.log({ ...periodStats[0] });

// Add rewards from previous periods if this is not the first period
for (let period = current_period; period > 1;) {
  --period; // Did the reduction here so that it will reflect on the calculation
  let halving_times = period - 1; // This will have different scope from the halving_times above
  let period_reward = initial_reward / Math.pow(halving_factor, halving_times);
  let period_supply = period_reward * block_halving; // Using block halving because it is expected that all the blocks for this period is already mined

  // Decide what order the periods should be added
  if (!program.asc) {
    periodStats.push({
      period: period,
      period_reward: period_reward,
      period_supply: period_supply,
      halving_times: halving_times
    });
  } else {
    periodStats.unshift({
      period: period,
      period_reward: period_reward,
      period_supply: period_supply,
      halving_times: halving_times
    });
  }

  total_supply += period_supply;
}

console.log({ total_supply });
console.log('\nOther stats:\n', periodStats);
