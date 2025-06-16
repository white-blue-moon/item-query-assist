<script>
	let inputValue = ''
	let readOnlyData = '(아이템 데이터 세팅 전용)' // 읽기 전용 입력창에 표시될 값
	let readOnlyUser = '(유저 데이터 세팅 전용)'
	const placeHolderText = `ex)
2_59
3_60
5_56
6_68
8_70
...`

	const apiUrl = 'http://localhost:7707'

	// 개행으로 구분된 값들을 배열로 담기 위한 함수
	function parseInput() {
		// 입력된 문자열을 개행으로 나누고 앞뒤 공백을 제거한 후 빈 줄을 필터링
		const linesArray = inputValue
				.split('\n') // 개행으로 나누기
				.map(line => line.trim()) // 각 줄의 앞뒤 공백 제거
				.filter(line => line.length > 0) // 빈 줄 제거

		return linesArray // linesArray를 반환
	}

	// 서버로 데이터를 전송하는 함수
	async function sendDataToServer(data) {
		try {
			const response = await fetch(apiUrl + '/test', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			if (response.ok) {
				const result = await response.json()
				readOnlyData = result.dataQuery
				readOnlyUser = result.userMailQuery
			} else {
				readOnlyData = 'Failed to send data'
				console.error('Server error:', response.statusText)
			}
		} catch (error) {
			readOnlyData = 'Error occurred'
			console.error('Fetch error:', error)
		}
	}

	// 버튼 클릭 시 호출되는 함수
	function handleClick() {
		const linesArray = parseInput()
		readOnlyData = '(쿼리를 추출 중입니다)\n(잠시만 기다려주세요)'
		readOnlyUser = '(쿼리를 추출 중입니다)\n(잠시만 기다려주세요)'
		alert(`쿼리 추출 요청을 보냈습니다!`)
		sendDataToServer(linesArray)
	}

	async function copyToClipboard(data) {
		try {
			await navigator.clipboard.writeText(data)
			alert('쿼리가 복사 되었습니다!')
		} catch (err) {
			console.error('Failed to copy: ', err)
		}
	}
</script>

<main>
	<h1>Item Query Extract</h1>

	<div class="input-group">
		<!-- 첫 번째 텍스트 영역 -->
		<textarea bind:value={inputValue} placeholder={placeHolderText}></textarea>

		<!-- 화살표 아이콘 -->
		<span class="arrow-icon">➔</span>

		<!-- 읽기 전용 텍스트 영역 -->
		<textarea value={readOnlyData} readonly></textarea>

		<!-- 화살표 아이콘 -->
		<span class="arrow-icon">➔</span>

		<!-- 읽기 전용 텍스트 영역 -->
		<textarea value={readOnlyUser} readonly></textarea>
	</div>

	<div class="button-group">
		<!-- 첫 번째 버튼 -->
		<button on:click={handleClick}>Extract</button>

		<!-- 두 번째 버튼 -->
		<button on:click={() => copyToClipboard(readOnlyData)}>Copy Data</button>

		<!-- 세 번째 버튼 -->
		<button on:click={() => copyToClipboard(readOnlyUser)}>Copy User Data</button>
	</div>

</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.input-group {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	textarea {
		width: 250px;  /* 텍스트 영역의 너비 */
		height: 550px;  /* 텍스트 영역의 높이 */
		padding: 10px;
		font-size: 16px;
		resize: none; /* 사용자가 크기 조정하지 못하도록 설정 */
	}

	.arrow-icon {
		margin: 0 10px;
		font-size: 20px;
		color: #333;
	}

	textarea[readonly] {
		background-color: #f0f0f0; /* 읽기 전용 텍스트 영역의 배경색 */
		cursor: not-allowed; /* 읽기 전용 커서를 변경 */
	}

	.button-group {
		display: flex;
		justify-content: space-between;
		width: 830px; /* 버튼 그룹의 너비를 텍스트 영역 그룹과 동일하게 설정 */
	}

	button {
		width: 250px;  /* 버튼의 너비를 텍스트 영역과 동일하게 설정 */
		padding: 10px;
		font-size: 16px;
	}
</style>
