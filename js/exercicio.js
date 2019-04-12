$(document).ready(function(){

    var tbDogs = localStorage.getItem("tbDogs");// Recupera os dados armazenados
    tbDogs = JSON.parse(tbDogs); // Converte string para objeto

    function listar(){  
        var dog = JSON.parse(tbDogs[tbDogs.length-1]);
        $("#vitrine").append(
            '<div class="resultado-dog">'+
                '<img class="img-dog" src="'+dog.Foto+'">'+
                '<div class="texto-foto '+dog.Cor+' '+dog.Font+'">'+
                    '<span>Raça:</span><span class="raca-resultado">'+dog.Raca+'</span><br>'+
                    '<span>Nome:</span><span class="nome-resultado">'+dog.Nome+'</span>'+                    
                '</div>'+           
            '</div>')
       
    }

    function showFeedback(status,message){
        if(status){
            toastr.success(message);
        }else{
            toastr.error(message);
        }
    }

    if(tbDogs == null){ // Caso não haja conteúdo, iniciamos um vetor vazio
         tbDogs = [];
    }else{
        listar();
    }
    
    // instanciar a API
    var XHR = ( new XMLHttpRequest() );

    // função
    var requestGet = function(url, callback){
        // catch response
        XHR.onreadystatechange = function(){
            if( XHR.readyState == 4 && XHR.status == 200 ){
                if( callback ){
                    callback(XHR.responseText);
                }
            }
        };
        // open
        XHR.open('GET', url, true);
        // check
        if( !url || typeof url !== 'string' || url.length < 2 ){
            return false;
        }else{
            // send
            XHR.send();
        }
    };

    requestGet('https://dog.ceo/api/breeds/list/all', function(res){
        var arrayJson = JSON.parse(res);
        var output = [];

        for (property in arrayJson.message) {
            output.push(property);
            $("#dogs").append('<option value="'+property+'">'+property+'</option>');
        }
    });

    $("#dogs").change(function(){
            var selecionado = $(this).children("option:selected").val();
            requestGet('https://dog.ceo/api/breed/'+selecionado+'/images/random', function(res){
            var imgDog = JSON.parse(res);
            $("#img-dog").attr("src",imgDog.message);
        });
        
    });

    function adicionar(){
        if($("#nome").val()=="" || $("#dogs").val()==null || $("#selecionar-cor").val()==null || $("#selecionar-font").val()==null){
            showFeedback(false,"Por favor, preencha todos os campos do cadastro do cão.");            
        }else{
        var dog = JSON.stringify({
            id:new Date(),
            Nome:$("#nome").val(),
            Cor:$("#selecionar-cor").children("option:selected").val(),
            Font:$("#selecionar-font").children("option:selected").val(),
            Raca:$("#dogs").children("option:selected").val(),
            Foto:$("#img-dog").attr("src"),
            Data: new Date()

        });
        tbDogs.push(dog);
        localStorage.setItem("tbDogs", JSON.stringify(tbDogs));
        showFeedback(true,"Cão cadastrado com sucesso! :)");
        listar();
        }
    }

    function excluirTodos(){
        localStorage.removeItem('tbDogs');
        $("#vitrine").html('');
        showFeedback(true,"Os cães foram excluídos com sucesso! :)");
    }

    $("#bt-salvar").click(function(){
        adicionar();
    });

    $("#bt-excluir-todos").click(function(){
        excluirTodos();
    });

});