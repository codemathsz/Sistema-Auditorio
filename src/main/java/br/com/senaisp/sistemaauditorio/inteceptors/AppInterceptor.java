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
public class AppInterceptor implements HandlerInterceptor{

	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

		System.out.println("Entrou no pre-handler");
		
		// VARIAVEL PARA OBTER A URI
		String uri = request.getRequestURI();
		System.out.println("Criou variavel URI");
	
		System.out.println("Antes if pag erro");
		// SE FOR PAGINA DE ERRO LIBERA
		if (uri.startsWith("/erro")) {
			return true;
		}	System.out.println("Depois if pag erro");
		
		// VERIFICA SE O HANDLER É UM HANDLER METHOD, O QUE INDICA QUE ELE ESTÁ CHAMANDO UM METODO EM ALGUM CONTROLLER
		if (handler instanceof HandlerMethod) {
			System.out.println("Entrou no if handlerMethod");
			
			// CASTING DE OBJECT PARA HANDLER METHOD
			HandlerMethod metodo = (HandlerMethod) handler;
			
			// SE FOR PAGINAS DE API LIBERA
		if (uri.startsWith("/api")) {
			
			System.out.println("Entrou no if api");
			// VARIAVEL PARA O TOKEN
			
			
			String token = request.getHeader("Authorization");
			
			if (metodo.getMethodAnnotation(Administrador.class) != null) {
				System.out.println("Entrou no if Ann/Meth/Admin");
				
//								token = (String) request.getAttribute("token");
				
				// BUSCANDO O ALGORITMO NO USUARIO 
				Algorithm algoritmo = Algorithm.HMAC512(UsuarioRestController.SECRET);
				
				// OBJ PARA VERIFICAR O TOKEN
				JWTVerifier verifier = JWT.require(algoritmo).withIssuer(UsuarioRestController.EMISSOR).build();
				
				// DECODIFICA O TOKEN
				DecodedJWT jwt = verifier.verify(token);
				
				// RECUPERA OS DADOS DO PLAYLOAD (CLAIMS SÃO VALORES QUE VEM NO PLAYLOAD)
				Map<String, Claim> claims = jwt.getClaims();
				
				Nivel nivel = Nivel.values()[Integer.parseInt(claims.get("nivel").toString())];
				
				if (nivel == Nivel.ADMINISTRADOR) {
					
					return true;
				}else {
					
					response.sendError(HttpStatus.UNAUTHORIZED.value(), "Acesso Negado");
					return false;
				}
				
				
			}
			
			if (metodo.getMethodAnnotation(Usuario.class) != null) {
				System.out.println("Entrou no if Ann/Meth/User");
				
		
//								token = (String) request.getAttribute("token");
				
				// BUSCANDO O ALGORITMO NO USUARIO 
				Algorithm algoritmo = Algorithm.HMAC512(UsuarioRestController.SECRET);
				
				// OBJ PARA VERIFICAR O TOKEN
				JWTVerifier verifier = JWT.require(algoritmo).withIssuer(UsuarioRestController.EMISSOR).build();
				
				// DECODIFICA O TOKEN
				DecodedJWT jwt = verifier.verify(token);
				
				// RECUPERA OS DADOS DO PLAYLOAD (CLAIMS SÃO VALORES QUE VEM NO PLAYLOAD)
				Map<String, Claim> claims = jwt.getClaims();
				
				Nivel nivel = Nivel.values()[Integer.parseInt(claims.get("nivel").toString())];
				
				
				if (nivel == Nivel.USUARIO) {
					
					return true;
				}else {
					
					response.sendError(HttpStatus.UNAUTHORIZED.value(), "Acesso Negado");
				}
			}
				
			return true;
			} else {	
				
				// VERFICA SE  ELE É PUBLICO
				if (metodo.getMethodAnnotation(Publico.class) != null) {
					
					return true;
				}
				
				return false;
			}
		}
		
		
		return true;
	}
	
}
