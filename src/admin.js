const loginForm = document.getElementById("loginForm");
const submissionsList = document.getElementById("submissionsList");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document.getElementById("adminPassword").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) throw new Error("Unauthorized");

    loginForm.classList.add("hidden");
    submissionsList.classList.remove("hidden");

    await loadSubmissions();
  } catch (err) {
    alert("Incorrect password!");
  }
});

// ------- LOAD DATA -------
export async function loadSubmissions() {
  submissionsList.innerHTML = "";

  try {
    const res = await fetch("/api/getCompanies");
    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();

    data.forEach((submit) => {
      const card = document.createElement("div");
      card.className = "border p-4 bg-white rounded shadow flex flex-col";

      const header = document.createElement("div");
      header.className = "flex justify-between items-center";

      const nameEl = document.createElement("span");
      nameEl.textContent = submit.companyName || "Unnamed Company";
      nameEl.className = "font-semibold text-lg";

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = "Show More";
      toggleBtn.className =
        "text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600";

      header.appendChild(nameEl);
      header.appendChild(toggleBtn);

      const details = document.createElement("div");
      details.className = "mt-2 hidden flex-col gap-1 text-gray-700";

      // CreatedAt
      if (submit.createdAt) {
        const createdAt = new Date(submit.createdAt);
        const pDate = document.createElement("p");
        pDate.innerHTML =
          `<span class="font-semibold">Submitted:</span> ` +
          createdAt.toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" });
        details.appendChild(pDate);
      }

      // NORMAL FIELDS
      for (const [key, value] of Object.entries(submit)) {
        if (["_id", "createdAt", "screenshot"].includes(key)) continue;

        const p = document.createElement("p");
        p.innerHTML = `<span class="font-semibold">${key}:</span> ${value}`;
        details.appendChild(p);
      }

      // -----------------------
      // SCREENSHOT FIELD (short + expand + download)
      // -----------------------
      if (submit.screenshot) {
        const shortTxt = submit.screenshot.substring(0, 40) + "...";

        const wrapper = document.createElement("div");
        wrapper.className = "mt-2";

        wrapper.innerHTML = `
          <p class="font-semibold">Screenshot:</p>
          <span class="short-text text-sm">${shortTxt}</span>
          <button class="toggleScreenshot text-blue-600 underline ml-2">Show More</button>
          <button class="downloadScreenshot ml-3 px-2 py-1 bg-green-500 text-white rounded">
            Download
          </button>
          <pre class="fullScreenshot hidden mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
${submit.screenshot}
          </pre>
        `;

        details.appendChild(wrapper);

        // Toggle
        wrapper
          .querySelector(".toggleScreenshot")
          .addEventListener("click", (e) => {
            const full = wrapper.querySelector(".fullScreenshot");
            full.classList.toggle("hidden");
            e.target.textContent = full.classList.contains("hidden")
              ? "Show More"
              : "Show Less";
          });

        // Download
        wrapper
          .querySelector(".downloadScreenshot")
          .addEventListener("click", () => {
            const fullData = "data:image/png;base64," + submit.screenshot;
            const a = document.createElement("a");
            a.href = fullData;
            a.download = "screenshot.png";
            a.click();
          });
      }

      toggleBtn.addEventListener("click", () => {
        details.classList.toggle("hidden");
        toggleBtn.textContent = details.classList.contains("hidden")
          ? "Show More"
          : "Show Less";
      });

      card.appendChild(header);
      card.appendChild(details);
      submissionsList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    submissionsList.textContent = "Error loading submissions.";
  }
}
