# Super Notes Project

The Super Notes project (formally : Échalote) is a collaborative note taking application using the Markdown format.
This repository is the Frontend part of the project.


## Features 

Super Notes, in its actual version has multiples features :

- create an account 
- login 
- list all groups associated with the account in a retractable side bar
- create groups
- modify and delete groups
- add members to a group (letting them access its content)
- delete members from groups
- create pages with a title, a background color and tags
- modify and delete pages
- modify the content of a page with a Markdown text editor
- read the page content formated as HTML from Markdown



## Technologies  

- Vite
- React
- Typescript
- Tailwind


- React router
- ShadCN
- Lucide React
- Vitest


## How to run

After cloning the projet and installing the dependancies with `npm i` you can run the project using the following command : 

```bash
$ npm run dev
```

You will need to have the backend launched as well and to have set the following .env variables :

- VITE_REACT_APP_API_URL : the URL to the frontend

## Run tests and Linter

You can check the project comformity by launching tests or the Linter using the following commands :

Run tests :

```bash
$ npm run test
```

Run Linter :

```bash
$ npm run lint
```

## Author 

Developped by Louis Brochard, in the context of a school project.