// Historical rankings require recorded observations, never generated examples.
// Existing history.json, including user-provided records, remains untouched.
console.error('과거 순위 자동 생성은 중단되었습니다. 기존 history.json은 변경하지 않았습니다.');
console.error('실제 조회 결과를 기록하려면 순위 추적기의 조회 기능을 사용하세요.');
process.exitCode = 1;
