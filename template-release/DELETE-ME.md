0. `package.json` need setting `"type": "module"`

1. install package
```
npm install -D execa semver chalk enquirer
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