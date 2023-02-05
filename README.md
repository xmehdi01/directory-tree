Directory-Tree
===
Application let you draw hierarchy of a the current directory.
### Install
```
npm install -g ts-node typescript '@types/node'
```
### Run
```
ts-node app.ts
```
## Demo
```
📄—app.ts        
📂—Folder        
    📂—deepFolder
        📄—1.js  
        📄—2.js  
📄—package-lock.json
📄—package.json
📄—README.md
📄—tsconfig.json
```

## ToDo:
 - [ ] Add possibility to specific the folder you want to draw its hierarchy `<directory_path>`.
 - [ ] Add some details of file (How much items contains, and its size kb, date/time created ).