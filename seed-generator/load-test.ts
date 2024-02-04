import { Pool, PoolConfig } from 'pg';

const pgPool = new Pool({
  host: '0.0.0.0',
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'social_web',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

const testTable = 'test_table_1';
const numRows = 1000000; // Количество строк для записи

async function writeData() {
  let successfulWrites = 0;
  try {
    const client = await pgPool.connect();

    // Создаем тестовую таблицу, если она отсутствует
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${testTable} (
        id SERIAL PRIMARY KEY,
        data VARCHAR(255)
      );
    `);

    

    // Записываем данные в тестовую таблицу
    for (let i = 0; i < numRows; i++) {
      const data = `Test data ${i + 1}`;

      const result = await client.query(`
        INSERT INTO ${testTable} (data)
        VALUES ($1)
        RETURNING id;
      `, [data]);

      if (result.rows[0]?.id) {
        successfulWrites++;
      }
      console.log(`${successfulWrites} rows successfully written.`);
    }

    

    await client.release();
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    console.log(`${successfulWrites} rows successfully written.`);
    process.exit(); // Завершаем процесс после выполнения нагрузки
  }
}

writeData();