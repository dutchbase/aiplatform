#!/bin/bash
# Git History Secret Scanner
# Scans all commits in git history for leaked secrets

set -e

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

PATTERNS_FILE=".secrets-patterns"
OUTPUT_FILE="secrets-scan-report-$(date +%Y%m%d-%H%M%S).txt"

echo -e "${CYAN}🔍 Git History Secret Scanner${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if in git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not a git repository${NC}"
    exit 1
fi

# Check if patterns file exists
if [ ! -f "$PATTERNS_FILE" ]; then
    echo -e "${RED}❌ Error: $PATTERNS_FILE not found${NC}"
    exit 1
fi

# Get total number of commits
TOTAL_COMMITS=$(git rev-list --all --count)

if [ "$TOTAL_COMMITS" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No commits found in repository${NC}"
    exit 0
fi

echo "📊 Repository stats:"
echo "   Total commits: $TOTAL_COMMITS"
echo "   Scanning patterns: $(grep -v '^#' "$PATTERNS_FILE" | grep -v '^$' | wc -l)"
echo ""
echo "⏳ This may take a while for large repositories..."
echo ""

# Initialize report
echo "Git History Secrets Scan Report" > "$OUTPUT_FILE"
echo "Generated: $(date)" >> "$OUTPUT_FILE"
echo "Repository: $(git remote get-url origin 2>/dev/null || echo 'local')" >> "$OUTPUT_FILE"
echo "Total commits scanned: $TOTAL_COMMITS" >> "$OUTPUT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

SECRETS_FOUND=0
COMMITS_WITH_SECRETS=0
CURRENT_COMMIT=0

# Exclude patterns
EXCLUDE_PATTERN='(\.example$|\.sample$|\.template$|test|fixture|mock)'

# Function to check if value is fake
is_fake_value() {
    local value="$1"
    echo "$value" | grep -qiE '(your|my|example|test|fake|dummy|placeholder|xxx|changeme|replace|todo|fixme|\*\*\*|\.\.\.)'
}

# Scan each commit
git rev-list --all --reverse | while read -r commit; do
    CURRENT_COMMIT=$((CURRENT_COMMIT + 1))
    
    # Progress indicator
    if [ $((CURRENT_COMMIT % 10)) -eq 0 ]; then
        echo -ne "\r🔍 Scanning commit $CURRENT_COMMIT / $TOTAL_COMMITS"
    fi
    
    COMMIT_SHORT=$(git rev-parse --short "$commit")
    COMMIT_DATE=$(git show -s --format=%ci "$commit")
    COMMIT_AUTHOR=$(git show -s --format=%an "$commit")
    COMMIT_MSG=$(git show -s --format=%s "$commit")
    
    COMMIT_HAS_SECRETS=false
    
    # Get list of files in this commit
    FILES=$(git diff-tree --no-commit-id --name-only -r "$commit" | grep -vE "$EXCLUDE_PATTERN" || true)
    
    if [ -z "$FILES" ]; then
        continue
    fi
    
    # Scan each file
    while IFS= read -r file; do
        [ -z "$file" ] && continue
        
        # Get file content at this commit
        CONTENT=$(git show "$commit:$file" 2>/dev/null || continue)
        
        # Scan against each pattern
        while IFS= read -r pattern; do
            [[ -z "$pattern" || "$pattern" =~ ^# ]] && continue
            
            if echo "$CONTENT" | grep -qiE "$pattern"; then
                MATCHES=$(echo "$CONTENT" | grep -niE "$pattern")
                
                # Filter fake values
                REAL_MATCHES=""
                while IFS= read -r match; do
                    if ! is_fake_value "$match"; then
                        REAL_MATCHES+="$match"$'\n'
                    fi
                done <<< "$MATCHES"
                
                if [ -n "$REAL_MATCHES" ]; then
                    if [ "$COMMIT_HAS_SECRETS" = false ]; then
                        echo "" >> "$OUTPUT_FILE"
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT_FILE"
                        echo "🚨 SECRETS FOUND" >> "$OUTPUT_FILE"
                        echo "Commit: $COMMIT_SHORT" >> "$OUTPUT_FILE"
                        echo "Date: $COMMIT_DATE" >> "$OUTPUT_FILE"
                        echo "Author: $COMMIT_AUTHOR" >> "$OUTPUT_FILE"
                        echo "Message: $COMMIT_MSG" >> "$OUTPUT_FILE"
                        echo "" >> "$OUTPUT_FILE"
                        COMMIT_HAS_SECRETS=true
                        COMMITS_WITH_SECRETS=$((COMMITS_WITH_SECRETS + 1))
                    fi
                    
                    echo "  📄 File: $file" >> "$OUTPUT_FILE"
                    echo "  Pattern: $pattern" >> "$OUTPUT_FILE"
                    echo "  Matches:" >> "$OUTPUT_FILE"
                    echo "$REAL_MATCHES" | head -5 >> "$OUTPUT_FILE"
                    echo "" >> "$OUTPUT_FILE"
                    
                    SECRETS_FOUND=$((SECRETS_FOUND + 1))
                fi
            fi
        done < "$PATTERNS_FILE"
    done <<< "$FILES"
done

echo ""
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $SECRETS_FOUND -gt 0 ]; then
    echo -e "${RED}❌ SCAN COMPLETE: $SECRETS_FOUND secret(s) found in $COMMITS_WITH_SECRETS commit(s)${NC}"
    echo ""
    echo "📄 Full report saved to: $OUTPUT_FILE"
    echo ""
    echo -e "${YELLOW}🔒 URGENT: Git History Cleanup Required${NC}"
    echo ""
    echo "To remove secrets from git history:"
    echo ""
    echo "  Option 1: BFG Repo-Cleaner (recommended for large repos)"
    echo "    1. Install BFG: https://rtyley.github.io/bfg-repo-cleaner/"
    echo "    2. Run: bfg --replace-text passwords.txt"
    echo "    3. Force push: git push --force"
    echo ""
    echo "  Option 2: git-filter-repo (most thorough)"
    echo "    1. Install: pip install git-filter-repo"
    echo "    2. Run: git-filter-repo --path-glob '*.env' --invert-paths"
    echo "    3. Force push: git push --force"
    echo ""
    echo "  Option 3: GitHub Secret Scanning (if using GitHub)"
    echo "    1. Enable secret scanning in repo settings"
    echo "    2. GitHub will alert you to secrets"
    echo "    3. Rotate ALL exposed secrets immediately"
    echo ""
    echo "⚠️  WARNING: After cleaning history, all secrets must be rotated!"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ SCAN COMPLETE: No secrets found in $TOTAL_COMMITS commits${NC}"
    echo ""
    echo "📄 Report saved to: $OUTPUT_FILE"
    exit 0
fi
