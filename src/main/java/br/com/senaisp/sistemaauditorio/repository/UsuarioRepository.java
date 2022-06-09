package br.com.senaisp.sistemaauditorio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.senaisp.sistemaauditorio.model.Nivel;
import br.com.senaisp.sistemaauditorio.model.Usuario;


@Repository
public interface UsuarioRepository extends PagingAndSortingRepository<Usuario, Long>{

	public Usuario findByNifAndSenha(String nif, String senha);
	public List<Usuario> findByAtivo(boolean ativo);
	
	// BUSCA PELO NOME, LIKE
	@Query("SELECT u FROM Usuario u WHERE u.nome LIKE %:nome% ")
	public List<Usuario> findByLikeNome(@Param("nome") String nome);
	
	// BUSCA PELO EMAIL, LIKE
	@Query("SELECT u FROM Usuario u WHERE u.email  LIKE %:email% ")
	public List<Usuario> findByLikeEmail(@Param("email") String email);
	
	// BUSCA PELO NIF, LIKE
	@Query("SELECT u FROM Usuario u WHERE u.nif  LIKE %:nif% ")
	public List<Usuario> findByLikeNif(@Param("nif") String nif);
	
	// BUSCA PELO NIVEL, LIKE
	public List<Usuario> findByNivel(Nivel nivel);
	
	@Query("SELECT u FROM Usuario u WHERE u.nif = :nif")
	public List<Usuario> nifDuplicado(@Param("nif") String nif);
	
	@Query("SELECT u FROM Usuario u WHERE u.email = :email")
	public List<Usuario> emailDuplicado(@Param("email") String email);
}
