// Scientific Calculator JavaScript Code
// This file contains all the calculator logic

// Variables to store calculator state
let currentExpression = '';  // What the user is typing
let displayValue = '0';      // What shows on screen
let lastResult = null;       // Last calculation result
let isError = false;         // If there's an error

// Get the display element from HTML
const display = document.getElementById('display');

// Function to update what shows on the display screen
function updateDisplay() {
  display.textContent = displayValue;
  
  // Remove error styling if no error
  if (!isError) {
    display.classList.remove('error');
  }
  
  // Remove success animation
  display.classList.remove('result');
}

// Function to add numbers and operators to the expression
function addNumber(value) {
  // If there was an error, clear everything first
  if (isError) {
    clearAll();
  }

  // If we just got a result and user types a number, start fresh
  if (lastResult !== null && /\d/.test(value)) {
    currentExpression = '';
    lastResult = null;
  }

  // Add the new value to our expression
  currentExpression += value;
  displayValue = currentExpression || '0';
  updateDisplay();
}

// Function to add square root to the expression
function addSquareRoot() {
  if (isError) {
    clearAll();
  }

  if (lastResult !== null) {
    currentExpression = '';
    lastResult = null;
  }

  currentExpression += 'Math.sqrt(';
  displayValue = currentExpression;
  updateDisplay();
}

// Function to add power (x^y) to the expression
function addPower() {
  if (isError) {
    clearAll();
  }

  if (lastResult !== null) {
    currentExpression = '';
    lastResult = null;
  }

  currentExpression += '**';
  displayValue = currentExpression;
  updateDisplay();
}

// Function to delete the last character
function deleteOne() {
  if (isError) {
    clearAll();
    return;
  }

  if (currentExpression.length > 0) {
    currentExpression = currentExpression.slice(0, -1);
    displayValue = currentExpression || '0';
    updateDisplay();
  }
}

// Function to clear everything
function clearAll() {
  currentExpression = '';
  displayValue = '0';
  lastResult = null;
  isError = false;
  updateDisplay();
}

// Function to clean up the expression before calculating
function cleanExpression(expression) {
  // Replace × with * and ÷ with /
  let cleaned = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/');

  // Remove any dangerous characters, keep only safe ones
  cleaned = cleaned.replace(/[^0-9+\-*/().\sMath.sqrt^]/g, '');
  
  return cleaned;
}

// Function to check if parentheses are balanced
function checkParentheses(expression) {
  let count = 0;
  for (let char of expression) {
    if (char === '(') count++;
    if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

// Main calculation function
function calculate() {
  // Don't calculate if there's nothing to calculate
  if (!currentExpression || isError) {
    return;
  }

  try {
    // Clean the expression first
    let expression = cleanExpression(currentExpression);
    
    // Check if parentheses match
    if (!checkParentheses(expression)) {
      throw new Error('Parentheses do not match');
    }

    // Calculate the result using eval (safe for this beginner project)
    const result = eval(expression);

    // Check if result is a valid number
    if (!isFinite(result)) {
      throw new Error('Invalid calculation');
    }

    // Store and display the result
    lastResult = result;
    displayValue = formatResult(result);
    currentExpression = '';
    isError = false;

    // Show success animation
    display.classList.add('result');

  } catch (error) {
    // Show error message
    displayValue = 'Error';
    isError = true;
    display.classList.add('error');
  }

  updateDisplay();
}

// Function to format the result nicely
function formatResult(result) {
  // Handle very big or very small numbers
  if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
    return result.toExponential(6);
  }

  // Round to avoid decimal precision problems
  const rounded = Math.round(result * 1e10) / 1e10;
  
  // Convert to string
  return rounded.toString();
}

// Function to handle keyboard input
function handleKeyboard(event) {
  const key = event.key;

  // Prevent default browser behavior for our keys
  if ('0123456789+-*/().='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
    event.preventDefault();
  }

  // Handle different key types
  if (/\d/.test(key)) {
    // Number keys (0-9)
    addNumber(key);
  }
  else if (['+', '-', '*', '/'].includes(key)) {
    // Operator keys
    addNumber(key);
  }
  else if (key === '(' || key === ')') {
    // Parentheses
    addNumber(key);
  }
  else if (key === '.') {
    // Decimal point
    addNumber('.');
  }
  else if (key === 'Enter' || key === '=') {
    // Calculate result
    calculate();
  }
  else if (key === 'Escape') {
    // Clear everything
    clearAll();
  }
  else if (key === 'Backspace') {
    // Delete last character
    deleteOne();
  }
}

// Set up keyboard listening when page loads
document.addEventListener('keydown', handleKeyboard);

// Start the calculator with display showing 0
updateDisplay();
