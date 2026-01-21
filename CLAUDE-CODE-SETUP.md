# Nordic Nerd Multi-Agent System - Claude Code Edition

Complete setup guide for running the 5-agent development system locally with Claude Code.

---

## Prerequisites

1. **Claude Code CLI** installed
2. **Anthropic API key** with access to Claude Code
3. **Node.js 18+** and npm
4. **GitHub account** with personal access token
5. **Your Nuxt 4 project** ready

---

## Step 1: Install Claude Code

```bash
# Via npm
npm install -g @anthropic-ai/claude-code

# Or via Homebrew (Mac)
brew install anthropic/tap/claude-code

# Verify installation
claude --version
```

---

## Step 2: Authenticate Claude Code

```bash
# Login with your Anthropic API key
claude auth login

# You'll be prompted for your API key
# Get it from: https://console.anthropic.com/settings/keys
```

---

## Step 3: Set Up Project Structure

```bash
# In your project root
mkdir -p .claude/agents
mkdir -p .claude/prompts
mkdir -p .claude/workflows
mkdir -p server/utils
mkdir -p server/api/{pm,agents/{functional,ui,content,accessibility}}
mkdir -p .github/ISSUE_TEMPLATE
```

---

## Step 4: Copy All Configuration Files

Copy these files to your project:

### `.claude/` directory:

```
.claude/
├── config.json                        ← Main Claude Code config
├── agents/
│   ├── pm.json                        ← PM agent config
│   ├── functional.json                ← Functional dev config
│   ├── ui.json                        ← UI dev config
│   ├── content.json                   ← Content/SEO config
│   └── accessibility.json             ← Accessibility config
├── prompts/
│   ├── pm-system.md                   ← PM system prompt
│   ├── functional-system.md           ← Functional system prompt
│   ├── ui-system.md                   ← UI system prompt
│   ├── content-system.md              ← Content system prompt
│   └── accessibility-system.md        ← Accessibility system prompt
└── workflows/
    └── feature-pipeline.json          ← Multi-agent workflow
```

### Server files (same as before):

- `server/utils/github.ts`
- `server/api/pm/create-story.post.ts`
- `server/api/agents/*/complete.post.ts`

### GitHub templates (same as before):

- `.github/ISSUE_TEMPLATE/*.md`

---

## Step 5: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

Add:

```bash
# Anthropic API Key (for Claude Code)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# GitHub Configuration
GITHUB_TOKEN=ghp_your-token-here
GITHUB_OWNER=nordicnerd
GITHUB_REPO=your-project-name
GITHUB_PROJECT_NUMBER=1
```

---

## Step 6: Install Dependencies

```bash
# Install required packages
npm install @octokit/rest

# Install dev dependencies
npm install -D @types/node

# Start your Nuxt dev server (for API endpoints)
npm run dev
```

---

## Usage: Claude Code CLI Commands

### Basic Agent Commands

#### 1. Invoke Single Agent

```bash
# Project Manager - Create a story
claude agent pm "Create a user story for a contact form with name, email, message fields and validation"

# Functional Dev - Implement a feature
claude agent functional "Build a ProductGallery component with filtering by category"

# UI Dev - Style components
claude agent ui "Style the contact form with Nordic minimal aesthetic. Brand: clean, blue/gray palette, sans-serif typography"

# Content/SEO - Write copy
claude agent content "Write SEO-optimized homepage copy targeting 'custom sticker printing' keyword"

# Accessibility - Audit
claude agent accessibility "Audit the contact form for WCAG 2.1 AA compliance"
```

#### 2. Run Complete Workflow

```bash
# Run the full 5-agent pipeline
claude workflow feature-pipeline

# You'll be prompted for:
# 1. Feature requirement
# 2. Brand information (optional)
# 3. SEO goals (optional)
# Then agents run in sequence with approval gates
```

#### 3. List Available Agents

```bash
claude agents list
```

Output:

```
Available agents:
- pm: Project Manager - Creates user stories and orchestrates agents
- functional: Functional Developer - Builds core logic and tests
- ui: UI Developer - Creates design systems and styles
- content: Content/SEO Specialist - Writes copy and optimizes for search
- accessibility: Accessibility Developer - Ensures WCAG compliance
```

#### 4. Interactive Mode

```bash
# Start interactive session with an agent
claude agent pm --interactive

# Now you can chat with the PM agent
You: Create a story for user authentication
PM Agent: I'll create a comprehensive user story...
```

---

## Usage: Real-World Examples

### Example 1: Complete Feature from Scratch

```bash
# Terminal 1: Start Nuxt dev server (for API)
npm run dev

# Terminal 2: Run full pipeline
claude workflow feature-pipeline
```

**Workflow prompts:**

```
? Feature: Build a product gallery with filtering, search, and pagination
? Brand: Legendary Prints - fun, creative, energetic. See /assets/brand/
? SEO: Primary: custom stickers, Secondary: personalized stickers, sticker design

→ PM Agent creates GitHub issues #45-49
→ Functional Agent builds ProductGallery.vue
→ UI Agent styles with brand colors
→ Content Agent writes copy and meta tags
→ Accessibility Agent audits and fixes
✅ Feature complete!
```

### Example 2: Individual Agent Work

```bash
# PM creates story
claude agent pm "Build a newsletter signup with email validation"

# Copy the GitHub issue number (e.g., #12)

# Functional dev implements
claude agent functional "Implement newsletter signup per GitHub issue #12"

# UI styles it
claude agent ui "Style newsletter signup per issue #13, use existing design tokens"

# Content writes copy
claude agent content "Write newsletter signup copy per issue #14, targeting 'email marketing' keyword"

# Accessibility audits
claude agent accessibility "Audit newsletter form per issue #15"
```

