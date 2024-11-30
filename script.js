const loanAmount = document.getElementById("loanAmount");
const loanTerm = document.getElementById("loanTerm");
const creditScore = document.getElementById("creditScore");

const loanAmountValue = document.getElementById("loanAmountValue");
const loanTermValue = document.getElementById("loanTermValue");
const creditScoreValue = document.getElementById("creditScoreValue");

const monthlyInterest = document.getElementById("monthlyInterest");
const aprDisplay = document.getElementById("aprDisplay");
const oddsBar = document.getElementById("oddsBar");
const oddsText = document.getElementById("oddsText");

function calculateApprovalOdds(amount, score, term) {
  let baseOdds = score > 720 ? 0.9 : score > 640 ? 0.7 : 0.5;
  baseOdds -= amount > 20000 ? 0.1 : 0;
  baseOdds -= term > 36 ? 0.1 : 0;

  return Math.min(Math.max(baseOdds, 0), 1); // Clamp between 0 and 1
}

function updateOddsVisual(odds) {
  const oddsPercentage = Math.round(odds * 100);
  oddsBar.style.setProperty("--width", `${oddsPercentage}%`);
  oddsBar.style.backgroundColor = odds > 0.7 ? "green" : odds > 0.4 ? "orange" : "red";
  oddsText.textContent =
    odds > 0.7
      ? "Great choice! Lenders love this combination!"
      : odds > 0.4
      ? "Not bad! Consider lowering your loan amount for better chances."
      : "This combination might be tough. Try adjusting your loan amount.";
}

function calculateAPR(score, term) {
  return score > 720 ? 10 : score > 640 ? 20 : 30; // Example APR logic
}

function updateCalculator() {
  const amount = parseInt(loanAmount.value, 10);
  const term = parseInt(loanTerm.value, 10);
  const score = parseInt(creditScore.value, 10);

  const odds = calculateApprovalOdds(amount, score, term);
  const apr = calculateAPR(score, term);

  loanAmountValue.textContent = `$${amount.toLocaleString()}`;
  loanTermValue.textContent = `${term} Months`;
  creditScoreValue.textContent = `${score}`;

  monthlyInterest.textContent = `$${((amount * apr) / 1200).toFixed(0)}`;
  aprDisplay.textContent = `${apr.toFixed(2)}% APR`;

  updateOddsVisual(odds);
}

loanAmount.addEventListener("input", updateCalculator);
loanTerm.addEventListener("input", updateCalculator);
creditScore.addEventListener("input", updateCalculator);

updateCalculator();
