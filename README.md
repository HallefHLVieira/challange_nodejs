### RN's and RF's Backend
[x] - Endpoint para receber o arquivo txt das transações
[x] - Para cada linha do TXT:
  [x] - Cadastrar o cliente no banco de dados, caso não exista;
  [x] - Cadastrar a transação relacionada ao cliente;
  [x] - Não deixar duplicar a transação, caso ela já exista na base;
  [x] - Calcule o tempo da execução da leitura completa do arquivo.

[] - Endpoint de listagem de transação;
[] - Preferencialmente, faça a paginação para o frontend 
[] - Direto na consulta;
[] - Aplique os filtros de buscas;