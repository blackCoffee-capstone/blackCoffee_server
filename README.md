# 프로젝트 소개
## '지금, 여기'

<br>
<p align="center"><img src="./src/assets/image/common/logo-primary.svg" alt="now_here" width="200px" /></p>
<br>

'지금, 여기'는 SNS 빅데이터를 분석하여 새롭게 떠오르는 여행지를 추천해주고 관련 정보를 제공해주는 서비스입니다.  
아주대학교 캡스톤디자인 수업의 일환으로 04.blackCoffee 팀이 개발하였습니다.  
이 프로젝트는 해당 서비스의 백엔드 서버를 구성합니다.  
'지금, 여기' 사이트 주소: https://www.jigeumyeogi.com  

<br>

## 04.blackCoffee 팀
| role | name | part | email | 
| :--: | :--: | :-- | :-- |
| 팀장 | 임종용 | 프론트 개발 | bellmir@ajou.ac.kr |
| 팀원 | 이수민 | 백엔드 개발 | tnals1178@ajou.ac.kr |
| 팀원 | 이동훈 | 빅데이터 분석 모델 개발 | oss002@ajou.ac.kr |
| 팀원 | 정예은 | SNS 데이터 크롤링 및 백엔드 개발| skqhs7276@ajou.ac.kr |
| 팀원 | 공민경 | 개발자 페이지 개발 | alsrud991026@ajou.ac.kr |

<br>

# 사용 라이브러리 및 개발 환경 (NestJS)
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 폴더 구조

- config : 설정파일
- decorators : 데코레이터 설정파일
- entities : entity 파일
- mailer : mail 설정파일
- public : 정적파일 (js, css)
- views : hbs 파일
- mock : mock db 파일
- types : enum 파일
- database : database 설정파일
  - seeds : seed data
- modules : module 파일
  - dto : data type 명시 파일
  - guards : guard 파일 (미들웨어)
  - strategies : strategy 파일 (미들웨어)
  - .docs.ts : swagger 작성파일 (API 문서)

# How to run

Make sure node.js 16 is installed

## Run the application in local

1. Git clone this repo and cd into the directory.
2. Install dependencies.

```bash
npm install
```

3. Run.

```bash
npm run start:dev
```

## Nestjs on Docker for Development

1. Make sure postgres is running if this app needs it.
2. Git clone this repo and cd into the directory.
3. Run with `docker-compose`. docker-compose.dev.yml is intended for development environments.

```bash
docker-compose -f docker-compose.dev.yml up
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

-   Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
-   Website - [https://nestjs.com](https://nestjs.com/)
-   Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
