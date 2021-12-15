1. `package.json` need setting `"type": "module"`

2. install package
```
npm install -D husky chalk
```

3. move verify-commit.js to anywhere, e.g. 
```
scripts/verify-commit.js
```

4. add script, then you can use command.
```
{
  "scripts": {
    "commitlint": "node scripts/verify-commit.js"
  }
}
```

5. rename `.husky/_gitignore` to `.gitignore`.

6. delete this guide.
