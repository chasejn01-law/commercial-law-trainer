let gameOver = false;

let time = 30 * 60;
let interval = null;
let timerDisplay = null;
let progressDisplay = null;

let totalInputs = 0;
const autoFilledInputs = new Set();

let articleSections = [];

const completedBonusInputs = new Set();

let sectionsCompletedCount = 0;
let bonusAwardedFor = 0; // tracks how many times we've given the bonus

// ✅ MUST be here (global scope)
function formatTime(secondsTotal) {
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal % 60;

  return String(minutes).padStart(2, "0") + ":" +
         String(seconds).padStart(2, "0");
}

let points = 0;
let pointsDisplay = null;
const completedInputs = new Set();
const partialInputs = new Set(); // track orange states

// ================= TIMER =================
function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (time > 0) {
      time--;
      timerDisplay.textContent = formatTime(time);
    } else {
      timerDisplay.textContent = "00:00";
      endGame();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  stopTimer();
  time = 30 * 60;
  timerDisplay.textContent = formatTime(time);
}

// ================= HELPER: SIMILARITY =================
function similarity(a, b) {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;

  if (longer.length === 0) return 1;

  const distance = levenshtein(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ================= MAIN =================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sections-container");
  const sections = Array.from(container.children);
  progressDisplay = document.getElementById("progress");

  // Shuffle (Fisher-Yates)
  for (let i = sections.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sections[i], sections[j]] = [sections[j], sections[i]];
  }

  // Re-append in new order
  sections.forEach(section => container.appendChild(section));

// ============== SEQUENTIAL SECTION LOCKING ============

articleSections = Array.from(
  document.querySelectorAll("#sections-container > section")
);

let goblins = [
  "red-goblin.png",
  "purple-goblin.png",
  "ucc-goblin.png"
];

const kingGoblin = "king-goblin.png";

// Shuffle goblins so the first three enemies are random
for (let i = goblins.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [goblins[i], goblins[j]] = [goblins[j], goblins[i]];
}

function updateCurrentGoblin() {
  const enemyImg = document.getElementById("enemy");

  for (let i = 0; i < articleSections.length; i++) {
    const section = articleSections[i];
    const fields = section.querySelectorAll("input, textarea");

    const isComplete = Array.from(fields).every(field =>
      completedInputs.has(field.id)
    );

    // First incomplete section = current "enemy"
    if (!isComplete) {
      if (i === articleSections.length - 1) {
        enemyImg.src = kingGoblin;
        enemyImg.style.width = "140px";
      } else {
        enemyImg.src = goblins[i % goblins.length];
        enemyImg.style.width = "120px";
      }
      return;
    }
  }

  // If everything complete → show king as final state
  enemyImg.src = kingGoblin;
}

function setSectionDisabled(section, disabled) {
  section.querySelectorAll("input, textarea, button").forEach(el => {
    el.disabled = disabled;
  });

  section.style.opacity = disabled ? "0.45" : "1";
  section.style.pointerEvents = disabled ? "none" : "auto";
}

function updateArticleLocks() {
  articleSections.forEach((section, index) => {
    if (index === 0) {
      setSectionDisabled(section, false);
      return;
    }

    const priorSection = articleSections[index - 1];
    const priorSectionComplete = isSectionComplete(priorSection);

    setSectionDisabled(section, !priorSectionComplete);
  });
}

updateArticleLocks();



  timerDisplay = document.getElementById("timer");
  timerDisplay.textContent = formatTime(time);
  pointsDisplay = document.getElementById("points");

  const answers = [
    { id: "myInput1", answer: "Our Favorite Athletes Bring Speed, Precision, Power" },
    { id: "myInput2", answer: "Elite Gymnasts Train Gracefully, Overcoming Weaknesses In Injuries Repeatedly" },
    { id: "myInput3", answer: "Skilled Batters Improve Nightly" },
    { id: "myInput4", answer: "Determined Athletes Push Forward, Practice Perfects, Dominance Follows" },
    { id: "myInput5", answer: "Winners Remain Intense, Training Never Halts In Pursuing Elite Level Honor" },
    { id: "myInput6", answer: "Pitcher Opens, Pitch Spins, Dugout Cheers Wildly" },

    { id: "myInput7", answer: "offer: every Article 2 contract starts with an offer" },
    { id: "myInput8", answer: `firm offer: an offer by a merchant that is held open for a period of time that requires no consideration. Requires a signed writing. If unsupported by consideration, the offer cannot remain open longer than 3 months. If supported by consideration, it endures for the stated time, if no time stated, endures for a reasonable period` },
    { id: "myInput9", answer: "acceptance: unless an offer indicates otherwise, it may be accepted by any reasonable means and manner. An offer to buy goods for immediate and prompt shipment can be accepted by the following conduct: by prompt promise to ship or prompt shipment" },
    { id: "myInput10", answer: `battle of forms: occurs when the seller's acknowledgment form contains additional or different terms from those contained in the buyer's purchase order. To determine the terms, if one of the parties is a non-merchant, variant terms are treated as a mere proposal for addition. If both parties are merchants, the variant terms become part of the contract unless they would materially alter the contract, i.e., result in surprise or hardship to the other party` },
    { id: "myInput11", answer: "statute of frauds: for contracts for goods greater than $500, there must be a writing with a quantity term signed by the party to be charged. Key exceptions: contracts for specially manufactured goods, partial payment, and partial delivery" },
    { id: "myInput12", answer: "parol evidence: extrinsic evidence can be used to supplement a partially integrated final writing. Contradictory terms are inadmissible. When a final writing is fully integrated, the parol evidence rules does not apply" },
    { id: "myInput13", answer: "post-contract modification: does a party to the contract allege a post-formation change in the deal? need not be supported by consideration but must be in writing if within the statute of frauds" },

    { id: "myInput14", answer: "express terms: have the parties agreed on all terms?" },
    { id: "myInput15", answer: "gap in terms: if not all terms agreed upon, did the parties intend to close the deal with finality?" },
    { id: "myInput16", answer: "triplets: if the parties intended to close the deal, look to the triplets to fill gaps. Course of performance (sequence of conduct for the current transaction), course of dealing (sequence of conduct from prior transactions), and trade usage (the business norms and customs of the trade)" },
    { id: "myInput17", answer: "gap-fillers: if the triplets are unavailing, turn to Article 2's gap-fillers" },
    { id: "myInput18", answer: `output, requirement, exclusive dealing: output contract, quantity is determined on the basis of seller's output of production, requirement contract, quantity is determined on the basis of buyer's needs, exclusive dealing would oblige buyer to purchase only from seller all of buyer's needs for a particular good and alternatively would oblige seller to sell its entire supply of a designated good only to buyer` },
    { id: "myInput19", answer: "warranties: to determine the quality of the goods contracted for consult the contract’s express terms in conjunction with Article 2’s section on warranties including, warranty of title, express warranties, implied warranty of merchantability, warranty of fitness for a particular purpose, warranties are cumulative" },
    { id: "myInput20", answer: `impracticability: when seller's performance, while not impossible, is rendered exceedingly difficult or commercially impracticable because of the occurrence of some unforeseeable event. Increased costs and market shifts alone do not excuse performance unless due to some unforeseen contingency, such as a labor strike, embargo, or governmental moratorium` },
    { id: "myInput21", answer: `impossibility: when the goods identified to the contract suffer damage or devastation through no fault of either party and before the risk of loss has passed to the buyer` },
    { id: "myInput22", answer: `risk of loss: if risk of loss has already passed from seller to buyer at the time the goods are destroyed or damaged, excuse doctrine does not apply and buyer must remit payment for the goods (no matter that they compromised or no longer exist). When does risk of loss pass to the buyer? FOB seller’s place of business, passes once goods with carrier. FOB buyer’s place of business, passes when goods arrive at their specified destination. If goods in storage facility, passes when buyer receives documents of title` },

    { id: "myInput23", answer: "seller performance: seller performs by tendering the right goods, to the right place, at the right time" },
    { id: "myInput24", answer: "buyer performance: if seller tendered conforming goods on time, buyer is obligated to accept those goods and pay for them" },
    { id: "myInput25", answer: `inspection: buyer is afforded an opportunity to inspect the goods. In cash on delivery situations, buyer must pay for the goods on delivery before inspecting, unless the defect is in plain view. Payment does not qualify as acceptance in COD situations` },
    { id: "myInput26", answer: `delivery of non-conforming goods: has the buyer accepted? If not, buyer can reject for any defect. Note that in some instances, buyer may be deemed to have accepted by conduct. If accepted, buyer can try to revoke their acceptance. Buyer can reject for any slight defect, but can only revoke an acceptance for a substantial defect which existed at the time of tender (for which buyer bears the burden of proving). Seller may also have a right to cure` },

    { id: "myInput27", answer: "definitions: security interest, security agreement, collateral, secured party, debtor, obligor, purchase money security interest" },
    { id: "myInput28", answer: `attachment: the time in which the security interest becomes enforceable against the debtor. Attachment requires that value has been given, debtor has rights in the collateral, and one of the following: the debtor has authenticated a security agreement that provides a description of the collateral (cannot be supergeneric, i.e., say all assets or all property), or collateral in possession of the secured party` },
    { id: "myInput29", answer: "perfection: designed to provide the world with notice of the secured party’s security interest in debtor’s collateral" },
    { id: "myInput30", answer: `filing to obtain perfection: file a financing statement with the name of the debtor, name of the secured party, and a description of the collateral (can be supergeneric) in the secretary of state's office where the debtor is located. The financing statement is effective for 5 years. If the secured party wants to remain perfected, a continuation statement must be filed within 6 months before the expiration of the filing statement  ` },
    { id: "myInput31", answer: `post-filing events: If debtor changes name, secured party has 4 months to amend financing statement or becomes unperfected in future collateral beyond the 4 month period. If debtor changes location to new state, secured party has 4 months to amend financing statement or becomes unperfected in all collateral (old and new)` },
    { id: "myInput32", answer: `priority basic rules: first to perfect or file. Priority between two perfect parties, first to file. Perfected parties take priority over non-perfected parties. For unperfected parties, first to attach. Secured party v. a lien creditor, first in time first in right` },
    { id: "myInput33", answer: `default: completely a matter of contract. It is whatever the contract or security agreement says it is. Upon default, the secured party has two avenues for judicial enforcement: sue the debtor in court and get a money judgement for the amount of the debt or foreclose on the collateral, i.e., take possession of it and sell it. These rights are cumulative and can be exercised simultaneously  ` },
    { id: "myInput34", answer: `foreclosure sale process: after default, a secured party may sell the collateral. Every aspect of a disposition of collateral must be commercially reasonable. How to distribute proceeds: expenses come off the top. Next comes the foreclosing secured party's debt. Next comes payment of lower priority secured party claims (if notice has been sent to the foreclosing secured party). Debtor gets surplus or owes a deficiency  ` },

    { id: "myInput35", answer: `what is a negotiable instrument? Generally, merges two basic concepts: a contractual obligation and monetary value. Negotiable instruments are cash substitutes` },
    { id: "myInput36", answer: `requirements: promise or order, signed writing, must be unconditional, fixed amount of money, payable to bearer or order, pay on demand or at definite time, no additional undertakings or instructions` },
    { id: "myInput37", answer: `issuance: the first delivery of an instrument by the maker or drawer, whether to a holder or nonholder, for the purpose of giving rights on the instrument to any person. Requires delivery by maker/drawer and intent` },
    { id: "myInput38", answer: `transfer: delivery by a person other than the issuer for the purpose of giving to the person receiving delivery the right to enforce the instrument` },
    { id: "myInput39", answer: `negotiation: transfer of possession, voluntary or involuntary, of an instrument by a person other than the issuer to a person who thereby becomes its holder. If an instrument is payable to an identified person, negotiation requires transfer of possession of the instrument and its indorsement by the holder. If payable to bearer, can be negotiated by transfer or possession alone` },
    { id: "myInput40", answer: `holder: the person in possession of an instrument that is payable to bearer or to an identified person that is the person in possession (right to enforce). The person entitled to enforce bearer paper is the person in possession, the person entitled to enforce order paper is the original payee, or a person subsequently indorsed as payee` },
    { id: "myInput41", answer: `indorsement: a signature not by the maker, drawer, or acceptor (accept a draft for payment) for the purposes of negotiating, restricting payment, or incurring liability. A blank indorsement is a signature that does not identify another payee and turns the instrument into bearer paper. A special indorsement identifies to whom the instrument is payable` },
    { id: "myInput42", answer: `presentment: a demand, made by a person entitled to enforce, that the drawee pay the instrument. Can be made in any commercially reasonable way unless the instrument provides otherwise, can be oral, written, or electronic communication` },
    { id: "myInput43", answer: `enforcement: Person entitled to enforce are holders, nonholders in possession with rights of holder, person without possession with rights for holder, e.g., lost, stolen, or destroyed instrument` },
    { id: "myInput44", answer: `liability: the threshold requirement is a signature` },
    { id: "myInput45", answer: `holder in due course: the HDC has an immunity from many of the defenses that can be raised to escape or reduce the obligation to pay on the instrument. The requirements to be an HDC are, must be in possession of a negotiable instrument, must be a holder, no evidence of inauthenticity or obvious defects, and the HDC must give value (consideration) for the instrument` },

    { id: "myInput46", answer: `properly payable standard: unless agreed otherwise, customer must have authorized payment and payment must not violate the customer's agreement. If an instrument is forged it is not properly payable` },
    { id: "myInput47", answer: "overdraft: banks may pay but do not have to" },
    { id: "myInput48", answer: "post-dated: banks may pay, unless notice received (written notice lasts 6 months, oral notice lasts 14 days)" },
    { id: "myInput49", answer: "stale checks: after 6 months, bank not required to pay" },
    { id: "myInput50", answer: `death or incompetence of customer: requires notice. For death of a customer, the bank may continue to charge the customer's account for up to 10 days after, even with notice` },
    { id: "myInput51", answer: "check collection process: checks are drawn on (or paid from) funds in a bank account, resulting in the person who orders the bank to pay by writing a check (the drawer) who must typically have an account with the bank (making them a customer). The payee is the person entitled to enforce a check: it is either payable to them as an identified person or payable to bearer" },
    { id: "myInput52", answer: "warranties in the checking system: the person presenting the check and obtaining payment gives the presentment warranties, as well as each person that previously transferred (not issued) the check; only run to the payor bank who pays the check (check must be honored) and each person who transfers (not issues or presents) a check for consideration gives transfer warranties – during the check-collection process, the customer and any collecting bank also give transfer warranties; run from the warrantor to the immediate transferee of the check, any subsequent transferees if the check is transferred by indorsement, and any subsequent collecting bank. Actual knowledge of defect only required for forged blank checks under presentment warranties" }
  ];

  const bonusAnswers = [
  { id: "bonusInput1", answer: "security interest: an interest in personal property which secures payment or performance of an obligation, i.e., a loan secured by collateral" },
  { id: "bonusInput2", answer: "security agreement: means an agreement that creates or provides for a security interest" },
  { id: "bonusInput3", answer: "collateral: property subject to a security interest. Consumer goods are goods that are used or bought for use primarily for personal, family, or household purposes. Iventory is leased goods, goods for sale, raw materials, or materials used or consumed in business. Farm products are crops, livestock, supplies used or produced in a farming operation, etc. Equipment are any goods that are not consumer goods, inventory, or farm products and accounts are accounts receivable" },
  { id: "bonusInput4", answer: "secured party: a person in whose favor a security interest is created" },
  { id: "bonusInput5", answer: "debtor: a person having an interest, other than a security interst, in the collateral (usually owns it), whether or not the person is the obligor" },
  { id: "bonusInput6", answer: "obligor: a person that, with respect to an obligation secured by a security interest in collateral, owes payment or other performance of the obligation" },
  { id: "bonusInput7", answer: "purchase money security interest: a loan made in order to purchase something. Includes seller-financing and third-party financing to purchase the item" },
  { id: "bonusInput8", answer: "priority special rules: a PMSI obtains superpriority even over an earlier perfected security interest. The PMSI must be perfected within 20 days, except for a PMSI in inventory, which requires that perfection be completed when debtor receives possession of the inventory and notice must be sent to other secured parties (prior to possession)" },
  { id: "bonusInput9", answer: "automatic perfection: a PMSI in consumer goods is automatically perfected upon attachment" },
  { id: "bonusInput10", answer: "perfection by possession: a secured party may perfect by taking possession of the collateral" },
  { id: "bonusInput11", answer: "depositary bank: first bank to take a check, usually where the person entitled to enforce has an account" },
  { id: "bonusInput12", answer: "payor bank/drawee: the payor bank is the bank that is the drawee of the check, i.e., the bank instructed to pay" },
  { id: "bonusInput13", answer: "intermediary bank: any bank to which a check is transferred during the collection process that is not a depositary bank or payor bank" },
  { id: "bonusInput14", answer: "collecting bank: any bank that handles the check during the check-collection process except payor bank including intermediary and depositary banks" },
  { id: "bonusInput15", answer: "presenting bank: the bank that presents the check and demands payment" },
  { id: "bonusInput16", answer: "defining an order: order means a written instruction to pay money signed by the person giving the instruction. An order involves the three parties: the drawer who orders the payment, the drawee who is instructed to pay, and the payee who is the person entitled to receive payment. To qualify as an order the drawer must direct the drawee to make payment to the payee" },
  { id: "bonusInput17", answer: "defining a promise: promise means a written undertaking to pay money signed by the person undertaking to pay. A maker must actually make a commitment to pay, merely acknowledging the existence of a debt is not enough" },
  { id: "bonusInput18", answer: "defenses and HDC: an HDC takes subject to real defenses (infancy, duress, fraud in factum, and discharge in insolvency), but free of any personal defenses and claims of recoupment" }
];

  totalInputs = answers.length; // keep this only for the main 52 answers



  // =============== AUTO COMPLETE =============

document.querySelectorAll(".autocomplete-btn").forEach((button) => {
  button.addEventListener("click", () => {

    if (gameOver) return;

    const targetId = button.dataset.target;
    const answerObj = answers.find(item => item.id === targetId);
    const input = document.getElementById(targetId);

    if (!answerObj || !input) return;

    // Mark as auto-filled
    autoFilledInputs.add(targetId);

    //no point deduction for auto-complete
    //points -= 1.5;
    pointsDisplay.textContent = "Points: " + points.toFixed(1);

    if (points < 0) {
      endGame();
      return;
    }

    // Fill answer
    input.value = answerObj.answer;

    // Trigger normal logic
    input.dispatchEvent(new Event("input"));
  });
});

 // ================= ATTACH LISTENERS =================

answers.forEach(({ id, answer }) => {
  const input = document.getElementById(id);
  if (!input) return;

  const correct = normalize(answer);
  const prefixWithColon = normalize(answer.split(":")[0] + ":");

  input.addEventListener("input", () => {
    if (gameOver) return;

    const value = normalize(input.value);

    const wasFull = completedInputs.has(id);
    const wasPartial = partialInputs.has(id);

    if (!value) {
      input.style.backgroundColor = "";

      if (wasFull) {
        points -= 1;
        completedInputs.delete(id);
        updateProgress();
        updateArticleLocks();
        updateCurrentGoblin();
        checkTimeBonus();
      }
      if (wasPartial) {
        points -= 0.5;
        partialInputs.delete(id);
        updateProgress();
        updateArticleLocks();
        updateCurrentGoblin();
        checkTimeBonus();
      }
    } 

    // 🟢 FULL CORRECT
    else if (similarity(value, correct) >= 0.9) {
      input.style.backgroundColor = "lightgreen";

      if (autoFilledInputs.has(id)) {
        completedInputs.add(id);

      // If the user already got +0.5 for partial/orange,
      // remove that partial credit when auto-complete is used.
      if (wasPartial) {
        points -= 0.5;
        partialInputs.delete(id);
      }

      updateProgress();
      updateArticleLocks();
      updateCurrentGoblin();
      checkTimeBonus();
    } else {
        if (!wasFull) {
          points += 1;
          completedInputs.add(id);
          updateProgress();
          updateArticleLocks();
          updateCurrentGoblin();
          checkTimeBonus();
        }

        if (wasPartial) {
          points -= 0.5;
          partialInputs.delete(id);
        }
      }
    } 

    // 🟠 PREFIX + COLON
    else if (value.startsWith(prefixWithColon)) {
      input.style.backgroundColor = "orange";

      if (!wasPartial) {
        points += 0.5;
        partialInputs.add(id);
      }

      if (wasFull) {
        points -= 1;
        completedInputs.delete(id);
        updateProgress(); 
        updateArticleLocks();
        updateCurrentGoblin();
        checkTimeBonus();
      }
    } 

    // ❌ WRONG
    else {
      input.style.backgroundColor = "";

      if (wasFull) {
        points -= 1;
        completedInputs.delete(id);
        updateProgress(); 
        updateArticleLocks();
        updateCurrentGoblin();
        checkTimeBonus();
      }

      if (wasPartial) {
        points -= 0.5;
        partialInputs.delete(id);
        updateProgress(); 
        updateArticleLocks();
        updateCurrentGoblin();
        checkTimeBonus();
      }
    }

    // Update points display
    pointsDisplay.textContent = "Points: " + points.toFixed(1);

    if (points < 0) {
      endGame();
    }  

  });
});

bonusAnswers.forEach(({ id, answer }) => {
  const input = document.getElementById(id);
  if (!input) return;

  const correct = normalize(answer);

  input.addEventListener("input", () => {
    if (gameOver) return;

    const value = normalize(input.value);
    const wasComplete = completedBonusInputs.has(id);

    if (similarity(value, correct) >= 0.9) {
      input.style.backgroundColor = "lightgreen";

      if (!wasComplete) {
        points += 1;
        completedBonusInputs.add(id);
      }
    } else {
      input.style.backgroundColor = "";

      if (wasComplete) {
        points -= 1;
        completedBonusInputs.delete(id);
      }
    }

    pointsDisplay.textContent = "Points: " + points.toFixed(1);
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

    // 🔻 Deduct 1.5 points for hint
    points -= 1;
    pointsDisplay.textContent = "Points: " + points.toFixed(1);

    if (points < 0) {
      endGame();
    }

    // Show hint
    alert(answerObj.answer);
  });
});

  setInterval(() => {
  if (gameOver || !interval) return;

  const index = getCurrentSectionIndex();

  let penalty = 0;

  if (index === 0) penalty = 0.25;
  else if (index === 1) penalty = 0.5;
  else if (index === 2) penalty = 0.75;
  else penalty = 1;

  points -= penalty;
  pointsDisplay.textContent = "Points: " + points.toFixed(2);

  animateGoblinHit();

  if (points < 0) {
    endGame();
  }
}, 120000);


  updateProgress(); 
  updateArticleLocks();
  updateCurrentGoblin();
  checkTimeBonus();
});

