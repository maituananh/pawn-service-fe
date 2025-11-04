# Pawn service

This project will build a website (Pawn-service)

## Acknowledgements

Backend:

- Java 21
- Spring boot
- Mysql

Front-end

- Reactjs

## Documentation

[Front-end](git@github.com:maituananh/pawn-service-fe.git)

[Back-end uses anhkiet-branch branch](https://github.com/maituananh/front-app)

## Installation

Clone the project

```bash
  git clone git@github.com:maituananh/pawn-service-fe.git
```

Go to the project directory

```bash
  cd pawn-service-fe
```

Install dependencies

```bash
  npm i
```

Start the server

```bash
  npm run dev
```

## Deployment

```bash
How to do CI/CD?
1. Install docker on VPS
2. Create developer user: sudo addUser developer
3. Allow docker for developer user: sudo usermod -aG docker developer
4. Run github-runner by background: nohup ./run.sh > runner.log 2>&1 &
```
