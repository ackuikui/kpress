# Kpress
kpress use for generate ssg blog, study base on vuepress source code

## install
`npm i kpress`

## mkdir(docs) and create one md file
/docs/
  hello.md

## add npm script use kpress command in package.json
``` json
  "scripts": {
    "build": "kpress"
  },
```

## build generate fil'blog' 
`npm run build`
/blog/
   hello.html
   /assets/
