### Considerações importantes
O foco inicial na construção dessa aplicação foi em resolver o problema(funcionalidades essesnciais), então pontos relacionados a camadas da aplicação no backend e frontend foram despriorizados.

Porém, sei que em uma oportunidade de melhoria, eu poderia separar as responsabilidades dos arquivos, criar um bff no front para proteger ainda mais minhas requisições para o backend e melhorar o layout com uma estilização descente rs.

### Instruções para executar aplicação em localhost
- Certifique-se que o docker esteja instalado na sua máquina;
- Você precisará também do node na versão 20.12 ou superior, recomendo usar o nvm para alterar versão do node com mais praticidade.

- Clone o projeto em uma pasta de preferência com o comando:
```bash
git clone git@github.com:HallefHLVieira/desafio_vaga.git
```

-Crie um arquivo .env a partir do .env.example

- Vá até o diretório /backend e execute os comandos:
```bash
npm install
docker-compose up -d
npm run start:dev
```
- Em seguida vá até o diretório /frontend e execute os comandos:
```bash
npm install
npm run dev
```

- Feito isso, chame o endereço: http://localhost:3001 para abrir o dashboard



### RN's and RF's Backend
[x] - Endpoint para receber o arquivo txt das transações
[x] - Para cada linha do TXT:
  [x] - Cadastrar o cliente no banco de dados, caso não exista;
  [x] - Cadastrar a transação relacionada ao cliente;
  [x] - Não deixar duplicar a transação, caso ela já exista na base;
  [x] - Calcule o tempo da execução da leitura completa do arquivo.

[x] - Endpoint de listagem de transação;
[x] - Preferencialmente, faça a paginação para o frontend 
[x] - Direto na consulta;
[x] - Aplique os filtros de buscas;