const express = require('express')
const cors    = require('cors')
const app     = express()
const port    = 7707
const db      = require('./db')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const ITEM = {
    VERSION:      30,
    OPEN_VERSION: 12,
    REWARD_TYPE:  2,
}

app.post('/test', async (req, res) => {
    try {
        const receivedData = req.body

        // 배열의 각 원소를 키로 하고, 객체를 값으로 추가
        const dataMap = new Map()
        receivedData.forEach(line => {
            const [nameIndex, nameExtraIndex] = line.split('_')

            dataMap.set(line, {
                name_index:       nameIndex,
                name_extra_index: nameExtraIndex,
                numbering_index:  line.replace('_', '00') // ex. 2_3 -> 2003
            })
        })

        const selectQuery = `
            SELECT * 
            FROM example_item_data 
            WHERE version = ${ITEM.VERSION} 
            AND name_index = ? 
            ORDER BY name_extra_index DESC LIMIT 1
        `
        const selectLastProgressIndex = `SELECT id FROM example_item_progress_data ORDER BY id DESC LIMIT 1`

        let insertItemValues   = []
        let deleteItemWhereArr = []
        const deleteItemQuery  = `DELETE FROM example_item_data WHERE version = ${ITEM.VERSION} AND `
        const insertItemQuery  = `INSERT INTO example_item_data (version, name_index, name_extra_index, open_version, expiry_time, ref1, ref2, ref3, item_extra_info) VALUES \n`

        let insertProgressValues   = []
        let deleteProgressWhereArr = []
        const deleteProgressQuery  = `DELETE FROM example_item_progress_data WHERE `
        const insertProgressQuery  = `INSERT INTO example_item_progress_data (version, id, level, seq_a, seq_b, seq_c, name_index, name_extra_index) VALUES \n`

        // 유저 데이터 세팅
        let insertMailValues = []
        const userID                  = `613`
        const setUserQuery            = `SET @USER_ID = ${userID}; \n`
        const deleteUserItemQuery     = `DELETE FROM user_item_inventory WHERE user_id = @USER_ID; \n`
        const deleteUserSelectedQuery = `DELETE FROM user_item_selection WHERE user_id = @USER_ID; \n`
        const deleteMailQuery         = `DELETE FROM user_mail_boxes WHERE user_id = @USER_ID AND reward_type = ${ITEM.REWARD_TYPE}; \n`
        const insertMailQuery         = `INSERT INTO user_mail_boxes (user_id, from_id, from_ref, ref_id, expired_at, reward_type, value, extra_ref, text, extra_json) VALUES \n`

        // 프로그레스 마지막 인덱스 확인
        const resProgress = await new Promise((resolve, reject) => {
            db.query(selectLastProgressIndex, (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
        let lastIdx = resProgress[0]?.id ?? 0

        for (const itemInfo of receivedData) {
            const nameIndex        = dataMap.get(itemInfo).name_index
            const nameExtraIndex   = dataMap.get(itemInfo).name_extra_index
            const numberingIndex   = dataMap.get(itemInfo).numbering_index
            const deleteWhereQuery = `(name_index = ${nameIndex} AND name_extra_index = ${nameExtraIndex})`
            deleteItemWhereArr.push(deleteWhereQuery)
            
            const deleteProgressWhere = `(name_index = ${nameIndex} AND name_extra_index = ${nameExtraIndex})`
            deleteProgressWhereArr.push(deleteProgressWhere)

            // 비동기적으로 쿼리 실행
            const result = await new Promise((resolve, reject) => {
                db.query(selectQuery, [nameIndex], (err, result) => {
                    if (err) return reject(err)
                    resolve(result)
                })
            })

            const data = result[0]
            if (!data) continue

            const insertValue = `(${ITEM.VERSION}, ${data.name_index}, ${nameExtraIndex}, ${ITEM.OPEN_VERSION}, ${data.expiry_time ? `'${data.expiry_time}'` : null}, ${data.ref1}, ${data.ref2}, ${data.ref3}, '${JSON.stringify(data.item_extra_info)}')`
            insertItemValues.push(insertValue)

            lastIdx++
            const insertProgressValue = `(${ITEM.VERSION}, ${lastIdx}, 0, 0, 0, 0, ${data.name_index}, ${nameExtraIndex})`
            insertProgressValues.push(insertProgressValue)

            const insertMailValue = `(@USER_ID, 0, 'SYSTEM', null, 0, ${ITEM.REWARD_TYPE}, ${numberingIndex}, -1, '${itemInfo}', null)`
            insertMailValues.push(insertMailValue)
        }

        // example_item_data 쪽 쿼리 세팅
        const comment             = '-- 아이템 데이터 세팅 쿼리 \n'
        const itemDeleteQuery     = deleteItemQuery + deleteItemWhereArr.join(' OR ') + ';' + '\n'
        const itemInsertQuery     = insertItemQuery + insertItemValues.join(',\n') + ';' + '\n\n'
        const progressDeleteQuery = deleteProgressQuery + deleteProgressWhereArr.join(' OR ') + ';' + '\n'
        const progressInsertQuery = insertProgressQuery + insertProgressValues.join(',\n') + ';'
        const dataQuery           = comment + (itemDeleteQuery + itemInsertQuery) + (progressDeleteQuery + progressInsertQuery)

        // 유저 데이터 쿼리 세팅
        insertMailValues.reverse() // 우편함에서 보여지는 아이템 순서를 실제 기입 순서와 동일하게 맞추기 위해 배열을 뒤집음
        const userQueryComment = `-- 우편함 지급 계정 세팅 \n`
        const userMailQuery = userQueryComment + setUserQuery + (deleteUserItemQuery + deleteUserSelectedQuery + deleteMailQuery) + insertMailQuery + insertMailValues.join(',\n') + ';'

        res.status(200).json({
            message:       'Data received successfully',
            dataQuery:     dataQuery,
            userMailQuery: userMailQuery,
        })
    } catch (err) {
        console.error('Error executing queries:', err)
        res.status(500).json({ message: 'Error executing queries', error: err })
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
