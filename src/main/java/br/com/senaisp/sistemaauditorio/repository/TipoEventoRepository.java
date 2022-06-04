package br.com.senaisp.sistemaauditorio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.senaisp.sistemaauditorio.model.TipoEvento;

@Repository
public interface TipoEventoRepository extends PagingAndSortingRepository<TipoEvento, Long>{

	@Query("SELECT t FROM TipoEvento t WHERE t.nome LIKE %:nome% ")
	public List<TipoEvento> findByTipo(@Param("nome") String nome);
	
	@Query("SELECT t FROM TipoEvento t WHERE t.nome = :nome")
	public List<TipoEvento> nomeDuplicado(@Param("nome") String nome);
	
}