# Secrets Scanning Setup

This repository is protected by automated secrets scanning to prevent accidental credential leaks.

## 🛡️ Protection Layers

### 1. Pre-Commit Hook (Local)
**Location:** `.git/hooks/pre-commit`

Automatically scans staged files before each commit. Blocks commits containing:
- API keys (OpenAI, Anthropic, AWS, Google, etc.)
- Authentication tokens
- Private keys
- High-entropy strings (potential secrets)

**Bypass (NOT recommended):**
```bash
git commit --no-verify
```

### 2. GitHub Actions CI (Remote)
**Location:** `.github/workflows/secrets-scan.yml`

Runs on every pull request and push:
- Scans changed files for secrets
- Uses gitleaks for deep history scanning
- Blocks PRs if secrets detected

### 3. Pattern Database
**Location:** `.secrets-patterns`

Contains regex patterns for detecting secrets. Add custom patterns here.

### 4. Git History Scanner
**Location:** `scan-git-history.sh`

Scans entire git history for leaked secrets.

**Usage:**
```bash
./scan-git-history.sh
```

Generates timestamped report: `secrets-scan-report-YYYYMMDD-HHMMSS.txt`

---

## 📋 Quick Start

### First-Time Setup
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Add your API keys to .env
nano .env

# 3. Secure .env permissions
chmod 600 .env

# 4. Verify .env is gitignored
git check-ignore .env  # Should output: .env

# 5. Test pre-commit hook
git add .env.example
git commit -m "test: verify secrets scanning"
# Should pass (no secrets in .example file)
```

### Testing Secrets Detection
```bash
# Create a test file with a fake secret
echo "api_key=sk-test123456789012345678901234567890" > test-secret.txt

# Try to commit it
git add test-secret.txt
git commit -m "test: should be blocked"

# Expected: Commit blocked with error message

# Clean up
rm test-secret.txt
```

---

## 🚨 What to Do If Secrets Are Detected

### During Commit (Pre-Commit Hook)
1. **Remove the secret** from the staged file
2. **Move it to .env** (already gitignored)
3. **Use environment variables** in your code
4. **Try commit again**

### During PR (GitHub Actions)
1. **Fix locally** (remove secret from file)
2. **Amend the commit:**
   ```bash
   git commit --amend --no-edit
   git push --force
   ```

### In Git History
If secrets were committed in the past:

#### Option 1: BFG Repo-Cleaner (Fast)
```bash
# Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove secrets
bfg --replace-text passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

#### Option 2: git-filter-repo (Thorough)
```bash
# Install
pip install git-filter-repo

# Remove file from history
git-filter-repo --path .env --invert-paths

# Force push
git push --force
```

#### Option 3: Rotate Everything
If secrets were exposed:
1. **Rotate ALL affected API keys immediately**
2. **Clean git history** (above methods)
3. **Notify your team**
4. **Review access logs** for unauthorized usage

---

## 🔍 Scanning Patterns

Current patterns detect:

### API Keys
- OpenAI: `sk-proj-*`, `sk-*`
- Anthropic: `sk-ant-*`
- Google: `AIzaSy*`
- AWS: `AKIA*`
- GitHub: `ghp_*`, `github_pat_*`
- ElevenLabs: `sk_[hex]`
- Brave: `BSA*`

### Tokens
- JWT tokens
- Bearer tokens
- Slack tokens: `xox[baprs]-*`
- Telegram bot tokens

### Credentials
- Database connection strings
- Private keys (RSA, DSA, EC, OpenSSH)
- Generic password/secret/api_key assignments

### High Entropy
- 40+ character random-looking strings

---

## ⚙️ Configuration

### Exclude Files from Scanning
Edit `.git/hooks/pre-commit` and add to `EXCLUDE_PATTERNS`:
```bash
EXCLUDE_PATTERNS=(
    "*.example"
    "*.sample"
    "your-file-here.txt"
)
```

### Add Custom Patterns
Edit `.secrets-patterns`:
```regex
# Your custom pattern
my-custom-api-key-[a-zA-Z0-9]{32}
```

### Disable Scanning (Emergency)
```bash
# Temporarily disable pre-commit hook
chmod -x .git/hooks/pre-commit

# Re-enable later
chmod +x .git/hooks/pre-commit
```

---

## 📊 Scanning Reports

### Local Scans
- Pre-commit hook: Terminal output only
- History scanner: `secrets-scan-report-*.txt`

### CI/CD Scans
- GitHub Actions: Check "Actions" tab in repository
- Gitleaks report: Viewable in workflow logs

---

## 🔐 Best Practices

1. **Never commit secrets** - Use environment variables
2. **Always use .env** - Keep credentials out of code
3. **Rotate keys regularly** - Quarterly at minimum
4. **Limit key scope** - Use least-privilege API keys
5. **Monitor usage** - Check API dashboards for anomalies
6. **Use .env.example** - Template for onboarding new developers
7. **Review PRs carefully** - Even with automation, human review matters

---

## 🆘 Support

**False positive?**
- Check if value is obviously fake (test/example/placeholder)
- Add file to exclusion list if needed
- Refine pattern in `.secrets-patterns`

**Need help?**
- Check logs: `git show :0:.git/hooks/pre-commit`
- Review patterns: `cat .secrets-patterns`
- Scan history: `./scan-git-history.sh`

**Emergency bypass:**
```bash
# Only if absolutely necessary
git commit --no-verify -m "emergency: bypass scanning"

# Then immediately:
# 1. Rotate any exposed secrets
# 2. Fix the issue properly
# 3. Amend the commit
```

---

## 📚 References

- [OpenClaw Security Docs](https://docs.openclaw.ai/security)
- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

**Last Updated:** 2026-02-19  
**Maintained by:** Vincent / Zara (OpenClaw)
