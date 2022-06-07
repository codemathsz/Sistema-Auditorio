$(function() {

    //url para consumir a api em si do insta
    const url = "https://graph.facebook.com/17959538947782870/recent_media?user_id=17841453149857522&fields=media_url,media_type,timestamp,caption,permalink&access_token=EAAFiKm2TSz4BAIyLJXGxVQOWRXU3A3ZAKmUYce8HH4VynhaLZAeuvaogCjkNdiLJZBDwO1zGmXvzYTfXy8yKrhw1bjPzZAhvge0eOZAIphEUmXDvAMdbGNt9ZAFzyfTUVaPGDCQ2ySILWpDHfkiAZAEZBuClO2GHjNCuEFfazmzOlPH0lOLGvdj7"

    /* iremos percorrer as informações dessa url */
    $.get(url).then(function(response){

        //pega todas as informações que estamos solicitando
        //console.log('retorno: ', response.data);
        //funcionando até aqui e apresentando todas as informações das imagens ou videos

        let dadosJson = response.data;
        
        let conteudo = '<div class="row" style="padding-left:5px">';
        //let conteudoCarousel = '<div class="row" style="padding-left:5px">';

        for (let prog = 0; prog < dadosJson.length; prog++) {

            let feed = dadosJson[prog];
            
            //verificando se é diferente de nulo, ai ele apresenta as img, se não não ira apresentar
            let titulo = feed.caption !== null ? feed.caption : '';
            //serve para trazer valores e jogar dentro das divs com ID
            const div = document.getElementById('descInsta');
            div.innerHTML = titulo;

            //formatando a data, primeiramente buscando a data pelo 'feed' e logo depois formatando no padrão que eu desejo
            let dataInicio = new Date(feed.timestamp !== null ? feed.timestamp : '');
            let dataFormatada = ((dataInicio.getDate() )) + "/" + ((dataInicio.getMonth() + 1)) + "/" + dataInicio.getFullYear();
            //serve para trazer valores e jogar dentro das divs com ID
            const p = document.getElementById('dataInsta');
            p.innerHTML = dataFormatada;

            let tipo = feed.media_type;

            //formatando para caso no feed tenha um video
            if (tipo === 'VIDEO') {
                conteudo += '<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 col-xxl-4"><video style="width: 80%; height=90%" controls><source src="'+feed.media_url+'" type="video/mp4"></video></div>';
            }
            //formatando para caso no feed tenha uma img
            else if (tipo === 'IMAGE'){
                conteudo += '<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 col-xxl-4"><img style="width: 80%; height=90%" title="'+titulo+'\n" alt="'+titulo+ '\n' +dataFormatada+'" src="'+feed.media_url+'" onclick="window.open(\''+feed.permalink+'\');"></div><div>'+titulo+'</div><div>'+dataFormatada+'</div>';
            }
            //trazendo carrousel de fotos (posts com diversas imagens)
            else if(tipo == 'CAROUSEL_ALBUM'){
                conteudo += '<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 col-xxl-4"><img style="width: 80%; height=90%" title="'+titulo+ '\n' +dataFormatada+'" alt="'+titulo+ '\n' +dataFormatada+'" src="'+feed.media_url+'" onclick="window.open(\''+feed.permalink+'\');"></div><div>'+titulo+'</div><div>'+dataFormatada+'</div>'; 
            }
        }
        
        //aqui estou fechando a '<div>' do conteudo do 'let' para que a logica funcione
        conteudo += '</div>';
        //conteudoCarousel += '</div>';
        //setando o conteudo, para que ele print as img/video no html
        $('#insta').html(conteudo);
        //$('#instaCarousel').html(conteudoCarousel);

    })

});