async function connect() {  
  const { Pool } = require("pg");

  if(global.connection)
      return global.connection.connect();

  const pool = new Pool({
    user: process.env.USER_NAME,
    host: process.env.HOST_NAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    port: process.env.PORT_NUMBER
  });
  
  const client = await pool.connect();
  console.log("O Pool de conexão foi criado com sucesso!")
  client.release();

  global.connection = pool;
  
  return pool.connect();
}

connect();

async function selectCostumer(id){
  const client = await connect();
  const res = await client.query("SELECT * FROM client WHERE cpf=$1", [id]);
  return res.rows;
}
async function selectCostumers(costumer){
  const client = await connect();
  const res = await client.query("SELECT * FROM client");
  return res.rows;
}

async function insertCostumers(customer) {

  const client = await connect()

  const sql = "INSERT INTO client(cpf, nome, email, idade, profissao) VALUES($1, $2, $3, $4, $5)"

  const values = [ customer.cpf, customer.nome, customer.email, customer.idade, customer.profissao ];

  await client.query(sql, values);

}  
async function deleteCostumer(id) {
  const client = await connect();
  const sql = "DELETE FROM client WHERE cpf=$1";
  const values = [id];
  await client.query(sql, values)
  }

module.exports = {
  insertCostumers,
  selectCostumers,
  selectCostumer,
  deleteCostumer
}

app.get('/client', async (req, res) => {
  const clientes = await db.selectCostumers();
  res.json(clientes);
});

app.delete("/client/:id", async (req, res) => {
  await db.deleteCustomer(req.params.id)
  res.sendStatus(204)
  })
