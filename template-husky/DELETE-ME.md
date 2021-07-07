1. install package
```
npm install -D husky chalk
```

2. move verify-commit.js to anywhere, e.g. 
```
scripts/verify-commit.js
```

3. add script, then you can use command.
```
{
  "scripts": {
    "commitlint": "node scripts/verify-commit.js"
  }
}
```

4. rename `_gitignore` to `.gitignore`.

5. delete this guide.
