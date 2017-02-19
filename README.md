API GoTo

Rotas:

---------Cards---------
POST /site/card Adiciona um Cartão ao usuario atual logado
   Body:
		   {
			    cardNumber: String,
			    expirationDate: Date,
			    flag: String,
			    cvCode: String,
			    userName: String
			}

DELETE /site/card/:id Deleta o cartão cujo o Id é id{
    cardNumber: String,
    expirationDate: Date,
    flag: String,
    cvCode: String,
    userName: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}

//TOOO Editar cartão


---------Company---------
POST /site/company Adiciona uma nova empresa

GET /site/company/:companyId/filter?category=CATEGORY Recupera as companhias da categoria CAT

GET /site/company/:companyId/parties Recupera as atividades desta empresa

--------------------------------Party-------------------

POST /site/party Adiciona uma party

GET /site/party/filter?type=TYPE&q=query[&compId=compId] Filtra as parties de acordo com a query e o tipo
	TIPO: MINE -> Indica que é para filtar dos eventos no qual o usuario participa
		  OWNER -> Indica que é para filtrar dos eventos no qual o usuario é dono
		  CLOSED -> Indica que é para filtrar dos eventos já fechados
		  COMP -> Indica que é parafiltrar dos eventos de uma deterinada empresa (Passar o id da empresa na query compId)

DELETE /site/party/:ptCode/kick/:userId Removes an user from a party

POST /site/party/contribute Adds an the current loged user to the partyCode in the request body	

POST /site/party/:id Edits a party

GET /site/party/:id Redirects to a page with the party with id

--------------------------------User-------------------

GET /site/user/home redirects to the home page

GET /site/user/mine Redirects to a page with the events that belongs to the current user

GET /site/user/participating Redirects to a page with the events that the user is participating

GET /site/user/closed Redirects to a page with the closed events of the user

GET /site/user/acount Redirects to a page to the user edit his acount

POST /site/user/acount Redirects to a page to the user edit his acount

POST /site/user/founds/add Adds the amount specified in the body to the user waller
