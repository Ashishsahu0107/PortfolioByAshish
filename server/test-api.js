// Comprehensive automated API verification script
const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("=== STARTING FULL BACKEND API SUITE ===");
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health
  await test("GET /api/health", async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const json = await res.json();
    if (!json.success || json.status !== "ok") throw new Error("Health check failed");
  });

  // 2. Auth Login
  let token = "";
  await test("POST /api/auth/login", async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@ashish.dev",
        password: "AdminPassword123!",
      }),
    });
    const json = await res.json();
    if (!json.success || !json.token) throw new Error("Login failed: " + json.message);
    token = json.token;
  });

  // 3. Auth Me
  await test("GET /api/auth/me (Protected)", async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success || !json.user) throw new Error("Auth me failed");
  });

  // 4. Developer API
  await test("GET /api/developer & PUT /api/developer", async () => {
    const getRes = await fetch(`${BASE_URL}/developer`);
    const getJson = await getRes.json();
    if (!getJson.success || !getJson.data.name) throw new Error("Get developer failed");

    const putRes = await fetch(`${BASE_URL}/developer`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ availableForWork: true }),
    });
    const putJson = await putRes.json();
    if (!putJson.success) throw new Error("Put developer failed");
  });

  // 5. About API
  await test("GET /api/about", async () => {
    const res = await fetch(`${BASE_URL}/about`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data.focusAreas)) throw new Error("Get about failed");
  });

  // 6. Skills API
  await test("GET /api/skills", async () => {
    const res = await fetch(`${BASE_URL}/skills`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error("Get skills failed");
  });

  // 7. Projects API
  let createdProjectId = "";
  await test("Projects CRUD (GET, POST, PUT, DELETE)", async () => {
    // GET
    const getRes = await fetch(`${BASE_URL}/projects`);
    const getJson = await getRes.json();
    if (!getJson.success || !Array.isArray(getJson.data)) throw new Error("Get projects failed");

    // POST
    const postRes = await fetch(`${BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Temporary Test Project",
        subtitle: "Verifying Automated End-to-End API Integration",
        category: "Test Suite",
        year: "2026",
        featured: false,
      }),
    });
    const postJson = await postRes.json();
    if (!postJson.success || !postJson.data.id) throw new Error("Create project failed");
    createdProjectId = postJson.data.id;

    // PUT
    const putRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "Temporary Test Project (Updated)" }),
    });
    const putJson = await putRes.json();
    if (!putJson.success || putJson.data.title !== "Temporary Test Project (Updated)") {
      throw new Error("Update project failed");
    }

    // DELETE
    const delRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const delJson = await delRes.json();
    if (!delJson.success) throw new Error("Delete project failed");
  });

  // 8. Experience API
  await test("GET /api/experience", async () => {
    const res = await fetch(`${BASE_URL}/experience`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error("Get experience failed");
  });

  // 9. Sections API
  await test("GET /api/sections", async () => {
    const res = await fetch(`${BASE_URL}/sections`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error("Get sections failed");
  });

  // 10. Forms & Submissions API
  await test("Forms & Submissions Flow", async () => {
    const formsRes = await fetch(`${BASE_URL}/forms`);
    const formsJson = await formsRes.json();
    if (!formsJson.success || !Array.isArray(formsJson.data)) throw new Error("Get forms failed");

    // Submit test form response
    const submitRes = await fetch(`${BASE_URL}/forms/contact/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Inquirer",
        email: "inquirer@test.com",
        subject: "Automated API Test",
        message: "Hello from verification test suite!",
      }),
    });
    const submitJson = await submitRes.json();
    if (!submitJson.success) throw new Error("Form submit failed: " + submitJson.message);
  });

  // 11. Contact Message API
  await test("Contact Send & Message View", async () => {
    const sendRes = await fetch(`${BASE_URL}/contact/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Direct Contact Tester",
        email: "direct@test.dev",
        subject: "Direct Portfolio Message",
        message: "Testing direct message pipeline.",
      }),
    });
    const sendJson = await sendRes.json();
    if (!sendJson.success) throw new Error("Contact send failed");

    // Fetch inbox (Protected)
    const inboxRes = await fetch(`${BASE_URL}/contact/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const inboxJson = await inboxRes.json();
    if (!inboxJson.success || !Array.isArray(inboxJson.data)) throw new Error("Inbox fetch failed");
  });

  // 12. Overview Telemetry
  await test("GET /api/overview (Protected)", async () => {
    const res = await fetch(`${BASE_URL}/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success || !json.data.counts || !json.data.system) {
      throw new Error("Overview telemetry failed");
    }
  });

  console.log(`\n=== API SUITE FINISHED: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests();
