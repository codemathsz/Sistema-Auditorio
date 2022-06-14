package br.com.senaisp.sistemaauditorio.inteceptors;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import br.com.senaisp.sistemaauditorio.annotation.Administrador;
import br.com.senaisp.sistemaauditorio.annotation.Publico;
import br.com.senaisp.sistemaauditorio.annotation.Usuario;
import br.com.senaisp.sistemaauditorio.model.Nivel;
import br.com.senaisp.sistemaauditorio.rest.UsuarioRestController;

@Component
public class AppInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {


		// VARIAVEL PARA OBTER A URI
		String uri = request.getRequestURI();
	

	
		// SE FOR PAGINA DE ERRO LIBERA
		if (uri.startsWith("/erro")) {
			return true;
		}
		
		// VERIFICA SE O HANDLER É UM HANDLER METHOD, O QUE INDICA QUE ELE ESTÁ CHAMANDO
		// UM METODO EM ALGUM CONTROLLER
		if (handler instanceof HandlerMethod) {
			

			// CASTING DE OBJECT PARA HANDLER METHOD
			HandlerMethod metodo = (HandlerMethod) handler;

			// SE FOR PAGINAS DE API LIBERA
			if (uri.startsWith("/api")) {

				
				// VARIAVEL PARA O TOKEN

				String token = null;

				if (metodo.getMethodAnnotation(Publico.class) != null) {
					
					return true;
					
				} else {
					
					token = request.getHeader("Authorization");
					
					// BUSCANDO O ALGORITMO NO USUARIO
					Algorithm algoritmo = Algorithm.HMAC512(UsuarioRestController.SECRET);

					// OBJ PARA VERIFICAR O TOKEN
					JWTVerifier verifier = JWT.require(algoritmo).withIssuer(UsuarioRestController.EMISSOR).build();

					// DECODIFICA O TOKEN
					DecodedJWT jwt = verifier.verify(token);

					// RECUPERA OS DADOS DO PLAYLOAD (CLAIMS SÃO VALORES QUE VEM NO PLAYLOAD)
					Map<String, Claim> claims = jwt.getClaims();

					Nivel nivel = Nivel.values()[Integer.parseInt(claims.get("nivel").toString())];
					
					if (metodo.getMethodAnnotation(Administrador.class) != null) {// SE O METODO QUE ESTA  TENTANDO ACESSAR TEM A ANOTAÇÃO ADM 
						
						if (nivel == Nivel.ADMINISTRADOR) {// SE O NIVEL DO USUARIO QUE ESTA TENTANDO ACESSAR É ADM
							
							
							response.setStatus(HttpStatus.OK.value());
							return true;
							
						} else {// SE NÃO É ADM BLOQUEIA
							
							
							
							response.sendError(HttpStatus.UNAUTHORIZED.value(), "Acesso Negado" );// RETORNA ERRO PARA O FRONT 
							
							return false;// BLOQUEIA
							
						}
						
					} else if (metodo.getMethodAnnotation(Usuario.class) != null) {// SE O METODO QUE ESTA SENDO ACESSADO TEM A ANOTAÇÃO USUARIO
						
						if (nivel == Nivel.USUARIO) {// VERIFICA SE O NIVEL DE QUEM ESTA ACESSANDO É USUARIO
							

							response.setStatus(HttpStatus.OK.value());
							return true;
							
						} else {// SE NÃO FOR BLOQUEIA
							
							response.sendError(HttpStatus.UNAUTHORIZED.value(), "Acesso Negado");// RETORNA ERRO PARA O FRONT
							return false;// BLOQUEIA
						}
					}
				}
			}
		}
		return true;
	}
}
