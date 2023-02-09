# :camera: photo-gallery
React와 NodeJS Express를 이용한 간단한 사진 갤러리

## :newspaper: 프로젝트 개요
[Javascript Mastery 유튜브 채널의 강의](https://www.youtube.com/watch?v=VsUzmlZfYNg)를 참조하여 만든 사진 갤러리 느낌의 웹 애플리케이션

## :wrench: 사용 기술 및 스택
### Frontend

- React
- React-Router-Dom
- React-Query
- Material UI

### Backend

- NodeJS
- Express
- MongoDB(Mongoose)
- Jsonwebtoken

## :gift: 주요 구현사항
### React-Query
위 강의의 프로젝트에서 Redux와 Redux-thunk 를 사용하여 프론트엔드에서 서버로의 비동기 요청을 처리한것과 다르게, React-Query를 사용하여 서버 상태를 관리하는 것이 더 간편하고, 
Redux를 사용하지 않는 입장에서 더 가볍다고 생각하여 이를 채택하였다. React-Query의 장점 중 하나인 캐싱 기능을 활용하여 똑같은 서버 요청을 내부 캐시에서 가져옴으로써 포스트 
목록이나 댓글 목록 등을 가져올 때 이미 데이터를 캐시에 가지고 있는 경우 화면에 빠르게 표시되었다. 또한, Mutation 기능을 활용하여 서버에 생성, 수정, 삭제 요청 등으로 요청 
데이터가 변하는 경우에도 inValidateQueries 메소드를 통해 React-Query가 알아서 refetch 하도록 처리할 수 있어 서버 요청을 단순화할 수 있었다.

### Access Token & Refresh Token
Access Token만을 사용하던 강의 구현에서 개인적으로 OAuth 2.0의 Refresh Token을 사용하는 방식을 더 공부해보고 싶어 이를 프로젝트에 적용하였다. Access Token이 탈취당했을 경우를
대비하여 유효 기간을 짧게 설정해 놓고 이를 보완하기 위해 유효 기간이 상대적으로 긴 Refresh Token을 Cookie에 저장해 두어 이를 활용하는 방식이다. 이렇게 할 경우 Access Token이
만료되어도 Cookie에 저장된 Refresh Token을 사용하여 새로운 Access Token을 발급받을 수 있기 때문에 사용자는 다시 로그인 할 필요 없이 로그인 상태를 지속할 수 있다. Refresh Token
또한 탈취당할 가능성이 있기 때문에 Cookie에서 XSS등의 공격을 방어하고자 httponly 옵션을 설정해두어 javascript로의 접근을 방지하였으며, Refresh 요청이 발생할 때마다 서버에서
DB에 저장해 둔 Refresh Token또한 교체하여 1회성으로 사용할 수 있도록 함으로써 보안적인 문제를 최소화하고자 하였다.

## :pencil2: 차후 구현 계획
- Posts 로드 시 버튼 방식에서 무한 스크롤 로딩으로 전환
- 검색 기능 및 태그 기반 검색 기능 구현
- Post 별 Tag 표시
- Tag Schema 따로 만들어서 관리
- 댓글 삭제 시 답글 달린 경우 지우는 것이 아닌, "삭제됨" 표시
- 유튜브처럼 내 댓글 맨 앞에 따로 표시
- UI 전체적으로 개선 (다크모드 등 기능 추가 포함)
- 프로필 및 세부 정보 페이지 구현
- 리팩토링, 안 쓰는 Hook이나 Api 제거
- DB Logging
- Post 조회수 수집 (IP 별)

## :blue_book: 참고 자료 (수정 중)
- [Cookie Expires 옵션](https://www.zerocho.com/category/HTTP/post/5b594dd3c06fa2001b89feb9)
- [로그인 기능 구현 참조](https://velog.io/@yaytomato/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%90%EC%84%9C-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0#-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EC%A0%80%EC%9E%A5%EC%86%8C-%EC%A2%85%EB%A5%98%EC%99%80-%EB%B3%B4%EC%95%88-%EC%9D%B4%EC%8A%88)
- [로그인 기능 구현 참조2 - 유튜브 재생목록](https://www.youtube.com/watch?v=brcHK3P6ChQ&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd)
- [Auth에 React-Query 적용](https://velog.io/@sorin44/React-Query-Section7-React-Query-and-Authentication)
- [React-Query 공부자료](https://tkdodo.eu/blog/practical-react-query)
- [파일 Drag&Drop 업로드](https://velog.io/@yiyb0603/React%EC%97%90%EC%84%9C-%EB%93%9C%EB%9E%98%EA%B7%B8-%EC%95%A4-%EB%93%9C%EB%A1%AD%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%ED%8C%8C%EC%9D%BC-%EC%97%85%EB%A1%9C%EB%93%9C-%ED%95%98%EA%B8%B0)
- [무한 스크롤 구현](https://velog.io/@handwoong/React-Query%EB%A1%9C-%EB%AC%B4%ED%95%9C%EC%8A%A4%ED%81%AC%EB%A1%A4-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)
