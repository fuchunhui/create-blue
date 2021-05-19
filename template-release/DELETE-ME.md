1. install package
```
npm install -D execa minimist semver chalk enquirer
```

2. move release.js to anywhere, e.g. 
```
scripts/release.js
```

3. add script, then you can use command.
```
{
  "scripts": {
    "release": "node scripts/release.js"
  }
}
```

4. delete this guide.