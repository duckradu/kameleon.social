## Generate encryption secrets

```bash
node -e "console.log(require('crypto').randomBytes(20).toString('hex'));"

# Or
node -e "console.log(require('crypto').randomBytes(20).toString('base64'));"

# Or
node -e "console.log(require('crypto').getRandomValues(new Uint32Array(15)).join(''));"
```