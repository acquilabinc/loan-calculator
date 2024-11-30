function interpolateAPR(creditScore, loanTerm) {
  const aprMapping = {
    500: 36.0,
    600: 22.0,
    700: 12.0,
    850: 8.0,
  };

  const creditScores = Object.keys(aprMapping).map(Number).sort((a, b) => a - b);
  let lowerScore = creditScores[0];
  let upperScore = creditScores[creditScores.length - 1];

  // Find closest range for interpolation
  for (let i = 0; i < creditScores.length - 1; i++) {
    if (creditScore >= creditScores[i] && creditScore <= creditScores[i + 1]) {
      lowerScore = creditScores[i];
      upperScore = creditScores[i + 1];
      break;
    }
  }

  // Base APR calculation
  const baseAPR =
    aprMapping[lowerScore] +
    ((creditScore - lowerScore) / (upperScore - lowerScore)) *
      (aprMapping[upperScore] - aprMapping[lowerScore]);

  // Adjust APR based on loan term
  const termFactor = ((loanTerm - 1) / (84 - 1)) * 5; // Adjust factor for term
  const adjustedAPR = baseAPR + termFactor;

  // Clamp APR between 8% and 36%
  return Math.min(36, Math.max(8, adjustedAPR));
}

function calculateMonthlyInterest(loanAmount, apr) {
  const monthlyRate = apr / 12 / 100; // Convert APR to monthly interest rate
  return loanAmount * monthlyRate;
}

function calculateApprovalOdds(loanAmount, creditScore, loanTerm) {
  const baseOdds = creditScore >= 720 ? 0.85 : creditScore >= 620 ? 0.65 : 0.4;
  const loanFactor = loanAmount <= 20000 ? 0.2 : loanAmount <= 30000 ? 0.1 : -0.15;
  const termFactor = loanTerm <= 24 ? 0.1 : loanTerm <= 60 ? -0.05 : -0.15;

  // Combine all factors to calculate odds
  let odds = baseOdds + loanFactor + termFactor;
  return Math.max(0, Math.min(1, odds)); // Clamp between 0 and 1
}

function updateCalculator() {
  const loanAmount = parseInt(document.getElementById("loanAmount").value, 10);
  const loanTerm = parseInt(document.getElementById("loanTerm").value, 10);
  const creditScore = parseInt(document.getElementById("creditScore").value, 10);

  const apr = interpolateAPR(creditScore, loanTerm);
  const monthlyInterest = calculateMonthlyInterest(loanAmount, apr);

  // Update UI with calculated values
  document.getElementById("loanAmountValue").textContent = `$${loanAmount.toLocaleString()}`;
  document.getElementById("loanTermValue").textContent = `${loanTerm} Months`;
  document.getElementById("creditScoreValue").textContent = `${creditScore}`;
  document.getElementById("apr").textContent = `${apr.toFixed(2)}%`;
  document.getElementById("monthlyInterest").textContent = `$${Math.round(monthlyInterest).toLocaleString()}`;

  // Calculate approval odds
  const approvalOdds = calculateApprovalOdds(loanAmount, creditScore, loanTerm);
  const button = document.querySelector(".cta-button");
  const oddsBar = document.querySelector(".approval-bar");
  const oddsText = document.querySelector(".approval-text");

  // Update approval odds bar and button
  oddsBar.style.width = `${approvalOdds * 100}%`;

  if (approvalOdds > 0.7) {
    oddsBar.style.backgroundColor = "#4caf50"; // Green
    oddsText.textContent = "Great choice! Lenders love this combination!";
    button.className = "cta-button green";
    button.textContent = "Great Choice! Check Your Rate";
  } else if (approvalOdds > 0.3) {
    oddsBar.style.backgroundColor = "#ffeb3b"; // Yellow
    oddsText.textContent = "Not bad! Consider lowering your loan amount or term.";
    button.className = "cta-button yellow";
    button.textContent = "Not Bad! Check Your Rate";
  } else {
    oddsBar.style.backgroundColor = "#f44336"; // Red
    oddsText.textContent = "This combo may be tough. Try adjusting your loan.";
    button.className = "cta-button red";
    button.textContent = "Consider Tweaking! Check Your Rate";
  }

  // Disable button if no odds or invalid inputs
  if (approvalOdds === 0 || monthlyInterest === 0) {
    button.className = "cta-button disabled";
    button.textContent = "Unavailable";
  }
}

// Event listeners for real-time updates
document.getElementById("loanAmount").addEventListener("input", updateCalculator);
document.getElementById("loanTerm").addEventListener("input", updateCalculator);
document.getElementById("creditScore").addEventListener("input", updateCalculator);

// Initialize calculator
updateCalculator();
