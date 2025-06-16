# 게임 아이템 SQL 세팅 자동화 도구

회사 재직 중 사내 아이템 개발 단계에서   
테스트용 데이터 세팅 작업을 자동화하기 위해 개인적으로 제작한 SQL 쿼리 생성 도구입니다.

반복적인 아이템 세팅 업무를 빠르고 간편하게 처리하는 데 활용했으며,  
더미 데이터를 사용하여 외부에 안전하게 공개할 수 있습니다.

---

## 프로젝트 구조

/backend - Express 기반 백엔드 서버  
/frontend - Svelte 기반 프론트엔드 앱


---

## 기술 스택

- Backend: Node.js, Express, MySQL2, dotenv, CORS  
- Frontend: Svelte, Rollup

---

## 실행 방법

### Backend

```bash
cd backend
npm install
npm start
```

기본적으로 index.js에서 서버가 실행됩니다.  
MySQL 연결 및 환경 변수 설정 필요 (.env 파일).

### Frontend
```bash
cd frontend
npm install
npm run dev
```

개발 서버가 `http://localhost:8888`에서 실행됩니다.

---

## 주요 기능

- 아이템 세팅용 SQL 쿼리 자동 생성  
- 더미 데이터 기반 테스트용 SQL 포함  
- 반복 작업 시간 단축 및 자동화 지원

---

## 주의 사항

- 더미 데이터를 기반으로 작성되어 실제 운영 데이터와는 다릅니다.  
- 외부 공개용으로 안전하게 설계되었습니다.
