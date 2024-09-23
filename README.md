
![tela](https://github.com/user-attachments/assets/6b77ba52-0d16-4092-9919-65e5f8c59f44)

### Considerações importantes
O foco principal na resolução deste desafio foi: Salvar arquivos em massa no melhor tempo possível, tendo em vista que a aplicação possa atender a requisitos de performance e escalabilidade mais facilmente.

Para isso:
- Escolhi manter a programação funcional ao invés da orientação a objetos com classes
  - Assim posso evitar problemas relacionados com a sobrecarga de memória;
  - Atuar mais próximo do paralelismo;
  - Reduzir mudanças de estado das minhas variáveis;

- Pontos relacionados a camadas da aplicação no backend e frontend foram despriorizados.

Porém, sei que em uma oportunidade de melhoria, eu poderia separar ainda mais as responsabilidades dos arquivos, criar um bff no front para acrescentar uma câmada de proteção para as requisições do frontend para o backend.

## Instruções para executar aplicação em localhost
- Certifique-se que o docker esteja instalado na sua máquina;
- Você precisará também do node na versão 20.12 ou superior, recomendo usar o nvm para alterar versão do node com mais praticidade.

### #Mãos na massa
- Clone o projeto em uma pasta de preferência com o comando:

```bash
git clone git@github.com:HallefHLVieira/desafio_vaga.git
```

#### #Run backend

- Abra seu terminal, vá até o diretório /backend e execute os seguintes comandos:
```bash
npm install
cp .env.example .env 
docker-compose up -d
npm run start:dev
```
- NPM install: Irá instalar todas as dependências necessárias para que o server backend funcione.
- cp: Irá fazer uma cópia do env.example para .env no diretório atual.
- docker-compose: Responsável por orquestrar o funcionamento de containers:
  - up: comando para subir as configurações presentes no arquivo: docker-compose.yml.
  - -d: parâmetro para que a execução dos containers fique em background.
- npmm run start:dev: Para iniciar a aplicação.

O backend estará disponível para acesso no endereço: http://localhost:3000

Caso queira testar as rotas manualmente, abaixo destaco os Curls para que use em algum cliente Rest como Postmant ou Insomnia.

Para fazer upload de um arquivo transacoes.txt
```bash
curl --request POST \
  --url http://localhost:3000/upload \
  --header 'Content-Type: multipart/form-data; boundary=---011000010111000001101001' \
  --cookie sessionId=f57f2146-5667-4b88-bc82-435dc6d15ed0 \
  --form file=@/home[YOUR_FILE_ADDRESS_HERE]fitransacoesle.txt
```
Para fazer o fetch e buscar as transações por meio de filtros (limit, cpnCnpj, startDate, endDate)
```bash
curl --request GET \
  --url 'http://localhost:3000/transactions?limit=25' \
  --cookie sessionId=f57f2146-5667-4b88-bc82-435dc6d15ed0
```

#### #Notas importantes:
- Foi configurado no docker-compose.yml duas imagens para o mongoDB
- Para acessar o visualizador e acompanhar as alterações no banco, acesse em seu navegador o endereço: http://localhost:8081/ e selecione a banco desejado,
no caso desse desafio, o nome do banco é o "tonline".

#### #Run frontend
- Em seguida vá até o diretório /frontend/transactions-app e execute os comandos:
```bash
npm install
npm run dev
```
- Feito isso, chame o endereço: http://localhost:3001 em seu navegador para abrir o dashboard:
Mongo: Imagem onde está a instalação do banco de dados em si.
Mongo-express: ondee se encontra a configuração de um visualizador do banco de dados, algo similar ao phpMyAdmin para o mySql.


### RN's and RF's Backend
- [x] Endpoint para receber o arquivo txt das transações;
- [x] Para cada linha do TXT;
- [x] Cadastrar o cliente no banco de dados, caso não exista;
- [x] Cadastrar a transação relacionada ao cliente;
- [x] Não deixar duplicar a transação, caso ela já exista na base;
- [x] Calcule o tempo da execução da leitura completa do arquivo;

- [x] Endpoint de listagem de transação;
- [x] Preferencialmente, faça a paginação para o frontend 
- [x] Direto na consulta;
- [x] Aplique os filtros de buscas;