function isSectionComplete(section) {
  const fields = section.querySelectorAll("input, textarea");

  return Array.from(fields).every(field =>
    completedInputs.has(field.id)
  );
}

function getCurrentSectionIndex() {
  for (let i = 0; i < articleSections.length; i++) {
    const section = articleSections[i];
    const fields = section.querySelectorAll("input, textarea");

    const isComplete = Array.from(fields).every(field =>
      completedInputs.has(field.id)
    );

    if (!isComplete) {
      return i;
    }
  }

  return articleSections.length - 1;
}


function animateGoblinHit() {
  const enemy = document.getElementById("enemy");
  if (!enemy) return;

  enemy.style.transition = "transform 0.15s ease";
  enemy.style.transform = "scale(1.2)";

  setTimeout(() => {
    enemy.style.transform = "scale(1)";
  }, 150);
}

function updateProgress() {
  const completedCount = completedInputs.size;
  progressDisplay.textContent = `Completed: ${completedCount} / ${totalInputs}`;
}

// =============== DICTATION =============

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  document.querySelectorAll(".dictate-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (gameOver) return;

      const targetId = button.dataset.target;
      const input = document.getElementById(targetId);

      if (!input) return;

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      button.textContent = "Listening...";

      recognition.start();

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;

        input.value = input.value
          ? input.value + " " + spokenText
          : spokenText;

        input.dispatchEvent(new Event("input"));
      };

      recognition.onend = () => {
        button.textContent = "Dictate";
      };

      recognition.onerror = () => {
        button.textContent = "Dictate";
        alert("Dictation did not work. Try again or check microphone permissions.");
      };
    });
  });
} else {
  alert("Dictation is not supported in this browser. Try Chrome or Edge.");
}

//================= END GAME ==============

function endGame() {
  if (gameOver) return; // prevent running twice
  gameOver = true;

  stopTimer();

  // Disable all inputs + textareas
  document.querySelectorAll("input, textarea").forEach(el => {
    el.disabled = true;
    el.style.backgroundColor = "#ccc"; // grey out
  });

  alert("Game over");
}

//============== ADD TIME FUNCTION =========

function countCompletedSections() {
  return articleSections.filter(section => isSectionComplete(section)).length;
}

function checkTimeBonus() {
  const completed = countCompletedSections();

  // Every 2 sections → bonus
  const eligibleBonuses = Math.floor(completed / 2);

  if (eligibleBonuses > bonusAwardedFor) {
    const bonusTimes = eligibleBonuses - bonusAwardedFor;

    // Add 10 minutes per new bonus
    time += bonusTimes * 600;

    timerDisplay.textContent = formatTime(time);

    bonusAwardedFor = eligibleBonuses;

    alert("+10 minutes awarded!");
  }
}

