/*
*********************************
 Subject: CGD 210 (Winter 2026)
 Author: Edilvan E. Falcon
 Date Created: 2025.02.25
 Description: Assignment No. 4
 
 Create an page to engage users and then direct them to your product or service page.
*********************************
*/

/* ====== CONFIG (edit this) ====== */
      const REDIRECT_URL = "https://navlide.github.io/cgd210-w2026/assign-2/"; // <-- put your jacket product page here

      /* ====== QUIZ DATA (JACKET FIT FINDER) ====== */
      const quiz = [
        {
          key: "use",
          title: "Where will you wear this jacket most?",
          options: [
            {
              label: "Everyday commute",
              desc: "Office, errands, daily wear",
              tag: "Daily",
            },
            {
              label: "Travel & flights",
              desc: "Lightweight comfort on the move",
              tag: "Travel",
            },
            {
              label: "Night out",
              desc: "Clean look that levels up outfits",
              tag: "Style",
            },
            {
              label: "Outdoor walks",
              desc: "Breezy days and changing weather",
              tag: "Outdoor",
            },
          ],
        },
        {
          key: "warmth",
          title: "How warm do you want it to feel?",
          options: [
            {
              label: "Light",
              desc: "For mild weather or layering",
              tag: "Light",
            },
            {
              label: "Medium",
              desc: "All-around, most versatile",
              tag: "Versatile",
            },
            {
              label: "Warm",
              desc: "For cooler days & extra comfort",
              tag: "Cozy",
            },
          ],
        },
        {
          key: "fit",
          title: "What fit do you prefer?",
          options: [
            {
              label: "Slim",
              desc: "Sharper shape, closer to the body",
              tag: "Tailored",
            },
            {
              label: "Regular",
              desc: "Balanced room + clean silhouette",
              tag: "Best Seller",
            },
            {
              label: "Relaxed",
              desc: "More space for hoodies/layers",
              tag: "Layering",
            },
          ],
        },
      ];

      // ====== STATE ======
      const state = { step: 0, answers: {} };

      // ====== ELEMENTS ======
      const stepText = document.getElementById("stepText");
      const barFill = document.getElementById("barFill");
      const qTitle = document.getElementById("qTitle");
      const optionsEl = document.getElementById("options");
      const backBtn = document.getElementById("backBtn");
      const nextBtn = document.getElementById("nextBtn");
      const hint = document.getElementById("hint");

      const resultBox = document.getElementById("resultBox");
      const rDesc = document.getElementById("rDesc");
      const meterFill = document.getElementById("meterFill");
      const confidenceText = document.getElementById("confidenceText");
      const ctaBtn = document.getElementById("ctaBtn");

      function setProgress() {
        const total = quiz.length;
        const pct = Math.round((state.step / total) * 100);
        barFill.style.width = pct + "%";
        stepText.textContent = `Step ${Math.min(state.step + 1, total)} of ${total}`;
      }

      function render() {
        setProgress();

        const isDone = state.step >= quiz.length;
        document.getElementById("questionBox").style.display = isDone
          ? "none"
          : "block";
        resultBox.style.display = isDone ? "block" : "none";

        backBtn.disabled = state.step === 0;

        if (isDone) {
          showResult();
          return;
        }

        const current = quiz[state.step];
        qTitle.textContent = current.title;

        nextBtn.disabled = true;
        hint.textContent = "Choose one to continue";

        optionsEl.innerHTML = "";
        const selected = state.answers[current.key];

        current.options.forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "opt";
          btn.innerHTML = `
          <div class="left">
            <b>${opt.label}</b>
            <small>${opt.desc}</small>
          </div>
          <span class="chip">${opt.tag}</span>
        `;

          if (selected && selected.label === opt.label) {
            btn.style.borderColor = "rgba(100,240,182,.55)";
            btn.style.background = "rgba(100,240,182,.10)";
            nextBtn.disabled = false;
            hint.textContent = "Nice — click Next";
          }

          btn.addEventListener("click", () => {
            state.answers[current.key] = opt;
            [...optionsEl.children].forEach((el) => {
              el.style.borderColor = "rgba(255,255,255,.14)";
              el.style.background = "rgba(255,255,255,.06)";
            });
            btn.style.borderColor = "rgba(100,240,182,.55)";
            btn.style.background = "rgba(100,240,182,.10)";
            nextBtn.disabled = false;
            hint.textContent = "Locked in — click Next";
          });

          optionsEl.appendChild(btn);
        });
      }

      function computeMatch() {
        const use = state.answers.use?.label || "";
        const warmth = state.answers.warmth?.label || "";
        const fit = state.answers.fit?.label || "";

        // Recommendation logic (edit to match your actual variants/SKUs)
        let name = "Everyday Essential Jacket";
        let details =
          "A clean, go-anywhere jacket with an easy silhouette—built for daily wear and effortless layering.";
        let confidence = 78;

        if (use.includes("Travel")) {
          name = "Travel-Ready Jacket";
          details =
            "Comfort-focused and polished—great for airports, long days, and outfits that need to look put-together fast.";
          confidence += 7;
        } else if (use.includes("Night")) {
          name = "City Night Jacket";
          details =
            "Sharper look with a sleek vibe—pairs easily with dark denim, boots, or dressier fits.";
          confidence += 6;
        } else if (use.includes("Outdoor")) {
          name = "Weekend Outdoor Jacket";
          details =
            "Made for breezy walks and changing temps—easy to throw on and stay comfortable.";
          confidence += 5;
        } else {
          confidence += 4;
        }

        if (warmth === "Light") {
          details +=
            " You picked a lighter feel—perfect for mild weather or wearing over tees.";
          confidence += 2;
        } else if (warmth === "Medium") {
          details +=
            " You picked medium warmth—the most versatile choice for everyday use.";
          confidence += 4;
        } else if (warmth === "Warm") {
          details +=
            " You picked warm—ideal for cooler days and extra comfort.";
          confidence += 3;
        }

        if (fit === "Slim") {
          details +=
            " Slim fit gives a cleaner line—size up if you want heavy layering.";
          confidence += 3;
        } else if (fit === "Regular") {
          details +=
            " Regular fit is the safest bet—clean silhouette with room to move.";
          confidence += 5;
        } else if (fit === "Relaxed") {
          details +=
            " Relaxed fit is made for layering—hoodies and thicker knits welcome.";
          confidence += 2;
        }

        confidence = Math.max(62, Math.min(96, confidence));

        return { name, details, confidence };
      }

      function showResult() {
        barFill.style.width = "100%";
        stepText.textContent = `Done • Your jacket match`;

        const { name, details, confidence } = computeMatch();
        document.getElementById("rTitle").textContent =
          `Your match: ${name} ✅`;
        rDesc.textContent = details;

        meterFill.style.width = confidence + "%";
        confidenceText.textContent = confidence + "%";
      }

      nextBtn.addEventListener("click", () => {
        const current = quiz[state.step];
        if (!state.answers[current.key]) return;
        state.step += 1;
        render();
      });

      backBtn.addEventListener("click", () => {
        state.step = Math.max(0, state.step - 1);
        render();
      });

      ctaBtn.addEventListener("click", () => {
        // Optional: pass quiz choices to product page for analytics/personalization
        const params = new URLSearchParams({
          use: state.answers.use?.label || "",
          warmth: state.answers.warmth?.label || "",
          fit: state.answers.fit?.label || "",
        });
        window.location.href = `${REDIRECT_URL}?${params.toString()}`;
      });

      render();