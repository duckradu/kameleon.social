## Generate encryption secrets

```bash
node -e "console.log(require('crypto').randomBytes(20).toString('hex'));"

# Or
node -e "console.log(require('crypto').randomBytes(20).toString('base64'));"

# Or
node -e "console.log(require('crypto').getRandomValues(new Uint32Array(15)).join(''));"
```

## Add a schema to `drizzle-orm`

Use the command below to generate necessary imports for /src/db/index.ts. This command needs to be executed manually when a new schema is created.

```bash
pnpm db:generate-root
```