### Example 3: Fix/Enhance Existing Feature

```bash
# Accessibility fixes
claude agent accessibility "Audit the existing contact form at components/ContactForm.vue and fix any WCAG violations"

# UI enhancement
claude agent ui "Add hover animations to all buttons using the existing design system"

# Content update
claude agent content "Update homepage hero copy to target 'best custom stickers' keyword"
```

---

## Advanced Usage

### Chaining Agents with Context

```bash
# Save functional output to file
claude agent functional "Build UserProfile component" > /tmp/functional-output.txt

# Pass to UI agent
claude agent ui "Style the UserProfile component. Context: $(cat /tmp/functional-output.txt)"
```

### Using with Git Workflow

```bash
# Create feature branch
git checkout -b feature/product-gallery

# Run functional agent
claude agent functional "Build product gallery"

# Commit
git add .
git commit -m "feat: Add product gallery component"

# Run UI agent
claude agent ui "Style product gallery"
git add .
git commit -m "style: Add product gallery styling"

# Continue for content and accessibility...
```

### Custom Agent Configuration

Edit `.claude/agents/pm.json` to customize:

```json
{
  "prompts": {
    "welcome": "Your custom welcome message",
    "examples": ["Your custom example 1", "Your custom example 2"]
  }
}
```

---

## IDE Integration

### VS Code

1. Install "Claude Code" extension
2. Open Command Palette (Cmd/Ctrl + Shift + P)
3. Type "Claude: Run Agent"
4. Select agent and provide prompt

### Cursor

Claude Code works natively in Cursor:

1. Press Cmd+K
2. Type `@pm` or `@functional` etc to invoke agents
3. Provide instructions

### JetBrains IDEs

1. Install "AI Assistant" plugin
2. Configure with Claude API
3. Use custom commands to invoke agents

---

## Troubleshooting

### "Agent not found"

```bash
# Verify agents are configured
claude agents list

# Check config file
cat .claude/config.json
```

### "API endpoint not responding"

```bash
# Ensure Nuxt dev server is running
npm run dev

# Test endpoint
curl http://localhost:3000/api/pm/create-story
```

### "GitHub integration failing"

```bash
# Check environment variables
echo $GITHUB_TOKEN
echo $GITHUB_REPO

# Verify token has correct scopes
# Should have: repo, project
```

### "Agent responses are incomplete"

```bash
# Increase max tokens in agent config
# Edit .claude/agents/pm.json:
{
  "maxTokens": 8000  // increase if needed
}
```

---

## Workflow Customization

Edit `.claude/workflows/feature-pipeline.json` to:

- Skip approval gates: `"waitForApproval": false`
- Add custom steps: Add to `"steps"` array
- Change agent order: Reorder steps
- Add hooks: Pre/post execution commands

Example - Skip approvals for faster iteration:

```json
{
  "steps": [
    {
      "id": "functional-dev",
      "waitForApproval": false // No approval needed
    }
  ]
}
```

---

## Best Practices

### 1. Start Small

```bash
# First feature: Simple contact form
claude workflow feature-pipeline
```

### 2. Review Each Phase

- Don't skip approval gates on first run
- Check code quality after each agent
- Adjust prompts if output isn't right

### 3. Keep Context Focused

```bash
# Good: Specific task
claude agent functional "Build ContactForm component with email validation"

# Bad: Vague task
claude agent functional "Build everything for the website"
```

### 4. Use GitHub Issues

- Let PM agent create issues
- Reference issue numbers in subsequent agents
- Track progress in GitHub Projects

### 5. Iterate on Agent Prompts

- Edit `.claude/prompts/*.md` to improve responses
- Add examples specific to your projects
- Include your coding style preferences

---

## Tips & Tricks

### Quick Commands (Add to your .bashrc/.zshrc)

```bash
# Aliases for common operations
alias cn-pm='claude agent pm'
alias cn-func='claude agent functional'
alias cn-ui='claude agent ui'
alias cn-content='claude agent content'
alias cn-a11y='claude agent accessibility'
alias cn-full='claude workflow feature-pipeline'

# Usage:
# cn-pm "Create story for user auth"
# cn-func "Build login component"
```

### Auto-commit After Each Agent

Add to `.claude/config.json`:

```json
{
  "hooks": {
    "afterAgent": "git add . && git commit -m 'Agent ${agentName}: ${taskSummary}'"
  }
}
```

### Parallel Agent Execution (Advanced)

```bash
# Run UI and Content in parallel (after Functional is done)
claude agent ui "Style product gallery" &
claude agent content "Write product descriptions" &
wait

# Then run Accessibility
claude agent accessibility "Audit product gallery and descriptions"
```

---

## Next Steps

1. ✅ Complete Claude Code setup
2. ✅ Test with single agent: `claude agent pm "test story"`
3. ✅ Run full workflow: `claude workflow feature-pipeline`
4. 🚀 Build your first client feature!
5. 📈 Iterate and customize agent prompts

---

## Support & Resources

- **Claude Code Docs**: https://docs.anthropic.com/claude-code
- **GitHub Issues**: Create issues in your `.claude/` repo
- **Agent Prompts**: Edit `.claude/prompts/*.md` to customize

Happy shipping with AI-powered development! 🚀
