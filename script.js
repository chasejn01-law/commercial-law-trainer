let time = 0;
let interval = null;
let timerDisplay = null;

let score = 0;
let scoreDisplay = null;
const completedInputs = new Set();

// ================= TIMER =================
function startTimer() {
  if (interval) return; // prevent multiple timers

  interval = setInterval(() => {
    time++;
    timerDisplay.textContent = time;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  stopTimer();
  time = 0;
  timerDisplay.textContent = time;
}

// ================= MAIN =================
document.addEventListener("DOMContentLoaded", () => {
  timerDisplay = document.getElementById("timer");
  scoreDisplay = document.getElementById("score");

  const answers = [
    { id: "myInput1", answer: "Our Favorite Athletes Bring Speed, Precision, Power" },
    { id: "myInput2", answer: "Elite Gymnasts Train Gracefully, Overcoming Weaknesses In Injuries Repeatedly" },
    { id: "myInput3", answer: "Skilled Batters Improve Nightly" },
    { id: "myInput4", answer: "Determined Athletes Push Forward, Practice Perfects, Dominance Follows" },
    { id: "myInput5", answer: "Winners Remain Intense, Training Never Halts In Pursuing Elite Level Honor" },
    { id: "myInput6", answer: "Pitcher Opens, Pitch Spins, Dugout Cheers Wildly" },

    { id: "myInput7", answer: "offer: every Article 2 contract starts with an offer" },
    { id: "myInput8", answer: `firm offer: an offer by a merchant that is held open for a period of time that requires no consideration. 
      If unsupported by consideration, the offer cannot remain open longer than 3 months. If supported by consideration, it endures for the stated time, 
      if no time stated, endures for a reasonable period` },
    { id: "myInput9", answer: "acceptance: an offer may be accepted by any reasonable means and manner" },
    { id: "myInput10", answer: `battle of forms: when the seller's acknowledgment form contains additional or different terms from those contained in the buyer's purchase order.
       If one of the parties is a non-merchant, variant terms are treated as a mere proposal for addition. If both parties are merchants, 
       the variant terms become a part of the contract unless they would materially alter the contract, i.e., result in surprise or hardship to the other party` },
    { id: "myInput11", answer: "statute of frauds: for contracts for goods greater than $500, there must be a writing with a quantity term signed by the party to be charged" },
    { id: "myInput12", answer: "parol evidence: extrinsic evidence can be used to supplement a partially integrated final writing" },
    { id: "myInput13", answer: "post-contract modification: need not be supported by consideration but must be in writing if within the statute of frauds" },

    { id: "myInput14", answer: "express terms: have the parties agreed on all terms?" },
    { id: "myInput15", answer: "gap in terms: if not all terms agreed upon, did the parties intend to close the deal with finality?" },
    { id: "myInput16", answer: "triplets: if the parties intended to close the deal, look to the triplets to fill gaps. Course of performance, course of dealing, and trade usage" },
    { id: "myInput17", answer: "gap-fillers: if the triplets are unavailing, turn to Article 2's gap fillers" },
    { id: "myInput18", answer: `output, requirement, exclusive dealing: quantity is determined on the basis of seller's output of production, quantity is determined on the basis 
      of buyer's needs, exclusive dealing would oblige buyer to purchase only from seller all of buyer's needs for a particular good and vice versa` },
    { id: "myInput19", answer: "warranties: warranty of title, express warranties, implied warranty of merchantability, warranties are cumulative" },
    { id: "myInput20", answer: `impracticability: when seller's performance, while not impossible, is rendered exceedingly difficult or commercially impracticable 
      because of the occurrence of some unforeseeable event` },
    { id: "myInput21", answer: `impossibility: when the goods identified to the contract suffer damage or devastation through no fault of either party and 
      before the risk of loss has passed to the buyer` },
    { id: "myInput22", answer: `risk of loss: if risk of loss has already passed from seller to buyer at the time the goods are destroyed or damaged, 
      excuse doctrine does not apply and buyer must remit payment for the goods (no matter that they compromised or no longer exist)` },

    { id: "myInput23", answer: "seller performance: seller performs by tendering the right goods, to the right place, at the right time" },
    { id: "myInput24", answer: "buyer performance: if seller tendered conforming goods on time, buyer is obligated to accept those goods and pay for them" },
    { id: "myInput25", answer: `inspection: buyer is affored an opportunity to inspect the goods. In cash on delivery situations, buyer must pay for the goods on delivery
      before inspecting, unless the defect is in plain view. Payment does not qualify as acceptance` },
    { id: "myInput26", answer: `non-conforming goods: has the buyer accepted? If not, buyer can reject for any defect. If accepted, buyer can try to revoke their acceptance.
      Buyer can reject for any slight defect, but can only revoke an acceptance for a substantial defect` },

    { id: "myInput27", answer: "definitions" },
    { id: "myInput28", answer: `attachment: the time in which the security interest becomes enforceable against the debtor. Attachment requires that value has been given, 
      debtor has rights in the collateral, and one of the following: the debtor has authenticated a security agreement that provides a description of the collateral (cannot say all assets or all property),
      or collateral in possession of the secured party` },
    { id: "myInput29", answer: "perfection: designed to provide the world with notice of the secured party’s security interest in debtor’s collateral" },
    { id: "myInput30", answer: `filing to obtain perfection: file a financing statement with the name of the debtor, name of the secured party, and a description of the collateral 
      in the secretary of state's office where the debtor is located ` },
    { id: "myInput31", answer: `post-filing events: financing statements last for 5 years. If the secured party wants to remain perfected, a continuation statement must
      be filed within 6 months before the expiration of the filing statement. If debtor changes name, secured party has 4 months to amend financing statement or becomes
      unperfected in future collateral. If debtor changes location to new state, secured party has 4 months to amend financing statement or becomes unperfected in all colalteral` },
    { id: "myInput32", answer: `priority basic rules: first to perfect or file. Priority between two perfect parties, first to file. 
      Perfected parties take priority over non-perfected parties. For unperfected parties, first to attach. Secured party v. a lien creditor, first in time
      first in right` },
    { id: "myInput33", answer: `default: completely a matter of contract. It is whatever the contract or security agreement says it is.
      Upon default, the secured party has two avenues for judicial enforcement: sue the debtor in court and get a money judgement for the amount of the debt or
      foreclose on the collateral, i.e., take possession of it and sell it ` },
    { id: "myInput34", answer: `foreclosure sale process: expenses come off the top. Next comes the foreclosing secured party's debt.
      Next comes payment of lower priority secured party claims (if notice has been sent to the foreclosing secured party). Debtor gets surplus or owes a deficiency ` },

    { id: "myInput35", answer: `what is a negotiable instrument? Generally, merges two basic concepts: a contractual obligation and monetary value.
      Negotiable instruments are cash substitutes` },
    { id: "myInput36", answer: `requirements: promise or order, signed writing, promise or order must be unconditional, fixed amount of money,
      payable to bearer or order, pay on demand or at definite time, no additional undertakings or instructions` },
    { id: "myInput37", answer: `issuance: the first delivery of an instrument by the maker or drawer, whether to a holder or nonholder, 
      for the purpose of giving rights on the instrument to any person. Requires delivery by maker/drawer and intent` },
    { id: "myInput38", answer: `transfer: delivery by a person other than the issuer for the purpose of giving to the person 
      receiving delivery the right to enforce the instrument` },
    { id: "myInput39", answer: `negotiation: transfer of possession, voluntary or involuntary, of an instrument by a person
      other than the issuer to a person who thereby becomes its holder` },
    { id: "myInput40", answer: `holder: the person in possession of an instrument that is payable to bearer or to an identified person
       that is the person in possession (right to enforce)` },
    { id: "myInput41", answer: `indorsement: a signature not by the maker, drawer, or acceptor (accept a draft for payment) for the purposes of negotiating, 
      restricting payment, or incurring liability` },
    { id: "myInput42", answer: `presentment: a demand, made by a person entitled to enforce, that the drawee pay the instrument. 
    Can be made in any commercially reasonable way unless the instrument provides otherwise, can be oral, written, or electronic communication` },
    { id: "myInput43", answer: `enforcement: Person entitled to enforce are holders, nonholders in possession with rights of holder, 
      person without possession with rights for holder, e.g., lost, stolen, or destroyed instrument` },
    { id: "myInput44", answer: `liability: the threshold requirement is a signature` },
    { id: "myInput45", answer: `holder in due course: The HDC has an immunity from many of the defenses that can be raised to escape or reduce the obligation to pay on the instrument.
      The requirements to be an HDC are, must be in possession of a negotiable instrument, must be a holder, no evidence of inauthenticity or obvious defects, and 
      the HDC must give value (consideration) for the instrument` },

    { id: "myInput46", answer: `properly payable standard: unless agreed otherwise, customer must have authorized payment and payment does not violate the customer's agreement.
      If an instrument is forged it is not properly payable` },
    { id: "myInput47", answer: "overdraft: banks may pay but do not have to" },
    { id: "myInput48", answer: "post-dated: banks may pay, unless notice received (written notice lasts 6 months, oral notice lasts 14 days)" },
    { id: "myInput49", answer: "stale checks: after 6 months, bank not required to pay" },
    { id: "myInput50", answer: `death or incompetence of customer: requires notice. For death of a customer, the bank may continue to charge
      the customer's account for up to 10 days after, even with notice` },
    { id: "myInput51", answer: "check collection process:" },
    { id: "myInput52", answer: "warranties: presentment warranties and transfer warranties" }
  ];

  // ================= ATTACH LISTENERS =================
answers.forEach(({ id, answer }) => {
  const input = document.getElementById(id);
  if (!input) return;

  const correct = normalize(answer);
  const prefixWithColon = normalize(answer.split(":")[0] + ":");

  input.addEventListener("input", () => {
    const value = normalize(input.value);
    const wasCompleted = completedInputs.has(id);

    if (!value) {
      input.style.backgroundColor = "";
    } 
    // 🟢 FULL CORRECT
    else if (value === correct) {
      input.style.backgroundColor = "lightgreen";

      if (!wasCompleted) {
        score++;
        completedInputs.add(id);
        scoreDisplay.textContent = "Score: " + score;
      }
    } 
    // 🟠 PREFIX + COLON CORRECT
    else if (value.startsWith(prefixWithColon)) {
      input.style.backgroundColor = "orange";

      if (wasCompleted) {
        score--;
        completedInputs.delete(id);
        scoreDisplay.textContent = "Score: " + score;
      }
    } 
    else {
      input.style.backgroundColor = "";

      if (wasCompleted) {
        score--;
        completedInputs.delete(id);
        scoreDisplay.textContent = "Score: " + score;
      }
    }
  });
});


// ================= HELPER =================
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s:]/g, "") // keep colon
    .replace(/\s+/g, " ")
    .trim();
}

// =============== DISPLAY HINT =============

document.querySelectorAll(".hint-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    const answerObj = answers.find(item => item.id === targetId);

    if (!answerObj) return;

    // 🔻 LOSE A POINT (can go negative now)
    score--;
    scoreDisplay.textContent = "Score: " + score;

    alert(answerObj.answer);
  });
});

});