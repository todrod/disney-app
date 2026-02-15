# GitHub Actions Deployment Setup

This enables automated deployment to the VPS (187.77.193.9) from GitHub.

## One-Time Setup (do this ONCE)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `disney-parks-guide`)
3. **Don't** initialize with README, .gitignore, or license
4. Copy the repository URL

### Step 2: Add Remote and Push

From your Mac:

```bash
cd /Users/todrod/.openclaw/workspace/projects/disney-app

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### Step 3: Generate SSH Key for GitHub Actions

From your Mac:

```bash
# Generate a new SSH key for GitHub Actions
ssh-keygen -t ed25519 -f ~/.ssh/github-actions-vps -N "" -C "github-actions@disney-app"

# Copy the public key
cat ~/.ssh/github-actions-vps.pub
```

### Step 4: Add Public Key to VPS

Either:
- **Option A:** SSH into VPS and add the key:
  ```bash
  ssh root@187.77.193.9
  mkdir -p ~/.ssh
  echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  exit
  ```

- **Option B:** Use Hostinger hPanel → VPS → Console and run the same commands

### Step 5: Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these 3 secrets:

| Secret Name | Value |
|------------|-------|
| `VPS_HOST` | `187.77.193.9` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | *Contents of `~/.ssh/github-actions-vps` (private key)* |

To copy the private key:
```bash
cat ~/.ssh/github-actions-vps
```

Copy EVERYTHING including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

## Done! Now I Can Deploy

After the one-time setup, I can:

1. **Deploy by pushing code:**
   - I make changes to the codebase
   - Run `git push`
   - GitHub Actions automatically triggers

2. **Deploy manually:**
   - Go to GitHub → Actions
   - Select "Deploy to VPS" workflow
   - Click "Run workflow"
   - Choose action:
     - `restart` - Restart the app
     - `rebuild` - Full clean rebuild
     - `diagnose` - Run diagnostics
     - `fix-nginx` - Fix Nginx configuration

## Current Issue: Fix Nginx

To fix the Nginx issue right now:

1. Complete the setup above (Steps 1-5)
2. Go to GitHub → Actions → Deploy to VPS
3. Click "Run workflow"
4. Select `fix-nginx` from the dropdown
5. Click "Run workflow"

This will:
- Remove the default Nginx site
- Restart Nginx
- Show the new configuration status

## Troubleshooting

### SSH connection fails
- Verify the public key was added to VPS correctly
- Check `~/.ssh/authorized_keys` on VPS contains the key
- Ensure no extra spaces or line breaks in the key

### GitHub Actions fails
- Check the Action logs in GitHub
- Verify all secrets are set correctly
- Ensure VPS is accessible (try `ssh root@187.77.193.9` from your Mac)

### Permission denied
- Ensure the private key has correct permissions: `chmod 600 ~/.ssh/github-actions-vps`
- Re-add the key to GitHub secrets if needed
