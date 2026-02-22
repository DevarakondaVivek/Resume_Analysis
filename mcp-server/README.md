# Firebase Auth MCP Server

This is a local [Model Context Protocol (MCP)](https://modelcontextprotocol.io) Server that bridges your AI Assistant directly into your Firebase Authentication environment.

## What it does
When running, this server privately exposes tools to your AI so it can query active users and verify JWT ID Tokens right from the chat window using your administrative `firebase-admin` credentials.

**Exposed Tools:**
- `get-firebase-user-by-email`: Fetches full Firebase user profile JSON.
- `get-firebase-user-by-uid`: Fetches user profile by ID.
- `verify-firebase-id-token`: Decodes a client JWT token to prove authentication.

## Getting Started

1. **Install Dependencies & Build**
   ```bash
   npm install
   npm run build
   ```

2. **Add your Firebase Service Account**
   - Go to your Firebase Console -> Project Settings -> Service Accounts.
   - Click **Generate new private key** (this downloads a `.json` file).
   - Copy the `.env.example` file to a new file named `.env` in this folder:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and paste the ENTIRE contents of that downloaded `.json` file as a single-line string into `FIREBASE_SERVICE_ACCOUNT_KEY=...`

## Connecting to your AI

You can connect this server to any MCP-compatible client. 

### Claude Desktop
Add exactly this to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "firebase-auth": {
      "command": "node",
      "args": [
        "ABSOLUTE_PATH_TO_YOUR_PROJECT/mcp-server/build/index.js"
      ]
    }
  }
}
```

### Cursor IDE
1. Open Cursor Settings -> Features -> MCP Servers.
2. Click **+ Add New MCP Server**.
3. Set **Type** to `command`.
4. Set **Name** to `Firebase Auth`.
5. Set **Command** to: `node ABSOLUTE_PATH_TO_YOUR_PROJECT/mcp-server/build/index.js`

Restart your AI client, and you can now ask it to "Look up the Firebase user info for test@example.com"!
