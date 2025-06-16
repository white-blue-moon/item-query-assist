-- ※ 주의: 아래 SQL 테이블 정의는 실제 회사에서 사용된 구조가 아닙니다.
--   테스트 및 예시 목적으로 더미 데이터를 기반으로 작성되었습니다.


-- 아이템 정보 관리 테이블 (예시용)
DROP TABLE IF EXISTS example_item_data;
CREATE TABLE example_item_data (
    id                 INT AUTO_INCREMENT PRIMARY KEY COMMENT '기본 키',
    version            INT        NOT NULL COMMENT '버전 정보',
    name_index         INT        NOT NULL COMMENT '이름 인덱스',
    name_extra_index   INT        NOT NULL COMMENT '이름 보조 인덱스',
    ref_index          INT        NOT NULL COMMENT '참조 인덱스',
    open_version       INT        NOT NULL COMMENT '오픈 버전',
    expiry_time        DATETIME   NULL COMMENT '만료 시각',
    ref1               INT        NOT NULL COMMENT '참조값 1',
    ref2               INT        NOT NULL COMMENT '참조값 2',
    ref3               INT        NOT NULL COMMENT '참조값 3',
    item_extra_info    JSON       NOT NULL COMMENT '아이템 추가 정보(JSON 형식)',
    created_at         TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시각',
    updated_at         TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시각',
    UNIQUE KEY uq_ver_name (version, name_index, name_extra_index)
) CHARSET=utf8mb4 COMMENT='아이템 정보 관리 테이블 (예시용)';

-- 아이템 추가 정보 관리 테이블 (예시용)
DROP TABLE IF EXISTS example_item_progress_data;
CREATE TABLE example_item_progress_data (
    id                 INT AUTO_INCREMENT PRIMARY KEY COMMENT '기본 키',
    version            INT        NOT NULL COMMENT '버전 정보',
    level              INT        NOT NULL COMMENT '착용 가능 레벨',
    seq_a              INT        NOT NULL COMMENT '시퀀스 A',
    seq_b              INT        NOT NULL COMMENT '시퀀스 B',
    seq_c              INT        NOT NULL COMMENT '시퀀스 C',
    name_index         INT        NOT NULL COMMENT '이름 인덱스',
    name_extra_index   INT        NOT NULL COMMENT '이름 보조 인덱스',
    created_at         TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시각',
    updated_at         TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시각',
    UNIQUE KEY uq_ver_name (version, name_index, name_extra_index)
) CHARSET=utf8mb4 COMMENT='아이템 추가 정보 관리 테이블 (예시용)';
