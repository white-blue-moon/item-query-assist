-- ※ 주의: 아래 SQL 문은 실제 회사에서 사용된 데이터가 아닙니다.
--   테스트 및 예시 목적의 더미 데이터를 삽입하는 예제입니다.


-- example_item_data 테스트 데이터 삽입 (version=30)
DELETE FROM example_item_data WHERE version = 30;
INSERT INTO example_item_data (version, name_index, name_extra_index, ref_index, open_version, expiry_time, ref1, ref2, ref3, item_extra_info) VALUES
(30, 1, 1, 101, 12, '2025-12-31 23:59:59', 1000, 10, 3, '{"ref_info_1":2,"ref_info_2":5}'),
(30, 1, 2, 102, 12, NULL, 2000, 20, 3, '{"ref_info_1":3,"ref_info_2":1}'),
(30, 2, 1, 201, 12, '2025-11-30 12:00:00', 500, 5, 3, '{"ref_info_1":1,"ref_info_3":4}');

-- example_item_progress_data 테스트 데이터 삽입 (version=30)
DELETE FROM example_item_progress_data WHERE version = 30;
INSERT INTO example_item_progress_data (version, level, seq_a, seq_b, seq_c, name_index, name_extra_index) VALUES
(30, 0, 0, 0, 0, 1, 1),
(30, 0, 0, 0, 0, 1, 2),
(30, 0, 0, 0, 0, 2, 1);
